import logo from "../assets/logo.jpg";
import hero1 from "../assets/hero1.svg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";

import cate1 from "../assets/cate1.png";
import cate2 from "../assets/cate2.png";
import cate3 from "../assets/cate3.png";
import cate4 from "../assets/cate4.png";
//icon
import { IoMdSearch } from "react-icons/io";
import { RiShoppingBag2Line } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const imageList = [
  {
    id: 1,
    image: hero1,
    title: "ADIDAS",
  },
  {
    id: 2,
    image: hero2,
    title: "NIKE",
  },
  {
    id: 3,
    image: hero3,
    title: "NEWBALANCE",
  },
  {
    id: 4,
    image: hero4,
    title: "PUMA",
  },
];

const imageListCate = [
  {
    id: 1,
    image: cate1,
    title: "Sneaker",
  },
  {
    id: 2,
    image: cate2,
    title: "Football",
  },
  {
    id: 3,
    image: cate3,
    title: "Basketball",
  },
  {
    id: 4,
    image: cate4,
    title: "FlipFlops",
  },
];
const brands = ["Adidas", "Nike", "Puma", "NewBalance"];
const category = ["Sneaker", "Football", "Basketball", "FlipFlops"];
const Navbar = () => {
  const [isMegaBrand, setMegaBrand] = useState(false);
  const [isMegaProduct, setMegaProduct] = useState(false);

  return (
    <>
      <div className=" bg-black">
        <div className="flex container mx-auto items-center justify-between p-6">
          <div className="w-[40%]">
            <Link to="/">
              <img src={logo} alt="Logo" className=" h-10 cursor-pointer" />
            </Link>
          </div>
          <div className="flex justify-between items-center gap-6 w-[60%]">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="text-white text-xl font-semibold cursor-pointer hover:underline"
              >
                Home
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setMegaProduct(true)}
                onMouseLeave={() => setMegaProduct(false)}
              >
                <Link
                  to="/products"
                  className="text-white text-xl font-semibold cursor-pointer hover:underline"
                >
                  Products
                </Link>

                {isMegaProduct && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 w-64 bg-white text-black shadow-lg p-4 flex flex-col gap-2 z-50">
                    {category.map((cate, index) => (
                    
                        <Link
                          key={cate}
                          to={`/products/type/${cate.toLowerCase()}`}
                          className="flex items-center gap-2 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                          onClick={()=>setMegaProduct(false)}
                        >
                          <img
                            src={imageListCate[index]?.image}
                            alt={cate}
                            className="w-16 h-16 object-contain"
                          />
                          <span className="font-medium">{cate}</span>
                        </Link>
              
                    ))}
                  </div>
                )}
              </div>

              <div
                className="relative group"
                onMouseEnter={() => setMegaBrand(true)}
                onMouseLeave={() => setMegaBrand(false)}
              >
                <Link
                  to="/brands"
                  className="text-white text-xl font-semibold cursor-pointer hover:underline"
                >
                  Brands
                </Link>

                {isMegaBrand && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 w-64 bg-white text-black shadow-lg p-4 flex flex-col gap-2 z-50">
                    {brands.map((brand, index) => (
                      <Link
                        key={brand}
                        to={`/products/brand/${brand.toLowerCase()}`}
                        onClick={()=>setMegaBrand(false)}
                        className="flex items-center gap-2 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                      >
                        <img
                          src={imageList[index]?.image}
                          alt={brand}
                          className="w-16 h-16 object-contain"
                        />
                        <span className="font-medium">{brand}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 items-center ">
              <div className="flex justify-between items-center p-1 w-72 border-2 border-white rounded-full">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-2 outline-none h-8 px-2 bg-transparent text-white placeholder:text-white placeholder:px-2"
                />
                <IoMdSearch className="text-white font-semibold text-2xl cursor-pointer " />
              </div>
              <div className="flex items-center gap-2">
                <Link to="/cart">
                  <RiShoppingBag2Line className="text-white font-semibold text-4xl cursor-pointer " />
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/register">
                  <FaRegUserCircle className="text-white text-4xl" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
