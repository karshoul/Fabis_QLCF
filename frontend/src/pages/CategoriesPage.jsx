// Thêm/Sửa/Xóa danh mục
import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Table from "../components/common/Table";
import Modal from "../components/common/Modal";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Lấy danh sách danh mục từ backend
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Thêm danh mục
  const handleAdd = () => {
    setEditingCategory(null);
    setModalContent(
      <CategoryForm
        onSubmit={async (formData) => {
          try {
            const res = await fetch("/api/admin/categories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            fetchCategories();
            setModalOpen(false);
          } catch (err) {
            alert(err.message);
          }
        }}
      />
    );
    setModalOpen(true);
  };

  // Sửa danh mục
  const handleEdit = (category) => {
    setEditingCategory(category);
    setModalContent(
      <CategoryForm
        category={category}
        onSubmit={async (formData) => {
          try {
            const res = await fetch(`/api/admin/categories/${category._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            fetchCategories();
            setModalOpen(false);
          } catch (err) {
            alert(err.message);
          }
        }}
      />
    );
    setModalOpen(true);
  };

  // Xóa danh mục
  const handleDelete = async (categoryId) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục sản phẩm</h1>
          <p className="text-gray-500 mt-1">Thêm, sửa, xóa và quản lý các danh mục</p>
        </header>

        {/* Thống kê */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-orange-500">
            <h3 className="text-sm font-medium text-gray-500">Tổng số danh mục</h3>
            <p className="text-3xl font-bold mt-2 text-orange-600">{categories.length}</p>
          </div>
        </section>

        {/* Bảng danh mục */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Danh sách danh mục</h2>
          <button
            className="mb-3 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            onClick={handleAdd}
          >
            Thêm danh mục
          </button>
          <Table
            columns={["Tên danh mục", "Mô tả", "Hành động"]}
            data={categories.map((c) => ({
              name: c.name,
              description: c.description || "-",
              actions: (
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleEdit(c)}
                  >
                    Sửa
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(c._id)}
                  >
                    Xóa
                  </button>
                </div>
              ),
            }))}
          />
        </section>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default CategoriesPage;

// ----------------- Component Form -----------------
const CategoryForm = ({ category, onSubmit }) => {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label>
        Tên danh mục:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        />
      </label>
      <label>
        Mô tả:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        />
      </label>
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {category ? "Cập nhật" : "Thêm"}
      </button>
    </form>
  );
};
