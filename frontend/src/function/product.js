import axios from "axios"

export const getProduct = async()=>{
    return await axios.get(`${import.meta.env.VITE_API}/products`)
}