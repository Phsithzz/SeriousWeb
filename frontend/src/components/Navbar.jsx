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
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import * as products from "../function/product.js"
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

const brands = ["Adidas", "Nike", "NewBalance", "Puma"];
const category = ["Sneaker", "Football", "Basketball", "FlipFlops"];

const Navbar = () => {

  const [isMegaBrand, setMegaBrand] = useState(false);
  const [isMegaProduct, setMegaProduct] = useState(false);

  const [searchTerm,setSearchTerm] = useState("")
  const [result,setResult] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [isFocus, setFocus] = useState(false);

  useEffect(()=>{
       if(!searchTerm){ // ถ้า searchTerm ว่าง ให้ล้างผลลัพธ์
      setResult([]);
      setIsLoading(false);
      return;
    }
    const search = async()=>{
        setIsLoading(true)
        try {
          console.log(`${import.meta.env.VITE_API}/products/search?q=${searchTerm}`)
          const res = await products.searchProduct(searchTerm)
          setResult(res.data)
        } catch (err) {
          console.log(err) 
        } finally {
          setIsLoading(false)
        }
    }
    search()
  },[searchTerm])


  const handleResultClick = async(productId)=>{
    setSearchTerm("")
    setResult([])
    navigate(`/products/${productId}`)
  }

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
                        onClick={() => setMegaProduct(false)}
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
                        onClick={() => setMegaBrand(false)}
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

             <div className="flex gap-4 items-center">
              <div className="relative">
                <div className={`flex items-center border-2 p-2 border-white rounded-full transition-all duration-300 ease-in-out ${
                  isFocus ? "w-100" : "w-64"
                }`}>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onFocus={()=>setFocus(true)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-2 outline-none h-8   w-full bg-transparent text-white placeholder:text-gray-300 placeholder:px-2"
                  />
                  <IoMdSearch className="text-white font-semibold text-2xl cursor-pointer " />
                </div>

                {(isLoading || result.length > 0) && searchTerm && (
                   <div className="absolute top-full mt-2 w-full bg-white text-black shadow-lg p-2 flex flex-col gap-2 z-50 rounded-md">
                     {isLoading && <div className="p-2 text-center text-gray-500">Searching...</div>}
                     {!isLoading && result.length > 0 && (
                       result.slice(0,5).map((item) => (
                         <div 
                           className="flex items-center justify-between gap-4 border-b border-gray-300 p-2 hover:bg-gray-100 cursor-pointer" 
                           key={item.product_id} 
                           onClick={() => handleResultClick(item.product_id)}
                         >
                            <img src={`${import.meta.env.VITE_API}/img_products/${item.image_filename}.jpg`} alt={item.image_filename} className="w-20 h-20 object-cover rounded"/>

                            <div className="ml-2 flex  flex-col space-y-2 flex-1">
                              <p className="font-semibold text-sm">{item.name}</p>
                              <div className="flex gap-4 items-center flex-wrap">
                                <button className="font-semibold text-xs  bg-black hover:bg-white transition ease-in duration-200  hover:text-black hover:border  text-white w-fit px-2 py-2 rounded-md">{item.brand}</button>
                                <button className="font-semibold text-xs  bg-white border hover:bg-black transition ease-in duration-200  hover:text-white  text-black w-fit px-2 py-2 rounded-md">{item.description}</button>
                              </div>
                            </div>

                            <div className="flex items-center">
                             <p className="text-sm tracking-wide font-semibold">
                        {new Intl.NumberFormat("th-TH", {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                        }).format(item.price)}
                      </p>
                            </div>
                         </div>
                       ))
                     )}

                     {!isLoading && result.length === 0 && (
                        <div className="p-2 text-center text-gray-500">No results found.</div>
                     )}
                   </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                  <Link to="/cart">
                      <RiShoppingBag2Line className="text-white font-semibold text-4xl cursor-pointer " />
                  </Link>
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
