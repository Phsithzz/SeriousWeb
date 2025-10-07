import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutHome from "./layouts/LayoutHome";
import NotFoundPage from "./pages/NotFoundPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./components/Home";
import Product from "./components/Product";
import ProductCategory from "./components/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutHome />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Product />} />
            <Route
              path="products/type/sneaker"
              element={<ProductCategory category="Sneaker" />}
            />
            <Route
              path="products/type/football"
              element={<ProductCategory category="Football" />}
            />
            <Route
              path="products/type/basketball"
              element={<ProductCategory category="Basketball" />}
            />
            <Route
              path="products/type/slipper"
              element={<ProductCategory category="Slippper" />}
            />
          </Route>

          <Route path="products/:id" element={<ProductDetail />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
