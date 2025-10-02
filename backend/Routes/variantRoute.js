import express from "express"
import * as variantController from "../Controllers/variantController.js"
const router = express.Router()


router.post("/variant", variantController.createVariant);
router.get("/variant",variantController.getVariant)
router.put("/variant/:id",variantController.updateVariant)
router.delete("/variant/:id",variantController.deleteVariant)



export default router