import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const LayoutHome = lazy(() => import("./layouts/LayoutHome.jsx"));
const HomeProduct = lazy(() => import("./components/HomeProduct.jsx"));
const ProductCategory = lazy(() => import("./components/ProductCategory.jsx"));
const ProductBrand = lazy(() => import("./components/ProductBrand.jsx"));
const LayoutProduct = lazy(() => import("./layouts/LayoutProduct.jsx"));
const LayoutBrand = lazy(() => import("./layouts/LayoutBrand.jsx"));
const LayoutProductDetail = lazy(() => import("./layouts/LayoutProductDetail.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const PageUser = lazy(() => import("./pages/PageUser.jsx"));
const LayoutCart = lazy(() => import("./layouts/LayoutCart.jsx"));
const LayoutPay = lazy(() => import("./layouts/LayoutPay.jsx"));
const CartOrder = lazy(() => import("./pages/CartOrder.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const LayoutAdminProduct = lazy(() => import("./layouts/LayoutAdminProduct.jsx"));
const LayoutAdminVariant = lazy(() => import("./layouts/LayoutAdminVariant.jsx"));
const LayoutAdminUser = lazy(() => import("./layouts/LayoutAdminUser.jsx"));
const LayoutAdminCart = lazy(() => import("./layouts/LayoutAdminCart.jsx"));
const LayoutAdminOrder = lazy(() => import("./layouts/LayoutAdminOrder.jsx"));

const Loading = () => <div className="p-8 text-center text-gray-600">Loading...</div>;

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<LayoutHome />}>
          <Route index element={<HomeProduct />} />
          <Route path="products/type/sneaker" element={<ProductCategory category="Sneaker" />} />
          <Route path="products/type/football" element={<ProductCategory category="Football" />} />
          <Route path="products/type/basketball" element={<ProductCategory category="Basketball" />} />
          <Route path="products/type/flipflops" element={<ProductCategory category="FlipFlops" />} />
          <Route path="products/brand/adidas" element={<ProductBrand brand="Adidas" />} />
          <Route path="products/brand/nike" element={<ProductBrand brand="Nike" />} />
          <Route path="products/brand/puma" element={<ProductBrand brand="Puma" />} />
          <Route path="products/brand/newbalance" element={<ProductBrand brand="NewBalance" />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="admin/products" element={<LayoutAdminProduct />} />
          <Route path="admin/variant" element={<LayoutAdminVariant />} />
          <Route path="admin/users" element={<LayoutAdminUser />} />
          <Route path="admin/cart" element={<LayoutAdminCart />} />
          <Route path="admin/order" element={<LayoutAdminOrder />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="user/info" element={<PageUser />} />
          <Route path="cart" element={<LayoutCart />} />
          <Route path="pay" element={<LayoutPay />} />
          <Route path="order" element={<CartOrder />} />
        </Route>

        <Route path="products" element={<LayoutProduct />} />
        <Route path="brands" element={<LayoutBrand />} />
        <Route path="products/:id" element={<LayoutProductDetail />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
