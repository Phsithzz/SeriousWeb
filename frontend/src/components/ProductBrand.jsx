import { useEffect } from "react";
import { useState } from "react";
import { LuMousePointerClick } from "react-icons/lu";
import { BsCartPlus } from "react-icons/bs";
import * as products from "../function/product.js";
import { Link } from "react-router-dom";
const ProductBrand = ({ brand }) => {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    let active = true;
    products.getProductBrand(brand)
      .then((res) => active && setProduct(res.data))
      .catch((err) => console.log(err));
    return () => {
      active = false;
    };
  }, [brand]);
  return (
    <>
      <div className="p-2">
        <button
          type="button"
          className="cursor-pointer relative overflow-hidden font-semibold text-md text-white px-6 py-4 rounded-md
             border border-black bg-black transition-colors duration-500 group"
        >
          <span className="relative z-10 text-3xl"> {brand}</span>
          <span
            className="absolute top-0 left-[-75%] w-1/2 h-full  bg-gradient-to-r 
               from-transparent via-white/80 to-transparent 
               skew-x-[-25deg] transition-all duration-700 ease-in-out 
               group-hover:left-[125%]"
          ></span>
        </button>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        {product.map((brands) => (
          <Link key={brands.product_id} to={`/products/${brands.product_id}`}>
            <div
              className="flex flex-col hover:border hover:border-[#DCDCDC]  rounded-xl bg-white  shadow-xl space-y-2 p-4 transition-transform duration-300 ease-in-out overflow-hidden
             hover:scale-110"
            >
              <div className="flex justify-center items-center  ">
                <img
                  src={`${import.meta.env.VITE_API}/img_products/${
                    brands.image_filename
                  }.jpg`}
                  alt={brands.name}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
              <div className="flex space-y-2 flex-col">
                <p className="text-xl font-semibold">{brands.brand}</p>
                <p className="text-xl font-semibold">{brands.name}</p>
                <p className="text-md font-semibold">{brands.description}</p>

                <div className="flex justify-between flex-wrap items-center ">
                  <p className="text-md tracking-wide font-semibold">
                    {new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 0,
                    }).format(brands.price)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <Link to={`/products/${brands.product_id}`}>
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
                    {/* <button
                    type="button"
                    className="flex items-center rounded-lg bg-black gap-2 hover:text-black shadow-2xl hover:border transition-all ease-in duration-200 cursor-pointer font-medium hover:bg-white text-white p-2 "
                  >
                    <span>
                      <BsCartPlus className="text-xl" />
                    </span>
                    <span>Add to Cart</span>
                  </button> */}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ProductBrand;
