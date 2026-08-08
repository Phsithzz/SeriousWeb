import * as cartService from "../Services/cartService.js";
import {
  cleanText,
  isValidEmail,
  normalizeEmail,
  parseNonNegativeNumber,
  parsePositiveInteger,
} from "../Utils/validation.js";

export const checkCart = async (req, res) => {
  const cart = await cartService.checkCart(req.user.email);
  return res.status(200).json({ cartExist: Boolean(cart), cart_id: cart?.cart_id });
};

export const addCart = async (req, res) => {
  const variantId = parsePositiveInteger(req.body.variant_id);
  const quantity = parsePositiveInteger(req.body.quantity, { max: 20 });
  if (!variantId || !quantity) {
    return res.status(400).json({ cartOK: false, message: "Invalid variant or quantity" });
  }

  const result = await cartService.addCart({
    customer_email: req.user.email,
    variant_id: variantId,
    quantity,
  });
  if (result.error) return res.status(400).json({ cartOK: false, message: result.error });
  return res.status(201).json({ cartOK: true, messageAddCart: result.cart });
};

export const getCart = async (req, res) =>
  res.status(200).json(await cartService.getCart(req.user.email));

export const getCartOrder = async (req, res) =>
  res.status(200).json(await cartService.getCartOrder(req.user.email));

export const updateCartQuantity = async (req, res) => {
  const cartId = parsePositiveInteger(req.params.cartId);
  const quantity = parsePositiveInteger(req.body.newQuantity, { max: 20 });
  if (!cartId || !quantity) return res.status(400).json({ message: "Invalid cart or quantity" });

  const updated = await cartService.updateCartQuantity(cartId, req.user.email, quantity);
  if (!updated) return res.status(400).json({ message: "Cart item not found or insufficient stock" });
  return res.status(200).json(updated);
};

export const removeOwnCart = async (req, res) => {
  const cartId = parsePositiveInteger(req.params.cartId);
  if (!cartId) return res.status(400).json({ message: "Invalid cart id" });
  const deleted = await cartService.removeOwnCart(cartId, req.user.email);
  if (!deleted) return res.status(404).json({ message: "Cart item not found" });
  return res.status(200).json({ message: "Cart item deleted" });
};

export const confirmCart = async (req, res) => {
  try {
    const source = req.body.address || {};
    const address = {
      house_number: cleanText(source.house_number, 100),
      village_number: cleanText(source.village_number, 100),
      subdistrict: cleanText(source.subdistrict, 100),
      district: cleanText(source.district, 100),
      province: cleanText(source.province, 100),
      postal_code: cleanText(source.postal_code, 20),
    };
    const paymentMethod = cleanText(req.body.payment_method, 100);
    if (Object.values(address).some((value) => !value) || !paymentMethod) {
      return res.status(400).json({ message: "Complete address and payment method are required" });
    }

    const order = await cartService.confirmCart(req.user.email, address, paymentMethod);
    if (!order) return res.status(400).json({ message: "No item to confirm" });
    return res.status(200).json(order);
  } catch (error) {
    if (error.code === "INSUFFICIENT_STOCK") {
      return res.status(409).json({ message: "One or more items have insufficient stock" });
    }
    console.error("checkout failed", error);
    return res.status(500).json({ message: "Unable to complete checkout" });
  }
};

const validAdminCart = (body) => {
  const customer_email = normalizeEmail(body.customer_email);
  const variant_id = parsePositiveInteger(body.variant_id);
  const quantity = parsePositiveInteger(body.quantity, { max: 10_000 });
  const price = parseNonNegativeNumber(body.price);
  const status = body.status === true || body.status === "true";
  return isValidEmail(customer_email) && variant_id && quantity && price !== null
    ? { customer_email, variant_id, quantity, price, status }
    : null;
};

export const getAllCart = async (_req, res) => res.status(200).json(await cartService.getAllCart());

export const createCart = async (req, res) => {
  const data = validAdminCart(req.body);
  if (!data) return res.status(400).json({ message: "Invalid cart data" });
  return res.status(201).json(await cartService.createCart(data));
};

export const updateCart = async (req, res) => {
  const cartId = parsePositiveInteger(req.params.cartId);
  const data = validAdminCart(req.body);
  if (!cartId || !data) return res.status(400).json({ message: "Invalid cart data" });
  const updated = await cartService.updateCart(cartId, data);
  if (!updated) return res.status(404).json({ message: "Cart not found" });
  return res.status(200).json(updated);
};

export const removeCart = async (req, res) => {
  const cartId = parsePositiveInteger(req.params.cartId);
  if (!cartId) return res.status(400).json({ message: "Invalid cart id" });
  const deleted = await cartService.removeCart(cartId);
  if (!deleted) return res.status(404).json({ message: "Cart not found" });
  return res.status(200).json({ message: "Cart deleted" });
};
