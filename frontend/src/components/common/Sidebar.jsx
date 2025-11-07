import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaList, FaCoffee, FaChair, FaClipboardList } from "react-icons/fa";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 transition-colors ${
      isActive ? "bg-blue-200 font-semibold" : ""
    }`;

  return (
    <div className="w-64 bg-white h-screen shadow-lg p-5 flex flex-col gap-4 overflow-y-auto">

      <NavLink to="/" className={linkClass} end>
        <FaTachometerAlt /> Dashboard
      </NavLink>
      <NavLink to="/employees" className={linkClass}>
        <FaUsers /> Nhân viên
      </NavLink>
      <NavLink to="/categories" className={linkClass}>
        <FaList /> Danh mục
      </NavLink>
      <NavLink to="/products" className={linkClass}>
        <FaCoffee /> Sản phẩm
      </NavLink>
      <NavLink to="/tables" className={linkClass}>
        <FaChair /> Bàn / Khu vực
      </NavLink>
      <NavLink to="/orders" className={linkClass}>
        <FaClipboardList /> Đơn hàng
      </NavLink>
    </div>
  );
};

export default Sidebar;
