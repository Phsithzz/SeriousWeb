import express from "express";
import * as productController from "../Controllers/productController.js";

const router = express.Router();

router.post("/products", productController.createProduct);
router.get("/products",productController.getProduct)
router.put("/products/:id",productController.updateProduct)
router.delete("/products/:id",productController.deleteProduct)



export default router;
