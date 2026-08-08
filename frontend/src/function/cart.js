import axios from "axios";

const api = import.meta.env.VITE_API;

export const addCart = (cartData) => axios.post(`${api}/cart/items`, cartData);
export const getCart = () => axios.get(`${api}/cart`);
export const getCartOrder = () => axios.get(`${api}/cart/orders`);
export const updateCartQuantity = (cartId, quantity) =>
  axios.put(`${api}/cart/items/${cartId}`, { newQuantity: quantity });
export const removeCart = (cartId) => axios.delete(`${api}/cart/items/${cartId}`);
export const confirmCart = (address, paymentMethod) =>
  axios.post(`${api}/cart/checkout`, { address, payment_method: paymentMethod });

export const createCart = (cartData) => axios.post(`${api}/cart/admin`, cartData);
export const getAllCart = () => axios.get(`${api}/cart/admin`);
export const updateCart = (cartId, cartData) => axios.put(`${api}/cart/admin/${cartId}`, cartData);
export const removeCartAdmin = (cartId) => axios.delete(`${api}/cart/admin/${cartId}`);
