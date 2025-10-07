import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as products from "../function/product.js";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await products.getProductId(id);
      setProduct(res.data);
    };
    loadData();
  }, [id]);

  if (!product) return <p>Loading...</p>; // เช็คก่อน render

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl font-semibold">{product.brand}</p>
      <p className="text-md">{product.description}</p>
      <p className="text-lg mt-2">
        ราคา: {new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 }).format(product.price)}
      </p>
      <img
        src={`${import.meta.env.VITE_API}/img_products/${product.image_filename}.jpg`}
        alt={product.name}
        className="w-full h-auto mt-4"
      />
    </div>
  );
};

export default ProductDetail;
