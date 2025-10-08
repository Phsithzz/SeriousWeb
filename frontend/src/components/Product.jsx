import { useEffect, useState } from "react";
import * as productAPI from "../function/product.js";
import { Link } from "react-router-dom";
import { LuMousePointerClick } from "react-icons/lu";
import { BsCartPlus } from "react-icons/bs";

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await productAPI.getProduct();
      setProducts(res.data);
    };
    loadData();
  }, []);

  const categoryDisplayMap = {
    Sneaker: "Sneaker",
    Football: "Football",
    Basketball: "Basketball",
    Slipper: "Slide & Flip Flops",
  };

  const categoryOrder = ["Sneaker", "Football", "Basketball", "Slipper"];

  const productsByCategory = categoryOrder.map((cat) => ({
    category: cat,
    displayName: categoryDisplayMap[cat],
    items: products.filter((p) => p.description === cat),
  }));

  return (
    <div className="p-6 space-y-12">
      {productsByCategory.map((group) =>
        group.items.length > 0 ? (
          <div key={group.category}>
            <div className="p-4">
              <h1 className="text-3xl text-left font-bold mb-4 bg-black text-white w-fit p-4 rounded-xl transitio ease-in duration-200 hover:bg-white hover:border-2 cursor-pointer hover:text-black">
                {group.displayName}
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map((product) => (
                <div
                  key={product.product_id}
                  className="flex flex-col hover:border transition-all ease-in space-y-2 p-4"
                >
                  <div className="flex justify-center items-center">
                    <img
                      src={`${import.meta.env.VITE_API}/img_products/${
                        product.image_filename
                      }.jpg`}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-xl font-semibold">{product.brand}</p>
                    <p className="text-xl font-semibold">{product.name}</p>
                    <p className="text-md font-semibold">
                      {product.description}
                    </p>

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
                          <button className="flex items-center rounded-lg bg-black gap-2 hover:text-black shadow-2xl hover:border transition-all ease-in duration-200 cursor-pointer font-medium hover:bg-white text-white p-2">
                            <span>View Detail</span>
                            <LuMousePointerClick className="text-xl" />
                          </button>
                        </Link>
                        <button className="flex items-center rounded-lg bg-black gap-2 hover:text-black shadow-2xl hover:border transition-all ease-in duration-200 cursor-pointer font-medium hover:bg-white text-white p-2">
                          <BsCartPlus className="text-xl" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default Product;
