import axios from "axios"

export const getProduct = async()=>{
    return await axios.get(`${import.meta.env.VITE_API}/products`)
}

export const getProductType = async(description)=>{
    return await axios.get(`${import.meta.env.VITE_API}/products/type/${description}`)
}

export const getProductId = async(productId) =>{
    return await axios.get(`${import.meta.env.VITE_API}/products/${productId}`)
}