import axios from "axios";

const api = import.meta.env.VITE_API;

export const register = (userData) => axios.post(`${api}/user/register`, userData);
export const login = (credentials) => axios.post(`${api}/user/login`, credentials);
export const getUser = () => axios.get(`${api}/user/info`);
export const logoutUser = () => axios.post(`${api}/user/logout`);
export const uploadUser = (formData) => axios.post(`${api}/user/me/avatar`, formData);
export const getOneUser = () => axios.get(`${api}/user/me`);
export const userEditInfo = (userData) => axios.put(`${api}/user/me`, userData);
export const updatePassword = (currentPassword, newPassword) =>
  axios.put(`${api}/user/me/password`, { currentPassword, newPassword });

export const getAllUser = () => axios.get(`${api}/user`);
export const updateUser = (userId, userData) => axios.put(`${api}/user/${userId}`, userData);
export const removeUser = (userId) => axios.delete(`${api}/user/${userId}`);
