import logo from "../assets/logo.png";
import iconMobile from "../assets/iconMobile.png";
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
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import * as products from "../function/product.js";
import * as users from "../function/user.js";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [isFocus, setFocus] = useState(false);

  const [name, setName] = useState(null);
  const [login, setLogin] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!searchTerm) {
      setResult([]);
      setIsLoading(false);
      return;
    }
    const search = async () => {
      setIsLoading(true);
      try {
        const res = await products.searchProduct(searchTerm);
        setResult(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [searchTerm]);

  useEffect(() => {
    const getUser = async () => {
      await users
        .getUser()
        .then((res) => {
          setName(res.data.name);
          setLogin(res.data.login);
        })
        .catch((err) => console.log(err.message));
    };
    getUser();
  }, []);

  const handleResultClick = async (productId) => {
    setSearchTerm("");
    setResult([]);
    navigate(`/products/${productId}`);
  };

  const handleUserClick = () => {
    if (login && name) {
      navigate("/user/info");
    } else {
      navigate("/register");
    }
  };
  return (
    <>
      <div className=" bg-black">
        <div className="flex   items-center justify-between p-6">
          <div className="w-[35%]">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className=" w-15 h-15 cursor-pointer"
              />
            </Link>
          </div>

          <div className="hidden md:flex justify-between items-center gap-6 w-[65%]">
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

            <div className="flex ml-auto relative  gap-4 items-center">
              <div className="relative hidden md:flex items-center">
                <div
                  className={`flex items-center border-2 p-2 border-white rounded-full origin-right transition-all duration-300 ease-in-out ${
                    isFocus ? "w-100 " : "w-40 sm:w-64"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onFocus={() => setFocus(true)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-2 outline-none h-8   w-full bg-transparent text-white placeholder:text-gray-300 placeholder:px-2"
                  />
                  <IoMdSearch className="text-white font-semibold text-2xl cursor-pointer " />
                </div>

                {(isLoading || result.length > 0) && searchTerm && (
                  <div className="absolute right-0 top-full mt-2 w-  bg-white text-black shadow-lg p-2 flex flex-col gap-2 z-50 rounded-md">
                    {isLoading && (
                      <div className="p-2 text-center text-gray-500">
                        Searching...
                      </div>
                    )}
                    {!isLoading &&
                      result.length > 0 &&
                      result.slice(0, 5).map((item) => (
                        <div
                          className="flex items-center justify-between gap-4 border-b border-gray-300 p-2 hover:bg-gray-100 cursor-pointer"
                          key={item.product_id}
                          onClick={() => handleResultClick(item.product_id)}
                        >
                          <img
                            src={`${import.meta.env.VITE_API}/img_products/${
                              item.image_filename
                            }.jpg`}
                            alt={item.image_filename}
                            className="w-20 h-20 object-cover rounded"
                          />

                          <div className="ml-2 flex  flex-col space-y-2 flex-1">
                            <p className="font-semibold text-sm">{item.name}</p>
                            <div className="flex gap-4 items-center flex-wrap">
                              <button className="font-semibold text-xs  bg-black hover:bg-white transition ease-in duration-200  hover:text-black hover:border  text-white w-fit px-2 py-2 rounded-md">
                                {item.brand}
                              </button>
                              <button className="font-semibold text-xs  bg-white border hover:bg-black transition ease-in duration-200  hover:text-white  text-black w-fit px-2 py-2 rounded-md">
                                {item.description}
                              </button>
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
                      ))}

                    {!isLoading && result.length === 0 && (
                      <div className="p-2 text-center text-gray-500">
                        No results found.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <Link to="/cart">
                  <RiShoppingBag2Line className="text-white font-semibold text-4xl cursor-pointer " />
                </Link>

                <div className="flex items-center gap-4  ">
                  <button onClick={handleUserClick} className="cursor-pointer">
                    <FaRegUserCircle className="text-white text-4xl" />
                  </button>

                  {name && login && (
                    <>
                      <p className="text-white font-semibold truncate max-w-[120px] sm:max-w-[150px] ">
                        {name}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            className="md:hidden text-white text-3xl"
            onClick={() => setMenuOpen(true)}
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-2/4 bg-white text-black z-[999] p-6 transform transition-transform duration-500 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <img src={iconMobile} alt="Logo" className="h-20" />
          <IoClose
            size={40}
            className=" cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        <nav className="flex flex-col gap-6 font-semibold text-lg">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            หน้าแรก
          </Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            สินค้า
          </Link>
          <Link to="/brands" onClick={() => setMenuOpen(false)}>
            แบรนด์
          </Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            ตะกร้าของฉัน
          </Link>
          <Link to="/user/info" onClick={() => setMenuOpen(false)}>
            ข้อมูลผู้ใช้
          </Link>
        </nav>
      </div>

      {/* Dim background when menu open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-[998]"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
