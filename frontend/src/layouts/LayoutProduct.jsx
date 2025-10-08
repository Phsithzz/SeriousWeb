import React from "react";
import Hero from "../components/Hero";
import Product from "../components/Product";
import Navbar from "../components/Navbar";
const LayoutProduct = () => {
  return (
    <>
      <div className="flex flex-col">
        <Navbar />
      </div>
      <div className="flex flex-col space-y-10 p-4 ">
        <Hero />
        <div className="mt-6">
          <Product />
        </div>
      </div>
    </>
  );
};

export default LayoutProduct;
