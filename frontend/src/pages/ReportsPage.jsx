// Thống kê, báo cáo
import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";

const ReportsPage = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [report, setReport] = useState(null);

  const fetchReport = () => {
    fetch(`/api/admin/reports/daily?date=${date}`)
      .then((res) => res.json())
      .then(setReport)
      .catch(console.error);
  };

  useEffect(() => {
    fetchReport();
  }, [date]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Báo cáo doanh thu theo ngày</h1>

        {/* Chọn ngày */}
        <div className="mb-6">
          <label className="mr-2 font-medium">Chọn ngày:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {/* Thông tin tổng quan */}
        {report && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow rounded-xl p-4 border-t-4 border-orange-500">
              <p className="text-gray-500 text-sm">Tổng đơn trong ngày</p>
              <p className="text-2xl font-bold text-gray-800">{report.totalOrders}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4 border-t-4 border-green-500">
              <p className="text-gray-500 text-sm">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-green-600">{report.totalRevenue} đ</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4 border-t-4 border-blue-500">
              <p className="text-gray-500 text-sm">Ngày</p>
              <p className="text-2xl font-bold text-blue-600">{report.date}</p>
            </div>
          </div>
        )}

        {/* Danh sách đơn hàng chi tiết */}
        {report && report.orders.length > 0 ? (
          <div className="bg-white shadow rounded-xl p-4 border border-gray-100">
            <h2 className="text-lg font-semibold mb-2">Chi tiết đơn hàng</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">Bàn</th>
                  <th className="border-b p-2">Sản phẩm</th>
                  <th className="border-b p-2">Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {report.orders.map((order) => (
                  <tr key={order._id}>
                    <td className="border-b p-2">{order.table.tableCode}</td>
                    <td className="border-b p-2">
                      {order.products.map((p, i) => (
                        <div key={i}>{p.product.name} x{p.quantity}</div>
                      ))}
                    </td>
                    <td className="border-b p-2">{order.total} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Chưa có đơn hàng nào trong ngày này.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
