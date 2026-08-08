import express from "express";
import * as productController from "../Controllers/productController.js";
import { requireAdmin, requireAuth } from "../Middleware/auth.js";

const router = express.Router();


router.post("/products/admin", requireAuth, requireAdmin, productController.upload,productController.createProduct);
router.get("/products/admin", requireAuth, requireAdmin, productController.getProductAdmin);
router.put("/products/admin/:productId", requireAuth, requireAdmin, productController.upload, productController.updateProduct);


router.get("/products/show", productController.getProductShow);
router.get("/products/search", productController.searchProduct);
router.get("/products/brand/:brand", productController.getProductBrand);
router.get("/products/type/:description", productController.getProductType);


router.get("/products", productController.getProduct);
router.get("/products/:id", productController.getProductId);
router.delete("/products/:productId", requireAuth, requireAdmin, productController.deleteProduct);

export default router;
