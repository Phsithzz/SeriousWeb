import { fileURLToPath } from "url";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import * as userService from "../Services/userService.js";
import { resetLoginRateLimit } from "../Middleware/security.js";
import {
  cleanText,
  isStrongPassword,
  isValidEmail,
  normalizeEmail,
  parsePositiveInteger,
} from "../Utils/validation.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const userImageDirectory = path.resolve(dirname, "../img_users");
const avatarPath = (email) => path.join(userImageDirectory, `${email}.jpg`);

const tokenFor = (user) =>
  jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

const setSessionCookie = (req, res, user) => {
  res.cookie("token", tokenFor(user), {
    ...req.app.locals.cookieOptions,
    maxAge: 60 * 60 * 1000,
  });
};

const validateProfile = (body) => {
  const profile = {
    name: cleanText(body.name, 100),
    lastname: cleanText(body.lastname, 100),
    email: normalizeEmail(body.email),
  };

  if (!profile.name || !profile.lastname || !isValidEmail(profile.email)) {
    return null;
  }
  return profile;
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, userImageDirectory),
  filename: (req, _file, callback) => callback(null, `${req.user.email}.jpg`),
});

export const uploadUserImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 2, parts: 3 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== "image/jpeg") {
      return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "file"));
    }
    callback(null, true);
  },
}).single("file");

export const uploadUser = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "JPEG image is required" });
  return res.status(200).json({ message: "File uploaded successfully" });
};

export const register = async (req, res) => {
  try {
    const profile = validateProfile(req.body);
    const password = req.body.password;
    if (!profile || !isStrongPassword(password)) {
      return res.status(400).json({
        message: "Valid name, lastname, email, and password (8-128 characters) are required.",
        regist: false,
      });
    }

    if (await userService.checkEmail(profile.email)) {
      return res.status(409).json({ message: "Email already exists.", regist: false });
    }

    const newUser = await userService.register({ ...profile, password });
    return res.status(201).json({ message: "Success", user: newUser, regist: true });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already exists.", regist: false });
    }
    console.error("register failed", error);
    return res.status(500).json({ message: "Unable to register", regist: false });
  }
};

export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;
    if (!isValidEmail(email) || typeof password !== "string") {
      return res.status(400).json({ message: "Valid email and password are required", login: false });
    }

    const user = await userService.checkEmail(email);
    const isMatch = user ? await bcrypt.compare(password, user.passwordhash) : false;
    if (!isMatch) {
      res.clearCookie("token", req.app.locals.cookieOptions);
      return res.status(401).json({ message: "Invalid email or password", login: false });
    }

    const publicUser = {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    };
    resetLoginRateLimit(req.ip);
    setSessionCookie(req, res, publicUser);
    return res.status(200).json({ message: "Login Success", login: true, user: publicUser });
  } catch (error) {
    console.error("login failed", error);
    return res.status(500).json({ message: "Unable to login", login: false });
  }
};

export const getUser = (req, res) => res.status(200).json({ ...req.user, login: true });

export const logoutUser = (req, res) => {
  res.clearCookie("token", req.app.locals.cookieOptions);
  return res.status(200).json({ message: "Logout successful", login: false });
};

export const getOneUser = async (req, res) => {
  const user = await userService.getOneUser(req.user.email);
  return res.status(200).json(user);
};

export const userEditInfo = async (req, res) => {
  try {
    const profile = validateProfile(req.body);
    if (!profile) return res.status(400).json({ message: "Invalid profile data" });

    const updatedUser = await userService.userEditInfo(req.user.email, profile);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    if (updatedUser.email !== req.user.email) {
      await fs.rename(avatarPath(req.user.email), avatarPath(updatedUser.email)).catch((error) => {
        if (error.code !== "ENOENT") console.error("avatar rename failed", error);
      });
    }

    setSessionCookie(req, res, updatedUser);
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ message: "Email already exists" });
    console.error("profile update failed", error);
    return res.status(500).json({ message: "Unable to update profile" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (typeof currentPassword !== "string" || !isStrongPassword(newPassword)) {
      return res.status(400).json({ message: "New password must be 8-128 characters" });
    }
    await userService.updatePassword(req.user.email, currentPassword, newPassword);
    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }
};

export const getAllUser = async (_req, res) => {
  const users = await userService.getAllUser();
  return res.status(200).json(users);
};

export const updateUser = async (req, res) => {
  try {
    const userId = parsePositiveInteger(req.params.userId);
    const profile = validateProfile(req.body);
    const role = req.body.role;
    if (!userId || !profile || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    const target = await userService.getUserById(userId);
    if (!target) return res.status(404).json({ message: "User not found" });
    if (target.email === req.user.email && role !== "admin") {
      return res.status(400).json({ message: "You cannot remove your own admin role" });
    }

    const updated = await userService.updateUser(userId, { ...profile, role });
    if (updated.email !== target.email) {
      await fs.rename(avatarPath(target.email), avatarPath(updated.email)).catch((error) => {
        if (error.code !== "ENOENT") console.error("avatar rename failed", error);
      });
    }
    if (target.email === req.user.email) setSessionCookie(req, res, updated);
    return res.status(200).json(updated);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ message: "Email already exists" });
    console.error("admin user update failed", error);
    return res.status(500).json({ message: "Unable to update user" });
  }
};

export const removeUser = async (req, res) => {
  const userId = parsePositiveInteger(req.params.userId);
  if (!userId) return res.status(400).json({ message: "Invalid user id" });

  const target = await userService.getUserById(userId);
  if (!target) return res.status(404).json({ message: "User not found" });
  if (target.email === req.user.email) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }

  try {
    await userService.removeUser(userId);
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(409).json({ message: "User has order or cart history and cannot be deleted" });
    }
    throw error;
  }
};
