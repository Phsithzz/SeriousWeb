import { MdOutlineLocalMall } from "react-icons/md";
import { GrDeliver } from "react-icons/gr";
import { useEffect } from "react";
import { useState } from "react";
import { getCartOrder } from "../function/cart";
import { Link } from "react-router-dom";
const CartOrder = () => {
  const [order, setOrder] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getCartOrder();
        setOrder(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadData();
  }, []);
  return (
    <>
    {order.length === 0?(
        <p className="text-center text-black mt-6 text-lg">
          ยังไม่มีการสั่งซื้อ
        </p>
    ):(
order.map((item) => (
          <div
            className="w-full min-h-[300px] bg-white border border-gray-200 rounded-md shadow-md mb-6"
            key={item.cart_id}
          >
            <div className="max-w-5xl mx-auto p-6  rounded-md">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between border-b-2 pb-4 border-gray-300">
                  <div className="flex  gap-2 items-center ">
                    <MdOutlineLocalMall size={25} />
                    <p className="text-xl font-semibold">Adidus Mall</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex gap-2 items-center ">
                      <GrDeliver
                        size={20}
                        className="font-semibold text-green-400"
                      />
                      <p className="text-md font-semibold text-green-400">
                        พัสดุกำลังถูกจัดส่ง
                      </p>
                      <p className="text-md font-semibold text-green-400">
                        หมายเลขพัสดุ {item.cart_id}
                      </p>
                    </div>
                    <p className="text-md font-semibold text-green-400">สั่งซื้อสำเร็จแล้ว</p>
                  </div>
                </div>
                <div className="flex justify-between  border-b-2 pb-4 border-gray-300 mt-4 gap-4  p-4">
                  <div className="flex items-center gap-4 ">
                    <img
                      className="w-24 h-24 object-contain"
                      src={`${import.meta.env.VITE_API}/img_products/${
                        item.image_filename
                      }.jpg`}
                      alt={item.name}
                    />
                    <div className="flex flex-col space-y-2">
                      <p className="text-lg font-medium">{item.name}</p>
                      <p className="text-md font-medium">{item.description} </p>

                      <p className="text-md font-semibold ">{item.size} US</p>

                      <p className="text-md font-medium">x{item.quantity} </p>
                    </div>
                  </div>
                  <div className="flex space-y-18 flex-col">
                    <p className="text-md tracking-wide text-end font-semibold">
                      {new Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                        minimumFractionDigits: 0,
                      }).format(item.price)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <p className="text-md text-end font-semibold">
                        ช่องทางการชำระเงิน:
                      </p>
                      <p className="text-md  text-end font-semibold">
                        {item.payment_method}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white   border-b-2 pb-4 border-gray-300 mt-2 p-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold">ที่อยู่ในการจัดส่ง</p>
                    <div className="flex gap-4">
                      <p className="font-medium text-sm flex gap-2">
                        <span className="font-semibold">บ้านเลขที่:</span>
                        {item.house_number}
                      </p>
                      <p className="font-medium text-sm flex gap-2">
                        <span className="font-semibold">หมู่ที่:</span>
                        {item.village_number}
                      </p>
                      <p className="font-medium text-sm flex gap-2">
                        <span className="font-semibold">ตำบล:</span>
                        {item.subdistrict}
                      </p>
                      <p className="font-medium text-sm flex gap-2">
                        <span className="font-semibold">อำเภอ:</span>
                        {item.district}
                      </p>
                      <p className="font-medium text-sm flex gap-2">
                        <span className="font-semibold">จังหวัด:</span>
                        {item.province}
                      </p>
                      <p className="font-medium text-sm flex gap-2">
                        <span className="font-semibold">รหัสไปรษณีย์:</span>
                        {item.postal_code}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/products/${item.product_id}`}
                  className="cursor-pointer text-center relative overflow-hidden font-semibold text-md text-white px-6 py-3 rounded-md 
             border border-black bg-black transition-colors duration-500 group"
                >
                  <span className="relative z-10 ">ซื้ออีกครั้ง</span>
                  <span
                    className="absolute top-0 left-[-75%] w-1/2 h-full  bg-gradient-to-r 
               from-transparent via-white/80 to-transparent 
               skew-x-[-25deg] transition-all duration-700 ease-in-out 
               group-hover:left-[125%]"
                  ></span>
                </Link>
              </div>
            </div>
          </div>
      ))
    )}
      
    </>
  );
};

export default CartOrder;
