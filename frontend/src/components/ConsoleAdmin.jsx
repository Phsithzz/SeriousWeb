import { Link } from "react-router-dom";

import { SlWrench } from "react-icons/sl";
import { RiUserSearchLine } from "react-icons/ri";
import { MdProductionQuantityLimits } from "react-icons/md";
import { GiStack } from "react-icons/gi";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineOrderedList } from "react-icons/ai";
import { RiLogoutBoxLine } from "react-icons/ri";

import * as user from "../function/user.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EditProfileAdmin from "./EditProfileAdmin.jsx";
const ConsoleAdmin = () => {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [imageUser, setImageUser] = useState(null);


  const [editAdmin,setEditAdmin] = useState(false)
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    user.getUser()
      .then((res) => {
        if (active) setEmail(res.data.email);
      })
      .catch(() => navigate("/login"));
    return () => {
      active = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (!email) return;
    let active = true;
    const loadProfile = async () => {
      try {
        const res = await user.getOneUser();
        if (active) {
          setName(res.data.name);
          setLastname(res.data.lastname);
        }
      } catch (err) {
        console.log(err);
      }
    };
    const image = new Image();
    image.src = `${import.meta.env.VITE_API}/img_users/${email}.jpg`;
    image.onload = () => active && setImageUser(true);
    image.onerror = () => active && setImageUser(false);
    loadProfile();
    return () => {
      active = false;
    };
  }, [email]);

  const checkImage = () => {
    if (!email) return;
    const image = new Image();
    image.src = `${import.meta.env.VITE_API}/img_users/${email}.jpg?${Date.now()}`;
    image.onload = () => setImageUser(true);
    image.onerror = () => setImageUser(false);
  };

  const userLogout = async () => {
    try {
      await user.logoutUser();
      setShowLogout(false);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="flex flex-col h-screen p-4">
        <div className="flex fixed items-center justify-center gap-2">
          <SlWrench className="text-white font-semibold" size={30} />
          <h1 className="text-white text-2xl font-semibold cursor-pointer">
            ADMIN CONSOLE
          </h1>
        </div>

        <div className="flex flex-col  fixed top-10 justify-center space-y-4 p-8">
          <div className="flex items-center gap-4">
            <MdProductionQuantityLimits size={30} color="white" />
            <Link to="/admin/products" className="text-md text-white font-medium cursor-pointer">
              Products List
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <GiStack size={30} color="white" />
            <Link to="/admin/variant" className="text-md text-white font-medium cursor-pointer">
              Products Variants List
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <RiUserSearchLine size={30} color="white" />
            <Link to="/admin/users" className="text-md text-white font-medium cursor-pointer">
              User List
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <FiShoppingCart size={30} color="white" />
            <Link to="/admin/cart" className="text-md text-white font-medium cursor-pointer">
              Cart List
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <AiOutlineOrderedList size={30} color="white" />
            <Link to="/admin/order" className="text-md text-white font-medium cursor-pointer">
              Orders List
            </Link>
          </div>
        </div>
        <div className="fixed bottom-6 flex flex-col mt-auto items-center  space-y-4">
          <div className="flex p-4  gap-4 items-center">
            <img
              src={
                imageUser
                  ? `${
                      import.meta.env.VITE_API
                    }/img_users/${email}.jpg?${Date.now()}`
                  : `${import.meta.env.VITE_API}/img_users/default.jpg`
              }
              onClick={()=> setEditAdmin(true)}
              alt={email}
              className="rounded-full border-2 border-white  cursor-pointer w-[60px] h-[60px] bg-contain"
            />
            {editAdmin && <>
            <div className="fixed top-0 right-0 flex justify-center  items-center w-full h-full bg-black/30   z-50">
            <div className="bg-white w-[500px]  rounded-2xl  p-6">

              <EditProfileAdmin 
              name={name} 
              lastname={lastname}
              email={email}
              image={imageUser}
              checkImage={checkImage  }
              onCancel={()=>setEditAdmin(false)}/>
            </div>
            </div>
          
            </>}
            <div className="flex gap-2">
              <p className="text-white font-semibold text-md">{name}</p>
              <p className="text-white font-semibold text-md">{lastname}</p>
            </div>
          </div>
           <div className="flex items-center gap-6 cursor-pointer">
                  <RiLogoutBoxLine size={20} color="white"/>
                  <button
                    className="cursor-pointer text-white "
                    onClick={() => setShowLogout(true)}
                  >
                    ออกจากระบบ
                  </button>
                  {showLogout && (
                    <>
                      <div className="fixed top-0 right-0 flex justify-center  items-center w-full h-full bg-black/30   z-50">
                        <div className="bg-white w-[500px]  rounded-2xl  p-6">
                          <div className="flex flex-col space-y-4 justify-center items-center">
                            <h1 className="text-2xl font-semibold ">
                              ต้องการออกจากระบบ ?
                            </h1>

                            <div className="flex gap-4  w-full justify-between">
                              <button
                                type="button"
                                onClick={() => setShowLogout(false)}
                                className="cursor-pointer px-4 py-2 border-2 w-full hover:border-red-600  transition ease-in duration-200 text-black rounded-md  text-center bg-white  font-semibold"
                              >
                                ยกเลิก
                              </button>
                              <button
                                type="button"
                                onClick={userLogout}
                                className="cursor-pointer border-2 px-4 py-2 text-white hover:bg-white w-full hover:text-black transition ease-in duration-200 rounded-md  text-center bg-black font-semibold"
                              >
                                ออกจากระบบ
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )} </div>
        </div>
      </div>
    </>
  );
};

export default ConsoleAdmin;
