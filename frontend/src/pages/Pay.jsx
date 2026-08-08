import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import pay1 from "../assets/pay1.png";
import pay2 from "../assets/pay2.png";
import pay3 from "../assets/pay3.png";

import * as cart from "../function/cart.js";
import { getUser } from "../function/user";

import Swal from "sweetalert2";
import success from "../assets/success.png";
const selectPay = [
  {
    id: 1,
    image: pay1,
    name: "พร้อมเพย์",
  },
  {
    id: 2,
    image: pay2,
    name: "ทรูวอลเล็ต",
  },
  {
    id: 3,
    image: pay3,
    name: "เก็บเงินปลายทาง",
  },
];
const Pay = () => {
  const [email, setEmail] = useState(null);
  const [carts, setCarts] = useState([]);

  const [activeTab, setActiveTab] = useState("address");

  const [selectedPay, setSelectedPay] = useState(null);

  const [address, setAddress] = useState({
    house_number: "",
    village_number: "",
    subdistrict: "",
    district: "",
    province: "",
    postal_code: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    const checkEmail = async () => {
      try {
        const res = await getUser();
        setEmail(res.data.email);
      } catch (err) {
        console.log(err);
      }
    };
    checkEmail();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await cart.getCart();
        setCarts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadData();
  }, [email]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleConfirm = async () => {
    if (
      !address.house_number ||
      !address.village_number ||
      !address.subdistrict ||
      !address.district ||
      !address.province ||
      !address.postal_code ||
      !paymentMethod
    ) {
      Swal.fire({
        html: `
      <div class="flex flex-col items-center space-y-4">
        <p class="text-center text-md font-semibold">เฮ้! อย่าลืมใส่ที่อยู่และเลือกวิธีชำระเงินนะ!</p>
        <button id="go" class="cursor-pointer relative overflow-hidden font-semibold text-md text-white px-6 py-3 rounded-md 
          border border-black bg-black transition-colors duration-500 group">
          <span class="relative z-10">ตกลง</span>
          <span class="absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r 
            from-transparent via-white/80 to-transparent skew-x-[-25deg] 
            transition-all duration-700 ease-in-out group-hover:left-[125%]"></span>
        </button>
      </div>
    `,
        icon: "error",
        showConfirmButton: false,
        background: "white",
        width: 500,
        padding: "2rem",
        didOpen: () => {
          const btn = document.getElementById("go"); // bind ให้ตรงปุ่มจริง
          if (btn) {
            btn.addEventListener("click", () => {
              Swal.close(); // ปิด popup
            });
          }
        },
      });

      return;
    }

    try {
      await cart.confirmCart(address, paymentMethod);

      Swal.fire({
        html: `
      <div class="flex flex-col justify-center items-center space-y-4">
        <img src="${success}" class="w-40 h-40" />
        <p class="text-center text-2xl font-semibold">คำสั่งซื้อของคุณได้รับการยืนยันแล้ว</p>
            <button id="confirmOrder" class="cursor-pointer relative overflow-hidden font-semibold text-md text-white px-6 py-3 rounded-md 
          border border-black bg-black transition-colors duration-500 group">
          <span class="relative z-10">ตกลง</span>
          <span class="absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r 
            from-transparent via-white/80 to-transparent skew-x-[-25deg] 
            transition-all duration-700 ease-in-out group-hover:left-[125%]"></span>
        </button>
      </div>
    `,
        showConfirmButton: false,
        background: "white",
        width: 500,
        padding: "2rem",
        didOpen: () => {
          const btn = document.getElementById("confirmOrder");
          if (btn) {
            btn.addEventListener("click", () => {
              Swal.close();
              window.location.href = "/cart";
            });
          }
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const totalPrice = carts.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  return (
    <>
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto p-10 mt-8">
          <div className="flex justify-between gap-6">
            <div className="flex flex-col gap-4 w-[60%] space-y-2 shadow-sm rounded-lg  border border-gray-200">
              <div className="flex border-b-4 border-gray-300 w-full ">
                <button
                  className={`flex-1 p-4 text-lg font-semibold text-center cursor-pointer rounded-t-lg
                  ${
                    activeTab === "address"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                  onClick={() => setActiveTab("address")}
                >
                  ที่อยู่การจัดส่ง
                </button>

                <button
                  className={`flex-1 p-4 text-lg font-semibold text-center rounded-t-lg cursor-pointer
                  ${
                    activeTab === "payment"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                  onClick={() => setActiveTab("payment")}
                >
                  ช่องทางการชำระเงิน
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === "address" && (
                  <div className="flex flex-col space-y-4">
                    <h1 className="text-xl font-semibold">
                      กรอกที่อยู่การจัดส่ง
                    </h1>
                    {/* ใส่ฟอร์มกรอกที่อยู่ที่นี่ */}
                    <form className="flex flex-col">
                      <div className="flex gap-4">
                        <div className="flex flex-col w-[60%] space-y-2">
                          <label htmlFor="house_number">บ้านเลขที่</label>
                          <input
                            type="text"
                            name="house_number"
                            placeholder="บ้านเลขที่"
                            value={address.house_number}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-2 rounded-md"
                          />
                        </div>
                        <div className="flex flex-col w-[40%] space-y-2">
                          <label htmlFor="village_number">หมู่ที่</label>
                          <input
                            type="text"
                            name="village_number"
                            placeholder="หมู่ที่"
                            value={address.village_number}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-2 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex flex-col w-[50%] space-y-2">
                          <label htmlFor="subdistrict">ตำบล</label>
                          <input
                            type="text"
                            name="subdistrict"
                            placeholder="ตำบล"
                            value={address.subdistrict}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-2 rounded-md"
                          />
                        </div>
                        <div className="flex flex-col w-[50%] space-y-2">
                          <label htmlFor="district">อำเภอ</label>
                          <input
                            type="text"
                            name="district"
                            placeholder="อำเภอ"
                            value={address.district}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-2 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex flex-col w-[60%] space-y-2">
                          <label htmlFor="province">จังหวัด</label>
                          <input
                            type="text"
                            name="province"
                            placeholder="จังหวัด"
                            value={address.province}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-2 rounded-md"
                          />
                        </div>
                        <div className="flex flex-col w-[30%] space-y-2">
                          <label htmlFor="postal_code">รหัสไปรษณีย์</label>
                          <input
                            type="text"
                            name="postal_code"
                            placeholder="รหัสไปรษณีย์"
                            value={address.postal_code}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-2 rounded-md"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === "payment" && (
                  <div className="flex flex-col space-y-4">
                    <h1 className="text-xl font-semibold">
                      เลือกช่องทางการชำระเงิน
                    </h1>
                    {/* ใส่ฟอร์มหรือปุ่มช่องทางชำระเงินที่นี่ */}
                    {selectPay.map((pay) => (
                      <>
                        <div
                          key={pay.id}
                          onClick={() => {
                            const isSelected = selectedPay === pay.id;
                            setSelectedPay(isSelected ? null : pay.id);
                            setPaymentMethod(isSelected ? null : pay.name);
                          }}
                          className={`cursor-pointer px-4 py-2 rounded-xl border border-gray-200 flex items-center gap-4 
      ${
        selectedPay === pay.id
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={pay.image}
                              alt={pay.name}
                              className="w-16 h-16 object-contain"
                            />
                            <p className="text-xl font-semibold">{pay.name}</p>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col w-[40%] space-y-4 shadow-sm rounded-lg p-6 border border-gray-200 ">
              <div className="flex items-center gap-2">
                <FaBoxOpen size={40} />
                <h1 className="text-xl font-semibold ">คำสั่งซื้อของคุณ</h1>
              </div>

              <div className="flex flex-col space-y-4">
                {carts.map((cart) => (
                  <>
                    <div className="flex flex-col space-y-4" key={cart.cart_id}>
                      <div className="flex gap-2 border-b-2 pb-4 border-gray-200 ">
                        <img
                          src={`${import.meta.env.VITE_API}/img_products/${
                            cart.image_filename
                          }.jpg`}
                          className="w-20 h-20 object-contain"
                          alt={cart.name}
                        />
                        <div className="flex space-y-4 flex-col w-full">
                          <div className="flex flex-col">
                            <p className="text-sm font-semibold">{cart.name}</p>
                            <p className="text-sm font-semibold text-gray-400">
                              {cart.size}
                            </p>
                          </div>

                          <div className="flex  justify-between">
                            <p className="text-md font-semibold">
                              X {cart.quantity}
                            </p>
                            <p className="text-md tracking-wide font-semibold">
                              {new Intl.NumberFormat("th-TH", {
                                style: "currency",
                                currency: "THB",
                                minimumFractionDigits: 0,
                              }).format(cart.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                <div className="flex flex-col space-y-2 border-b-2 border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <p className="text-md font-medium">ค่าจัดส่ง</p>
                    <p className="text-md font-semibold">ฟรี</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-md font-medium">ยอดรวมย่อย</p>
                    <p className="text-md tracking-wide font-semibold">
                      {new Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                        minimumFractionDigits: 0,
                      }).format(totalPrice)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="text-lg font-semibold ">ยอดรวม</p>
                  <p className="text-md tracking-wide font-semibold">
                    {new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 0,
                    }).format(totalPrice)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="cursor-pointer relative overflow-hidden font-semibold text-md text-white px-6 py-3 rounded-full 
             border border-black bg-black transition-colors duration-500 group"
                >
                  <span className="relative z-10">ยืนยันคำสั่งซื้อ</span>
                  <span
                    className="absolute top-0 left-[-75%] w-1/2 h-full  bg-gradient-to-r 
               from-transparent via-white/80 to-transparent 
               skew-x-[-25deg] transition-all duration-700 ease-in-out 
               group-hover:left-[125%]"
                  ></span>
                </button>

              
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pay;
