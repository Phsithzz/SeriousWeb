import axios from "axios";

export const getOrder = () => axios.get(`${import.meta.env.VITE_API}/order/admin`);
