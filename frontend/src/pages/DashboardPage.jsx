import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";

// Component gọn cho card thống kê
const StatCard = ({ title, value, color }) => {
  const borderColors = {
    blue: "border-t-blue-500",
    orange: "border-t-orange-500",
    green: "border-t-green-500",
    yellow: "border-t-yellow-500",
  };

  const textColors = {
    blue: "text-blue-600",
    orange: "text-orange-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow hover:scale-[1.02] transition-transform ${borderColors[color]}`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${textColors[color]}`}>{value}</p>
    </div>
  );
};

// Placeholder biểu đồ
const ChartPlaceholder = () => (
  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
    📊 Biểu đồ doanh thu & sản phẩm bán chạy (đang phát triển...)
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    products: 0,
    revenue: 0,
  });

  useEffect(() => {
    // TODO: fetch dữ liệu thật từ API
    setStats({
      users: 5,
      categories: 4,
      products: 12,
      revenue: 12500000,
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500 mt-2">Xin chào, Admin 👋</p>
        </header>

        {/* Thống kê nhanh */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Nhân viên" value={stats.users} color="blue" />
          <StatCard title="Danh mục" value={stats.categories} color="orange" />
          <StatCard title="Sản phẩm" value={stats.products} color="green" />
          <StatCard title="Doanh thu (VNĐ)" value={stats.revenue.toLocaleString()} color="yellow" />
        </section>

        {/* Biểu đồ / Thống kê tổng quan */}
        <section className="bg-white rounded-xl p-8 shadow">
          <h2 className="text-xl font-semibold mb-6">Thống kê tổng quan</h2>
          <ChartPlaceholder />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
