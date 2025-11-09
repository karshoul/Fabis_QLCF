import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Modal from "../components/common/Modal";

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [areas] = useState(["Mang về", "ShopeeFood", "GrabFood", "Hotline"]);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [form, setForm] = useState({
    name: "",
    area: "",
    tableCode: "",
    status: "available",
    products: [], // { productId, name, quantity, note }
  });

  // ====== API giả lập ======
  useEffect(() => {
    // Fetch bàn từ API (adminControllers.getTables)
    fetch("/api/admin/tables")
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => console.error(err));

    // Fetch sản phẩm từ API (adminControllers.getProducts)
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // ====== Thêm bàn ======
  const handleAdd = () => {
    setEditingTable(null);
    setForm({
      name: "",
      area: "",
      tableCode: "",
      status: "available",
      products: [],
    });
    setShowForm(true);
  };

  // ====== Chỉnh sửa bàn ======
  const handleEdit = (table) => {
    setEditingTable(table);
    setForm({
      name: table.name,
      area: table.area?.name || table.area || "",
      tableCode: table.tableCode,
      status: table.status,
      products: table.products || [],
    });
    setShowForm(true);
  };

  // ====== Xóa bàn ======
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bàn này?")) return;

    fetch(`/api/admin/tables/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setTables((prev) => prev.filter((t) => t._id !== id)))
      .catch((err) => console.error(err));
  };

  // ====== Thêm / Sửa bàn ======
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.area) {
      alert("Vui lòng nhập tên bàn và chọn khu vực!");
      return;
    }

    const payload = {
      name: form.name,
      area: form.area,
      products: form.products,
    };

    if (editingTable) {
      // Update bàn
      fetch(`/api/admin/tables/${editingTable._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          setTables((prev) =>
            prev.map((t) => (t._id === editingTable._id ? data.table : t))
          );
        })
        .catch((err) => console.error(err));
    } else {
      // Tạo mới bàn, API tự tạo tableCode + status
      fetch(`/api/admin/tables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => setTables((prev) => [...prev, data.table]))
        .catch((err) => console.error(err));
    }

    setShowForm(false);
    setEditingTable(null);
  };

  // ====== Thêm sản phẩm vào bàn ======
  const handleAddProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [...prev.products, { productId: "", name: "", quantity: 1, note: "" }],
    }));
  };

  // ====== Cập nhật sản phẩm trong bàn ======
  const handleUpdateProduct = (index, field, value) => {
    const updatedProducts = [...form.products];
    updatedProducts[index][field] = value;

    // Nếu đổi productId, tự động set name
    if (field === "productId") {
      const prod = products.find((p) => p._id === value);
      updatedProducts[index].name = prod?.name || "";
    }

    setForm((prev) => ({ ...prev, products: updatedProducts }));
  };

  // ====== Xóa sản phẩm trong bàn ======
  const handleDeleteProduct = (index) => {
    const updatedProducts = [...form.products];
    updatedProducts.splice(index, 1);
    setForm((prev) => ({ ...prev, products: updatedProducts }));
  };

  // ====== Hiển thị trạng thái ======
  const getStatusLabel = (status) =>
    status === "available" ? "Trống" : "Đang sử dụng";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Quản lý bàn / khu vực
            </h1>
            <p className="text-gray-500 text-sm">
              Thêm, sửa, xóa bàn và theo dõi trạng thái
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Thêm bàn
          </button>
        </header>

        {/* Danh sách bàn */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tables.map((table) => (
            <div
              key={table._id}
              className="bg-white shadow rounded-xl border border-gray-100 p-5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    {table.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Mã bàn: {table.tableCode}
                  </p>
                  <p className="text-sm text-gray-500">
                    Khu vực: {table.area?.name || table.area}
                  </p>
                  {table.products?.length > 0 && (
                    <ul className="mt-2 text-sm">
                      {table.products.map((p, i) => (
                        <li key={i}>
                          {p.name} x{p.quantity} {p.note && `(${p.note})`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    table.status === "available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {getStatusLabel(table.status)}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(table)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(table._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Modal Thêm / Sửa bàn */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-96 p-6 max-h-[90vh] overflow-auto">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editingTable ? "Chỉnh sửa bàn" : "Thêm bàn mới"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Tên bàn
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Khu vực
                  </label>
                  <select
                    value={form.area}
                    onChange={(e) =>
                      setForm({ ...form, area: e.target.value })
                    }
                    className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  >
                    <option value="">-- Chọn khu vực --</option>
                    {areas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sản phẩm */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Sản phẩm trong bàn
                  </label>
                  {form.products.map((p, i) => (
                    <div
                      key={i}
                      className="flex gap-2 mb-2 items-center"
                    >
                      <select
                        value={p.productId}
                        onChange={(e) =>
                          handleUpdateProduct(i, "productId", e.target.value)
                        }
                        className="border rounded-lg p-1 flex-1"
                      >
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map((prod) => (
                          <option key={prod._id} value={prod._id}>
                            {prod.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={p.quantity}
                        onChange={(e) =>
                          handleUpdateProduct(i, "quantity", e.target.value)
                        }
                        className="border rounded-lg p-1 w-16"
                      />
                      <input
                        type="text"
                        placeholder="Ghi chú"
                        value={p.note}
                        onChange={(e) =>
                          handleUpdateProduct(i, "note", e.target.value)
                        }
                        className="border rounded-lg p-1 flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(i)}
                        className="text-red-600 font-bold"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="mt-1 text-sm text-blue-600 hover:underline"
                  >
                    + Thêm sản phẩm
                  </button>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    {editingTable ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablesPage;
