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
        <div className="flex flex-col space-y-4 p-6">
          <div className="flex justify-between  relative">
            <div className="flex flex-wrap gap-4">
              <img
                src={`${import.meta.env.VITE_API}/img_products/${
                  product.image_filename
                }.jpg`}
                alt={product.name}
                className="w-full md:w-1/2 h-auto object-cover rounded-xl"
              />
              <div className="flex flex-col">
                <p className="text-xl font-semibold">{product.name}</p>
                <p className="text-xl font-medium">
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                    minimumFractionDigits: 0,
                  }).format(product.price)}
                </p>
                <div className="flex flex-col mt-6 space-y-2">
            <h1 className="text-lg font-semibold">รายละเอียดสินค้า</h1>
            <p>(ต้องเชื่อมกับข้อความในฐานข้อมูล)</p>
          </div>
              </div>
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
