// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
<<<<<<< HEAD
import { Toaster } from "sonner";
import CategoriesPage from "./pages/CategoriesPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* DashboardPage là trang chính */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoriesPage/>}/>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
=======
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import TablesPage from "./pages/TablesPage";
import OrdersPage from "./pages/OrdersPage";
import ReportsPage from "./pages/ReportsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </BrowserRouter>
>>>>>>> ecf26401ac69046ee97d397a781e29f813dc4d3d
  );
}

export default App;
