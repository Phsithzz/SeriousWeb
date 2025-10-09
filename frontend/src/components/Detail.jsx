import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as products from "../function/product.js";
import { RxCross2 } from "react-icons/rx";
const Detail = ({ onCancel }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await products.getProductId(id);
      setProduct(res.data);
    };
    loadData();
  }, [id]);

  if (!product) return <p>Loading...</p>;
  return (
    <>
      <div className="m-30 w-full max-w-3xl bg-white rounded-4xl shadow-xl mx-auto overflow-hidden">
        <div className="flex  flex-col space-y-4 p-6">

          <div className="flex  flex-col relative">

            <div className="flex items-center flex-wrap gap-4">
              <img
                src={`${import.meta.env.VITE_API}/img_products/${
                  product.image_filename
                }.jpg`}
                alt={product.name}
                className="w-20 h-30   object-contain rounded-xl"
              />
              <div className="flex item-center flex-col">
                <p className="text-lg font-semibold">{product.name}</p>
                <p className="text-lg font-medium">
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                    minimumFractionDigits: 0,
                  }).format(product.price)}
                </p>

                
              </div>
            </div>
            <div className="flex flex-col mt-6 space-y-2">
            <h1 className="text-md font-semibold">รายละเอียดสินค้า</h1>
            <p className="text-md font-semibold">{product.detail} </p>
          </div>
            <div className="absolute top-0 right-0">
              <button type="button" onClick={onCancel}>
                <RxCross2 className="cursor-pointer font-bold hover:text-red-500" size={30} />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Detail;
