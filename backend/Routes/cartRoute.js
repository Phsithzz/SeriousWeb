import express from "express";
import * as cartController from "../Controllers/cartController.js";
import { requireAdmin, requireAuth } from "../Middleware/auth.js";

const router = express.Router();

router.post("/cart/admin", requireAuth, requireAdmin, cartController.createCart);
router.get("/cart/admin", requireAuth, requireAdmin, cartController.getAllCart);
router.put("/cart/admin/:cartId", requireAuth, requireAdmin, cartController.updateCart);
router.delete("/cart/admin/:cartId", requireAuth, requireAdmin, cartController.removeCart);

router.use("/cart", requireAuth);
router.get("/cart", cartController.getCart);
router.get("/cart/orders", cartController.getCartOrder);
router.get("/cart/status", cartController.checkCart);
router.post("/cart/items", cartController.addCart);
router.put("/cart/items/:cartId", cartController.updateCartQuantity);
router.delete("/cart/items/:cartId", cartController.removeOwnCart);
router.post("/cart/checkout", cartController.confirmCart);

export default router;
