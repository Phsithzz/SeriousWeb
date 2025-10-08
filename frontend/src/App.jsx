import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutHome from "./layouts/LayoutHome";
import NotFoundPage from "./pages/NotFoundPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeProduct from "./components/HomeProduct";
import LayoutProduct from "./layouts/LayoutProduct";
import ProductCategory from "./components/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import ProductBrand from "./components/ProductBrand";
import LayoutBrand from "./layouts/LayoutBrand";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutHome />}>
            <Route index element={<HomeProduct />} />

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
              path="products/type/flipflops"
              element={<ProductCategory category="FlipFlops" />}
            />

            <Route
              path="products/brand/adidas"
              element={<ProductBrand brand="Adidas" />}
            />
            <Route
              path="products/brand/nike"
              element={<ProductBrand brand="Nike" />}
            />
            <Route
              path="products/brand/puma"
              element={<ProductBrand brand="Puma" />}
            />
            <Route
              path="products/brand/newbalance"
              element={<ProductBrand brand="NewBalance" />}
            />
          </Route>
          
          <Route path="products" element={<LayoutProduct />} />
          <Route path="brands" element={<LayoutBrand/>}/>
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
