import * as variantService from "../Services/variantService.js";
import {
  cleanText,
  parseNonNegativeInteger,
  parseNonNegativeNumber,
  parsePositiveInteger,
} from "../Utils/validation.js";

const parseVariant = (body) => {
  const variant = {
    product_id: parsePositiveInteger(body.product_id),
    stock_quantity: parseNonNegativeInteger(body.stock_quantity),
    price: parseNonNegativeNumber(body.price),
    size: cleanText(String(body.size ?? ""), 50),
    color: cleanText(body.color, 100),
  };
  return variant.product_id && variant.stock_quantity !== null && variant.price !== null && variant.size && variant.color
    ? variant
    : null;
};

export const createVariant = async (req, res) => {
  const variant = parseVariant(req.body);
  if (!variant) return res.status(400).json({ message: "Invalid variant data" });
  try {
    return res.status(201).json(await variantService.createVariant(variant));
  } catch (error) {
    if (error.code === "23503") return res.status(400).json({ message: "Product not found" });
    throw error;
  }
};

export const getVariant = async (_req, res) =>
  res.status(200).json(await variantService.getVariant());

export const updateVariant = async (req, res) => {
  const variantId = parsePositiveInteger(req.params.variantId);
  const variant = parseVariant(req.body);
  if (!variantId || !variant) return res.status(400).json({ message: "Invalid variant data" });
  try {
    const updated = await variantService.updateVariant(variantId, variant);
    if (!updated) return res.status(404).json({ message: "Variant not found" });
    return res.status(200).json(updated);
  } catch (error) {
    if (error.code === "23503") return res.status(400).json({ message: "Product not found" });
    throw error;
  }
};

export const deleteVariant = async (req, res) => {
  const variantId = parsePositiveInteger(req.params.variantId);
  if (!variantId) return res.status(400).json({ message: "Invalid variant id" });
  try {
    const deleted = await variantService.deleteVariant(variantId);
    if (!deleted) return res.status(404).json({ message: "Variant not found" });
    return res.status(200).json({ message: "Variant deleted" });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(409).json({ message: "Variant is referenced and cannot be deleted" });
    }
    throw error;
  }
};
