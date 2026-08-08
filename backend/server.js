import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import multer from "multer";
import swaggerUI from "swagger-ui-express";
import yaml from "yaml";
import pool from "./Config/database.js";
import productRoute from "./Routes/productRoute.js";
import variantRoute from "./Routes/variantRoute.js";
import userRoute from "./Routes/userRoute.js";
import cartRoute from "./Routes/cartRoute.js";
import orderRoute from "./Routes/orderRoute.js";
import { securityHeaders } from "./Middleware/security.js";
import { requireAuth } from "./Middleware/auth.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(dirname, ".env") });

if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY is required");
if (process.env.NODE_ENV === "production" && process.env.SECRET_KEY.length < 32) {
  throw new Error("SECRET_KEY must contain at least 32 characters in production");
}

const developmentOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = (process.env.CORS_ORIGINS || developmentOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const cookieSecure =
  process.env.COOKIE_SECURE === "true" ||
  (process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false");
const cookieSameSite = process.env.COOKIE_SAME_SITE || "lax";
if (cookieSameSite === "none" && !cookieSecure) {
  throw new Error("COOKIE_SAME_SITE=none requires COOKIE_SECURE=true");
}

export const app = express();
app.disable("x-powered-by");
if (process.env.TRUST_PROXY === "true") app.set("trust proxy", 1);
app.locals.cookieOptions = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: cookieSameSite,
  path: "/",
};

app.use(securityHeaders);
app.use(
  cors({
    origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: "Origin not allowed" });
  }
  next();
});
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(
  "/img_products",
  express.static(path.join(dirname, "img_products"), {
    dotfiles: "deny",
    fallthrough: false,
    immutable: true,
    maxAge: "1d",
  })
);
app.use(
  "/img_users",
  requireAuth,
  express.static(path.join(dirname, "img_users"), {
    dotfiles: "deny",
    fallthrough: false,
    maxAge: "1h",
  })
);

app.get("/health", async (_req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (error) {
    next(error);
  }
});

app.use(productRoute);
app.use(variantRoute);
app.use(userRoute);
app.use(cartRoute);
app.use(orderRoute);

if (process.env.NODE_ENV !== "production" || process.env.ENABLE_API_DOCS === "true") {
  const swaggerFile = fs.readFileSync(path.join(dirname, "Services", "swagger.yaml"), "utf8");
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(yaml.parse(swaggerFile)));
}

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: "Invalid upload. Use one JPEG file up to 5 MB." });
  }
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }
  if (error?.status === 404) return res.status(404).json({ message: "File not found" });
  console.error("Unhandled request error", error);
  return res.status(500).json({ message: "Internal server error" });
});

const isMainModule = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMainModule) {
  const port = Number(process.env.PORT || 3000);
  const server = app.listen(port, () => console.log(`Server is running on port ${port}`));
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
