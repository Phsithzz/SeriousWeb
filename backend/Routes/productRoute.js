import express from "express";
import * as productController from "../Controllers/productController.js";

const router = express.Router();

router.post("/products", productController.createProduct);

router.get("/products/show",productController.getProductShow)
router.get("/products/search", productController.searchProduct);

router.get("/products/brand/:brand",productController.getProductBrand)
router.get("/products/type/:description", productController.getProductType);

router.get("/products", productController.getProduct);
router.get("/products/:id",productController.getProductId)

router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

export default router;
