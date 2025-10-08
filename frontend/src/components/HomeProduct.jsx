  import { useEffect, useState } from "react";
  import * as product from "../function/product.js";
  import { Link } from "react-router-dom";
  import { LuMousePointerClick } from "react-icons/lu";
  import { BsCartPlus } from "react-icons/bs";
  const HomeProduct = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
      loadData();
    }, []);
    const loadData = async () => {
      const res = await product.getProductShow();
      console.log("API response:", res); 
      console.log("res.data:", res.data); 
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
                  src={`${import.meta.env.VITE_API}/img_products/${
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
                
                <div className="flex flex-wrap items-center justify-between">
                  <p className="text-md tracking-wide font-semibold">
                    {new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 0,
                    }).format(product.price)}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link to={`/products/${product.product_id}`}>
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

  export default HomeProduct;
