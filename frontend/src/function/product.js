import axios from "axios"

export const getProduct = async()=>{
    return await axios.get(`${import.meta.env.VITE_API}/products`)
}

export const getProductShow = async()=>{
    return await axios.get(`${import.meta.env.VITE_API}/products/show`)
}

export const getProductBrand = async(brand)=>{
    return await axios.get(`${import.meta.env.VITE_API}/products/brand/${brand}`)
}

export const getProductType = async(description)=>{
    return await axios.get(`${import.meta.env.VITE_API}/products/type/${description}`)
}

export const getProductId = async(productId) =>{
    return await axios.get(`${import.meta.env.VITE_API}/products/${productId}`)
}