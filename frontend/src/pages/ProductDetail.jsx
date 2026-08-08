import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import * as products from "../function/product.js";
import { TbRulerMeasure } from "react-icons/tb";
import { HiOutlineChevronDown } from "react-icons/hi";
import { HiOutlineChevronUp } from "react-icons/hi";
import { motion as Motion } from "framer-motion";
import Detail from "../components/Detail.jsx";
import * as user from "../function/user.js";
import * as cart from "../function/cart.js";
import { RxCross2 } from "react-icons/rx";
import { FaCheckCircle } from "react-icons/fa";
import SizeShoe from "../components/SizeShoe.jsx";
import Swal from "sweetalert2";
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
  const [isOpen, setIsOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(null);

  const [showCart, setShowCart] = useState(false);

  const [email, setEmail] = useState(null);
  const [carts, setCarts] = useState([]);

  const [message, setMessage] = useState("");

  const [sizeShow, setSizeShow] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const resId = await products.getProductId(id);
        setProduct(resId.data);

        window.scrollTo(0, 0);
      } catch (error) {
        console.error("โหลดข้อมูลสินค้าไม่สำเร็จ:", error);
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await user.getUser();

        setEmail(res.data.email);
      } catch (err) {
        console.log(err);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    if (email) {
      const loadDataCart = async () => {
        try {
          const res = await cart.getCart();
          setCarts(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      loadDataCart();
    }
  }, [email]);

  const handleAddToCart = async () => {
    setMessage("");

    if (!selectedVariant) {
      setMessage("กรุณาเลือกไซส์ก่อนเพิ่มสินค้าลงตะกร้า");
      return;
    }

    try {
      const userRes = await user.getUser();
      const isLoggedIn = userRes.data.login;

      if (!isLoggedIn) {
        setMessage("คุณยังไม่ได้ Login ต้อง Login ก่อนซื้อสินค้า");
        return;
      }

      const cartData = {
        variant_id: selectedVariant.variant_id,
        quantity: 1,
      };

      const cartRes = await cart.addCart(cartData);

      if (cartRes.data.cartOK) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setShowCart(true);
        const res = await cart.getCart();
        setCarts(res.data);

      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถเพิ่มสินค้าได้",
          text: cartRes.data.messageAddCart || "เกิดข้อผิดพลาดในการเพิ่มสินค้า",
          confirmButtonText: "ตกลง",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "cursor-pointer bg-black text-white px-5 py-2 border rounded-md border-white hover:bg-white hover:border hover:text-black hover:border-black transition duration-200",
          },
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "เกิดข้อผิดพลาดบางอย่าง โปรดลองอีกครั้ง",
        confirmButtonText: "ตกลง",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "cursor-pointer bg-black text-white px-5 py-2 border rounded-md border-white hover:bg-white hover:border hover:text-black hover:border-black transition duration-200",
        },
      });
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
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
                  <Motion.div
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
                  </Motion.div>
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

              <button
                onClick={() => setOpenDetail(true)}
                className="text-left font-semibold underline cursor-pointer "
              >
                รายละเอียดสินค้า
              </button>
              {openDetail && (
                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-xs flex justify-center items-center z-50">
                  <Detail onCancel={() => setOpenDetail(false)} />
                </div>
              )}
              <div className="space-y-3">
                <div className="flex flex-wrap justify-between items-center">
                  <p className="font-semibold text-xl">เลือกไซส์</p>
                  <button
                    type="button"
                    onClick={() => setSizeShow(true)}
                    className="flex items-center gap-2 font-semibold underline cursor-pointer"
                  >
                    <TbRulerMeasure />
                    <span>คำแนะนำไซต์</span>
                  </button>
                  {sizeShow && (
                    <div className="fixed top-0 left-0 w-full h-full backdrop-blur-xs flex justify-center items-center z-50">
                      <SizeShoe onCancel={() => setSizeShow(false)} />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  {product.variants.map((v) => (
                    <button
                      type="button"
                      disabled={v.stock_quantity === 0}
                      key={v.variant_id}
                      onClick={() =>
                        setSelectedVariant((prev) =>
                          prev?.variant_id === v.variant_id ? null : v
                        )
                      }
                      className={`border-2 text-center border-gray-400 rounded-md px-4 transition ease-in  py-2 cursor-pointer
                          ${
                            v.stock_quantity === 0
                              ? "opacity-30 bg-gray-200 cursor-not-allowed line-through"
                              : selectedVariant?.variant_id === v.variant_id
                              ? "bg-black text-white border border-white"
                              : "hover:border-black "
                          }`}
                    >
                      {v.size} US
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="cursor-pointer relative overflow-hidden font-semibold text-md text-white px-6 py-3 rounded-full 
             border border-black bg-black transition-colors duration-500 group"
                >
                  <span className="relative z-10">เพิ่มในตะกร้า</span>
                  <span
                    className="absolute top-0 left-[-75%] w-1/2 h-full  bg-gradient-to-r 
               from-transparent via-white/80 to-transparent 
               skew-x-[-25deg] transition-all duration-700 ease-in-out 
               group-hover:left-[125%]"
                  ></span>
                </button>

                {message && (
                  <p className="text-red-500 text-sm font-semibold">
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {showCart && (
          <>
            <div className="fixed top-0 right-0 flex justify-end items-center w-full h-full bg-black/30   z-50">
              <div className="bg-white w-[400px] h-[350px] rounded-xl shadow-2xl fixed top-24 right-10">
                <div className="flex flex-col space-y-4 p-6">
                  <div className="flex item-center   justify-between ">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      <p className="text-md font-semibold">เพิ่มในตะกร้าแล้ว</p>
                    </div>
                    <RxCross2
                      onClick={() => setShowCart(false)}
                      className="text-2xl cursor-pointer hover:text-red-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <img
                      src={`${import.meta.env.VITE_API}/img_products/${
                        product.image_filename
                      }.jpg`}
                      alt={product.name}
                      className="w-30 h-30 object-cover"
                    />
                    <div className="flex flex-col space-y-1">
                      <p className="text-md font-semibold">{product.name}</p>
                      <p className="text-md font-medium text-black/50">
                        {product.description}
                      </p>
                      <p className="text-md font-medium text-black/50">
                        ไซส์ {selectedVariant.size} US{" "}
                      </p>
                      <p className="text-md font-medium">
                        {new Intl.NumberFormat("th-TH", {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                        }).format(product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/cart"
                      className="font-semibold text-md text-center border border-gray-300 text-black bg-white px-2 hover:border-black  transition-all ease-in duration-200 py-4 rounded-full cursor-pointer"
                    >
                      ดูตะกร้า ({carts.length})
                    </Link>

                    <Link
                      to="/pay"
                      className="font-semibold text-md text-center text-white bg-black px-2 hover:bg-white hover:text-black border transition-all ease-in duration-200 py-4 rounded-full cursor-pointer"
                    >
                      <span>เช็คเอาท์</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
