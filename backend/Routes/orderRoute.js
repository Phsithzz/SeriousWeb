import express from "express"
import * as orderController from "../Controllers/orderController.js"
import { requireAdmin, requireAuth } from "../Middleware/auth.js"

const router = express.Router()

router.get("/order/admin", requireAuth, requireAdmin, orderController.getOrder)




export default router
