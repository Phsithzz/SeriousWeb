import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import * as productService from "../Services/productService.js";
import {
  cleanText,
  parseNonNegativeInteger,
  parseNonNegativeNumber,
  parsePositiveInteger,
} from "../Utils/validation.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const productImageDirectory = path.resolve(dirname, "../img_products");

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, productImageDirectory),
  filename: (_req, _file, callback) => callback(null, `${randomUUID()}.jpg`),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 12, parts: 13 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== "image/jpeg") {
      return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "image"));
    }
    callback(null, true);
  },
}).single("image");

const parseProduct = (body, { partial = false } = {}) => {
  const text = (key, max) => {
    if (partial && body[key] === undefined) return undefined;
    return cleanText(body[key], max);
  };
  const number = (key) => {
    if (partial && body[key] === undefined) return undefined;
    return parseNonNegativeNumber(body[key]);
  };

  const product = {
    name: text("name", 200),
    description: text("description", 200),
    price: number("price"),
    stock_quantity:
      partial && body.stock_quantity === undefined
        ? undefined
        : parseNonNegativeInteger(body.stock_quantity),
    brand: text("brand", 100),
    category_name: text("category_name", 100),
    detail: text("detail", 5_000),
  };
  const invalid = Object.values(product).some((value) => value === "" || value === null);
  return invalid ? null : product;
};

const removeUploadedFile = async (file) => {
  if (file?.path) await fs.unlink(file.path).catch(() => {});
};

const removeProductImage = async (filename) => {
  if (!/^[a-zA-Z0-9_-]+$/.test(filename || "")) return;
  await fs.unlink(path.join(productImageDirectory, `${filename}.jpg`)).catch(() => {});
};

export const createProduct = async (req, res) => {
  const product = parseProduct(req.body);
  if (!product || !req.file) {
    await removeUploadedFile(req.file);
    return res.status(400).json({ message: "Valid product data and a JPEG image are required" });
  }

  try {
    product.image_filename = path.parse(req.file.filename).name;
    return res.status(201).json(await productService.createProduct(product));
  } catch (error) {
    await removeUploadedFile(req.file);
    console.error("product creation failed", error);
    return res.status(500).json({ message: "Unable to create product" });
  }
};

export const getProductAdmin = async (_req, res) =>
  res.status(200).json(await productService.getProductAdmin());

export const getProduct = async (_req, res) =>
  res.status(200).json(await productService.getProduct());

export const updateProduct = async (req, res) => {
  const productId = parsePositiveInteger(req.params.productId);
  const product = parseProduct(req.body, { partial: true });
  if (!productId || !product) {
    await removeUploadedFile(req.file);
    return res.status(400).json({ message: "Invalid product data" });
  }

  const current = await productService.getProductRecord(productId);
  if (!current) {
    await removeUploadedFile(req.file);
    return res.status(404).json({ message: "Product not found" });
  }

  if (req.file) product.image_filename = path.parse(req.file.filename).name;

  try {
    const updated = await productService.updateProduct(productId, product);
    if (req.file) await removeProductImage(current.image_filename);
    return res.status(200).json(updated);
  } catch (error) {
    await removeUploadedFile(req.file);
    console.error("product update failed", error);
    return res.status(500).json({ message: "Unable to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  const productId = parsePositiveInteger(req.params.productId);
  if (!productId) return res.status(400).json({ message: "Invalid product id" });

  const current = await productService.getProductRecord(productId);
  if (!current) return res.status(404).json({ message: "Product not found" });
  try {
    await productService.deleteProduct(productId);
    await removeProductImage(current.image_filename);
    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("product deletion failed", error);
    return res.status(409).json({ message: "Product is still referenced and cannot be deleted" });
  }
};

export const searchProduct = async (req, res) => {
  const searchTerm = cleanText(req.query.q, 100);
  if (!searchTerm) return res.status(200).json([]);
  return res.status(200).json(await productService.searchProduct(searchTerm));
};

export const getProductShow = async (_req, res) =>
  res.status(200).json(await productService.getProductShow());

export const getProductBrand = async (req, res) => {
  const brand = cleanText(req.params.brand, 100);
  return res.status(200).json(await productService.getProductBrand(brand));
};

export const getProductId = async (req, res) => {
  const productId = parsePositiveInteger(req.params.id);
  if (!productId) return res.status(400).json({ message: "Invalid product id" });
  const product = await productService.getProductId(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.status(200).json(product);
};

export const getProductType = async (req, res) => {
  const description = cleanText(req.params.description, 100);
  return res.status(200).json(await productService.getProductType(description));
};
