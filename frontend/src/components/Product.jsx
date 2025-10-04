import { useEffect, useState } from "react";
import * as product from "../function/product.js";

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    const res = await product.getProduct();
    console.log("API response:", res); // ดู object ทั้งหมด
    console.log("res.data:", res.data); // ดูว่า res.data เป็นอะไร
    setProducts(res.data);
  };
  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="flex flex-col hover:border transition-all ease-in  space-y-2 p-4  "
          >
            <div className="flex justify-center items-center  ">
              <img
                src={`${import.meta.env.VITE_API}/img_basketball/${
                  product.image_filename
                }.jpg`}
                alt={product.name}
  
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
            <div className="flex space-y-2 flex-col">
              <p className="text-xl font-semibold">{product.brand}</p>
              <p className="text-xl font-semibold">{product.name}</p>
              <p className="text-md font-semibold">{product.description}</p>
              <p className="text-md tracking-wide font-semibold">
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Product;
