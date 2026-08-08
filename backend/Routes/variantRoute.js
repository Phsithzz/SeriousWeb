import express from "express";
import * as variantController from "../Controllers/variantController.js";
import { requireAdmin, requireAuth } from "../Middleware/auth.js";
//import

const router = express.Router();

router.use("/variant", requireAuth, requireAdmin);

router.post("/variant", variantController.createVariant);

router.get("/variant", variantController.getVariant);

router.put("/variant/:variantId", variantController.updateVariant);

router.delete("/variant/:variantId", variantController.deleteVariant);

export default router;
