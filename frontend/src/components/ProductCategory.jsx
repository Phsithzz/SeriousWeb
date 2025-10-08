import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { LuMousePointerClick } from "react-icons/lu";
import { BsCartPlus } from "react-icons/bs";
import * as products from "../function/product.js";
import { Link } from "react-router-dom";
const ProductCategory = ({ category }) => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    loadData();
  }, [category]);

  const loadData = async () => {
    try {
      const res = await products.getProductType(category);
      console.log("API response:", res); 
      console.log("res.data:", res.data); 
      setProduct(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
        <div className="p-2">

        <h1 className="text-3xl text-left font-bold mb-4 bg-black text-white w-fit p-4 rounded-xl transitio ease-in duration-200 hover:bg-white hover:border-2 cursor-pointer hover:text-black">{category}</h1>
        </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">

        {product.map((cate) => (
          <div
            key={cate.product_id}
            className="flex flex-col hover:border transition-all ease-in  space-y-2 p-4  "
          >
          
            <div className="flex justify-center items-center  ">
              <img
                src={`${
                  import.meta.env.VITE_API
                }/img_products/${cate.image_filename}.jpg`}
                alt={cate.name}
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
            <div className="flex space-y-2 flex-col">
              <p className="text-xl font-semibold">{cate.brand}</p>
              <p className="text-xl font-semibold">{cate.name}</p>
              <p className="text-md font-semibold">{cate.description}</p>

              <div className="flex justify-between flex-wrap items-center ">
                <p className="text-md tracking-wide font-semibold">
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                    minimumFractionDigits: 0,
                  }).format(cate.price)}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link to={`/products/${cate.product_id}`}>
                    <button
                      type="button"
                      className="flex items-center rounded-lg bg-black gap-2 hover:text-black shadow-2xl hover:border transition-all ease-in duration-200 cursor-pointer font-medium hover:bg-white text-white p-2 "
                    >
                      <span>View Detail</span>
                      <span>
                        <LuMousePointerClick className="text-xl" />
                      </span>
                    </button>
                  </Link>
                  <button
                    type="button"
                    className="flex items-center rounded-lg bg-black gap-2 hover:text-black shadow-2xl hover:border transition-all ease-in duration-200 cursor-pointer font-medium hover:bg-white text-white p-2 "
                  >
                    <span>
                      <BsCartPlus className="text-xl" />
                    </span>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductCategory;
