import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AllProductBrand from "../components/AllProductBrand";
const LayoutBrand = () => {
  return (
    <>
      <div className="flex flex-col">
        <Navbar />
      </div>
      <div className="flex flex-col space-y-10 p-4 ">
        <Hero />
        <div className="mt-6">
          <AllProductBrand />
        </div>
      </div>
    </>
  );
};

export default LayoutBrand;
