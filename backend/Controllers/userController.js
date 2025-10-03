import * as userService from "../Services/userService.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

export const register = async (req, res) => {
  console.log("POST /register is requested");
  try {
    const userData = req.body;
    if (
      !userData.email ||
      !userData.name ||
      !userData.lastname ||
      !userData.password
    ) {
      return res.status(400).json({
        message: "Name, lastname, email, and password are required.",
        regist: false,
      });
    }
    const checkuser = await userService.checkEmail(userData.email);
    if (checkuser) {
      return res.json({
        message: `Email ${userData.email} Alreaady exists.`,
        regist: false,
      });
    }

    const newuser = await userService.register(userData);
    res.status(201).json({
      user: newuser,
      regist: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error register",
      error: err.message,
      regist: false,
    });
  }
};

export const login = async (req, res) => {
  console.log("POST /login is requested");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Error email and password is required",
        login: false,
      });
    }

    const checkuser = await userService.checkEmail(email);

    if (!checkuser) {
      return res.status(404).json({ message: "User Not Found", login: false });
    }

    const isMatch = await bcrypt.compare(password, checkuser.passwordhash);
    if (isMatch) {
      const theuser = {
        email: checkuser.email,
      };
      const secret_key = process.env.SECRET_KEY;
      const token = jwt.sign(theuser, secret_key, { expiresIn: "1h" });
      res.cookie("token", token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.status(200).json({
        message: "Login Success",
        login: true,
      });
    } else {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.status(401).json({
        message: "Password Invalid",
        login: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error login",
      error: err.message,
      login: false,
    });
  }
};

export const getUser = async (req, res) => {
  console.log("GET /getUser is requested.");
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ message: "No User ", login: false });
    }

    const secret_key = process.env.SECRET_KEY;
    const user = jwt.verify(token, secret_key);
    console.log(user);
    return res.json({
      email: user.email,
      login: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error getUser",
      error: err.message,
    });
  }
};
