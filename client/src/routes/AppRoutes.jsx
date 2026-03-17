import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Shop from "../Pages/Shop";
import Category from "../Pages/Category";
import Cart from "../Pages/Cart";
import Checkout from "../Pages/Checkout";
import Categories from "../Pages/Categories";
import ProductDetails from "../Pages/ProductDetails";
import Admin from "../Pages/Admin";
import Login from "../Pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/category/:type" element={<Category />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin-login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
