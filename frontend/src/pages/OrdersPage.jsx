import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error);
  }, []);

  const handleView = (orderId) => {
    fetch(`/api/admin/orders/${orderId}`)
      .then((res) => res.json())
      .then(setSelectedOrder)
      .catch(console.error);
  };

  const handleDelete = (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn này?")) return;
    fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" })
      .then(() => {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        if (selectedOrder && selectedOrder._id === orderId) setSelectedOrder(null);
      })
      .catch(console.error);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách đơn hàng</h1>
        
        {/* Danh sách đơn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow rounded-xl p-5 border border-gray-100 cursor-pointer hover:shadow-lg"
                 onClick={() => handleView(order._id)}>
              <h2 className="font-semibold text-lg">Bàn: {order.table.name} ({order.table.tableCode})</h2>
              <p>Trạng thái: {order.status}</p>
              <p>Tổng sản phẩm: {order.products.length}</p>
              <p>Tổng tiền: {order.total} đ</p>
            </div>
          ))}
        </div>

        {/* Modal chi tiết đơn hàng */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-96 p-6 max-h-[90vh] overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h2>
              <p><strong>Bàn:</strong> {selectedOrder.table.name} ({selectedOrder.table.tableCode})</p>
              <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
              <p><strong>Tổng tiền:</strong> {selectedOrder.total} đ</p>
              <h3 className="mt-3 font-medium">Sản phẩm:</h3>
              <ul className="mt-1 text-sm">
                {selectedOrder.products.map((p, i) => (
                  <li key={i}>{p.name} x{p.quantity} {p.note && `(${p.note})`} - {p.price * p.quantity} đ</li>
                ))}
              </ul>
              <div className="flex justify-end gap-2 pt-4">
                <button onClick={() => setSelectedOrder(null)} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">Đóng</button>
                <button onClick={() => handleDelete(selectedOrder._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Xóa</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
