import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-screen shadow-lg p-5 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
      <Link to="/" className="hover:text-blue-600">Dashboard</Link>
      <Link to="/employees" className="hover:text-blue-600">Nhân viên</Link>
      <Link to="/categories" className="hover:text-blue-600">Danh mục</Link>
      <Link to="/products" className="hover:text-blue-600">Sản phẩm</Link>
      <Link to="/tables" className="hover:text-blue-600">Bàn / Khu vực</Link>
      <Link to="/orders" className="hover:text-blue-600">Đơn hàng</Link>
    </div>
  );
};

export default Sidebar;
