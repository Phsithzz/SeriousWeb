import express from "express";
import * as userController from "../Controllers/userController.js";
import { requireAdmin, requireAuth } from "../Middleware/auth.js";
import { loginRateLimit } from "../Middleware/security.js";

const router = express.Router();

router.post("/user/register", userController.register);
router.post("/user/login", loginRateLimit, userController.login);
router.post("/user/logout", userController.logoutUser);

router.get("/user/info", requireAuth, userController.getUser);
router.get("/user/me", requireAuth, userController.getOneUser);
router.put("/user/me", requireAuth, userController.userEditInfo);
router.put("/user/me/password", requireAuth, userController.updatePassword);
router.post(
  "/user/me/avatar",
  requireAuth,
  userController.uploadUserImage,
  userController.uploadUser
);

router.get("/user", requireAuth, requireAdmin, userController.getAllUser);
router.put("/user/:userId", requireAuth, requireAdmin, userController.updateUser);
router.delete("/user/:userId", requireAuth, requireAdmin, userController.removeUser);

export default router;
