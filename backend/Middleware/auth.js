import jwt from "jsonwebtoken";
import { query } from "../Config/database.js";

const readToken = (req) => {
  if (req.cookies?.token) return req.cookies.token;

  const authorization = req.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);
  return null;
};

export const requireAuth = async (req, res, next) => {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS256"],
    });
    const { rows } = await query(
      "SELECT name, lastname, email, role FROM users WHERE email=$1",
      [payload.email]
    );

    if (!rows[0]) {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.user = rows[0];
    next();
  } catch {
    res.clearCookie("token", req.app.locals.cookieOptions);
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
