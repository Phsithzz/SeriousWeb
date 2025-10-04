import React from "react";
import Navbar from "../components/Navbar";
import Category from "../components/Category";
import Product from "../components/Product";
import Hero from "../components/Hero";
const LayoutHome = () => {
  return (
    <>
      <div className="flex flex-col">
        <Navbar />
      </div>
      <div className="flex gap-2 p-4">
        <div className=" w-[15%] ">
          <Category />
        </div>
        <div className="flex flex-col space-y-10 p-4 w-[85%] ">
          <Hero/>
          <div className="mt-6">
            
          <Product />
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutHome;
