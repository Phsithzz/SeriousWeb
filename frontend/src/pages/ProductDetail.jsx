import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import * as products from "../function/product.js";
import Navbar from "../components/Navbar.jsx";
import { FaRegHeart } from "react-icons/fa";
import { TbRulerMeasure } from "react-icons/tb";
import { HiOutlineChevronDown } from "react-icons/hi";
import { HiOutlineChevronUp } from "react-icons/hi";
import { MdOutlineRateReview } from "react-icons/md";
import { LuMousePointerClick } from "react-icons/lu";
import { BsCartPlus } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { motion } from "framer-motion";
import Slider from "react-slick";
import Detail from "../components/Detail.jsx";
const shipping = [
  {
    id: 1,
    province: "กรุงเทพมหานาคร",
    description: "จัดส่งแบบมาตรฐาน: ถึงที่หมายใน 3-6 วันทำการ",
  },
  {
    id: 2,
    province: "สมุทรปราการ",
    description: "จัดส่งแบบมาตรฐาน: ถึงที่หมายใน 4-7 วันทำการ",
  },
  {
    id: 3,
    province: "นนทบุรี",
    description: "จัดส่งแบบมาตรฐาน: ถึงที่หมายใน 4-7 วันทำการ",
  },
  {
    id: 4,
    province: "จังหวัดอื่น",
    description: "จัดส่งแบบมาตรฐาน: ถึงที่หมายใน 5-8 วันทำการ",
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showProduct, setShowProduct] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openDetail,setOpenDetail] = useState(false)

  const RandomProduct = (array) => {
    return array
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  };

  useEffect(() => {
    const loadData = async () => {
      const resId = await products.getProductId(id);
      setProduct(resId.data);
      const resShow = await products.getProduct();
      setShowProduct(RandomProduct(resShow.data));
      window.scrollTo(0, 0);
    };
    loadData();
  }, [id]);

  var settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // หน้าจอใหญ่แต่ไม่เต็ม
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1, // หน้าจอมือถือ
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <div className="">
        <Navbar />
      </div>

      <div className="w-full bg-white">
        <div className="max-w-5xl mx-auto mt-8 px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 flex-col justify-center items-start">
              <img
                src={`${import.meta.env.VITE_API}/img_products/${
                  product.image_filename
                }.jpg`}
                alt={product.name}
                className="w-full max-w-[600px] object-contain"
              />

              <div className="border-b-2 border-gray-300 flex gap-2 items-center text-lg font-semibold">
                <p>
                  <MdOutlineRateReview />
                </p>
                <p>Review (0) </p>
                <p className="flex gap-2">
                  {" "}
                  <CiStar />
                  <CiStar />
                  <CiStar />
                  <CiStar />
                  <CiStar />
                </p>
              </div>
              <div className="w-full  pb-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex cursor-pointer transition-all ease-in duration-300 w-full border-b-2 border-gray-300 justify-between py-2 text-left  font-semibold text-lg"
                >
                  การจัดส่งและคืนสินค้าฟรี
                  {isOpen ? (
                    <HiOutlineChevronUp size={20} />
                  ) : (
                    <HiOutlineChevronDown size={20} />
                  )}
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white space-y-4 mt-2"
                  >
                    <p className="text-md font-normal">
                      จัดส่งสินค้าฟรีสำหรับคำสั่งซื้อที่มีมูลค่า 5,500 บาทขึ้นไป
                    </p>
                    {shipping.map((shop) => (
                      <div className="flex flex-col gap-2 " key={shop.id}>
                        <p className="text-md font-normal">{shop.province}</p>
                        <p className="text-md font-normal">
                          {shop.description}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-start space-y-6">
              <h1 className="text-3xl font-semibold">{product.name}</h1>
              <p className="text-lg text-gray-700">{product.description}</p>
              <p className="text-xl font-bold">
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </p>

              <button onClick={()=>setOpenDetail(true)} className="text-left font-semibold underline cursor-pointer ">
                รายละเอียดสินค้า
              </button>
                {openDetail &&(
                  <div className="fixed top-0 left-0 w-full h-full backdrop-blur-xs flex justify-center items-center z-50">
                    <Detail onCancel={()=>setOpenDetail(false)}/>
                  </div>
                )}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-xl">เลือกไซส์</p>
                  <button
                    type="button"
                    className="flex items-center gap-2 font-semibold"
                  >
                    <TbRulerMeasure />
                    <span>คำแนะนำไซต์</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  {product.variants.map((v) => (
                    <button
                      type="button"
                      disabled={v.stock_quantity === 0}
                      key={v.variant_id}
                      className={`border-2 border-gray-400 rounded-md px-4 transition ease-in  py-2 cursor-pointer
                          ${
                            v.stock_quantity === 0
                              ? "opacity-30 bg-gray-200 cursor-not-allowed line-through"
                              : "hover:border-black hover:border-2"
                          }`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="font-semibold text-md text-white bg-black px-2 hover:bg-white hover:text-black border transition-all ease-in duration-200 py-4 rounded-full cursor-pointer"
                >
                  <span>เพิ่มในตระกร้า</span>
                </button>
                <button
                  type="button"
                  className="font-semibold group text-md text-black hover:text-white hover:bg-black transition-all ease-in duration-200 bg-white px-2 py-4 gap-2 rounded-full cursor-pointer border flex justify-center items-center"
                >
                  <span>รายการโปรด</span>
                  <FaRegHeart className="group-hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 px-4 md:px-8 mb-20">
          <h1 className="text-2xl font-bold text-left">สินค้าที่คุณอาจสนใจ</h1>
          <div className="mt-4 ">
            <Slider {...settings} className="w-full  px-14">
              {showProduct.map((show) => (
                <div
                  className="flex flex-col   transition-all ease-in space-y-2 p-4 cursor-pointer"
                  key={show.product_id}
                >
                  <div className="flex justify-center items-center">
                    <img
                      src={`${import.meta.env.VITE_API}/img_products/${
                        show.image_filename
                      }.jpg`}
                      alt={show.name}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-xl font-semibold">{show.brand}</p>
                    <p className="text-xl font-semibold">{show.name}</p>
                    <p className="text-md font-semibold">{show.description}</p>

                    <div className="flex flex-wrap items-center justify-between">
                      <p className="text-md tracking-wide font-semibold">
                        {new Intl.NumberFormat("th-TH", {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                        }).format(show.price)}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <Link to={`/products/${show.product_id}`}>
                          <button className="flex items-center text-xs rounded-lg bg-black gap-2 hover:text-black shadow-2xl hover:border transition-all ease-in duration-200 cursor-pointer font-medium hover:bg-white text-white p-2">
                            <span>View Detail</span>
                            <LuMousePointerClick className="text-xl" />
                          </button>
                        </Link>
                        <button className="flex items-center text-xs rounded-lg bg-black gap-2 hover:text-black shadow-2xl hover:border transition-all ease-in duration-200 cursor-pointer font-medium hover:bg-white text-white p-2">
                          <BsCartPlus className="text-xl" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
