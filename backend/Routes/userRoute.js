import express from "express";
import * as userController from "../Controllers/userController.js";
const router = express.Router();

router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
router.get("/user/info", userController.getUser);

export default router;
