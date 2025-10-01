import express from "express";
import * as categoryController from "../Controllers/categoryController.js";

const router = express();

router.get("/category", categoryController.getCategory);
router.post("/category", categoryController.createCategory);
router.put("/category/:id", categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);

export default router;
