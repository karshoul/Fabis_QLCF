import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null); // nếu != null thì là đang sửa

  // 🔹 Lấy danh sách sản phẩm + danh mục khi load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  // 🔹 Gửi form thêm hoặc sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("price", formData.price);
      form.append("description", formData.description);
      form.append("categoryId", formData.categoryId);
      if (formData.image) form.append("image", formData.image);

      if (editingProduct) {
        // cập nhật sản phẩm
        await axios.put(
          `http://localhost:8080/api/admin/products/${editingProduct._id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // thêm mới
        await axios.post("http://localhost:8080/api/admin/products", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Thêm sản phẩm thành công!");
      }

      setFormData({ name: "", price: "", description: "", categoryId: "", image: null });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      alert("Lỗi khi lưu sản phẩm.");
    }
  };

  // 🔹 Bật / Tắt trạng thái
  const toggleStatus = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/products/${id}/toggle`);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi đổi trạng thái:", error);
    }
  };

  // 🔹 Xóa sản phẩm
  const deleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  // 🔹 Chọn sản phẩm để sửa
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      categoryId: product.category?._id || "",
      image: null,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Quản lý sản phẩm</h1>

        {/* 🔹 Form thêm / sửa */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow mb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Tên sản phẩm"
            className="border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Giá sản phẩm (VNĐ)"
            className="border p-2 rounded"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <select
            className="border p-2 rounded"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            className="border p-2 rounded"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          />
          <textarea
            placeholder="Mô tả sản phẩm"
            className="border p-2 rounded md:col-span-2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded md:col-span-2"
          >
            {editingProduct ? "💾 Lưu thay đổi" : "➕ Thêm sản phẩm"}
          </button>
        </form>

        {/* 🔹 Danh sách sản phẩm */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Danh sách sản phẩm</h2>

          <table className="w-full border text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Ảnh</th>
                <th className="p-3 border">Tên</th>
                <th className="p-3 border">Giá</th>
                <th className="p-3 border">Danh mục</th>
                <th className="p-3 border">Trạng thái</th>
                <th className="p-3 border text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">
                    <img
                      src={`http://localhost:8080${p.image_url}`}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 border">{p.name}</td>
                  <td className="p-3 border">{p.price.toLocaleString()} đ</td>
                  <td className="p-3 border">{p.category?.name}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => toggleStatus(p._id)}
                      className={`px-3 py-1 rounded text-white ${
                        p.is_active ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      {p.is_active ? "Còn hàng" : "Hết hàng"}
                    </button>
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 bg-yellow-400 rounded mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
