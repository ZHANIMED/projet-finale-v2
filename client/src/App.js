import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

// pages existantes (d'après ta capture)
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import CategoryPage from "./Pages/CategoryPage";
import Cart from "./Pages/Cart";
import Profile from "./Pages/Profile";
import Invoice from "./Pages/Invoice";
import Error from "./Pages/Error";

// admin
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminProducts from "./Pages/admin/AdminProducts";
import AdminCategories from "./Pages/admin/AdminCategories";
import AdminOrders from "./Pages/admin/AdminOrders";
import AdminStats from "./Pages/admin/AdminStats";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/invoice" element={<Invoice />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/stats" element={<AdminStats />} />

          {/* 404 */}
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </>
  );
}

export default App;