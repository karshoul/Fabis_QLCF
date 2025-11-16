import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
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
  );
}

export default App;
