import Navbar from "../components/Navbar.jsx";
import { useCallback, useEffect, useState } from "react";
import * as users from "../function/user.js";
import { FaRegUser } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { RiBillLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import CartOrder from "./CartOrder.jsx";
import Footer from "../components/Footer.jsx";
const PageUser = () => {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [lastname, setLastname] = useState(null);

  const [editUser, setEditUser] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [imageUser, setImageUser] = useState(false);

  const [editMessageUser, setEditMessageUser] = useState(null);
  const [editMessagePassword, setEditMessagePassword] = useState(null);

  const [tempName, setTempName] = useState("");
  const [tempLastname, setTempLastname] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    const getInfoUser = async () => {
      if (!email) return;
      try {
        const res = await users.getOneUser();
        setName(res.data.name);
        setLastname(res.data.lastname);
      } catch (err) {
        console.log(err);
      }
    };
    getInfoUser();
  }, [email]);

  const getUser = async () => {
    await users
      .getUser()
      .then((res) => {
        setEmail(res.data.email);
      })
      .catch((err) => console.log(err.message));
  };
  const userLogout = async () => {
    try {
      await users.logoutUser();
      setShowLogout(false);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  const handleOpenEditUser = () => {
    setTempName(name);
    setTempLastname(lastname);
    setTempEmail(email);
    setEditMessageUser(null);
    setEditUser(true);
  };

  const handleUpdateInfo = async () => {
    if (!tempName || !tempLastname || !tempEmail) {
      setEditMessageUser("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const userData = {
      name: tempName,
      lastname: tempLastname,
      email: tempEmail,
    };
    try {
      await users.userEditInfo(userData);
      setName(tempName);
      setLastname(tempLastname);
      setEmail(tempEmail);
      setEditMessageUser("อัปเดตข้อมูลสำเร็จ ✅");
      setEditUser(false);
    } catch (err) {
      console.log(err);
      setEditMessageUser("อัปเดตข้อมูลล้มเหลว ❌");
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setEditMessagePassword("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (newPassword !== confirmPassword) {
      setEditMessagePassword("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      await users.updatePassword(currentPassword, newPassword);
      setEditPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEditMessagePassword("");
    } catch (err) {
      console.log(err);
      setEditMessagePassword(
        err.response?.data?.message || "เปลี่ยนรหัสผ่านล้มเหลว ❌"
      );
    }
  };

  const checkImage = useCallback(() => {
    if (!email) return;
    const image = new Image();
    image.src = `${import.meta.env.VITE_API}/img_users/${email}.jpg`;

    image.onload = () => {
      setImageUser(true);
    };
    image.onerror = () => {
      setImageUser(false);
    };
  }, [email]);

  useEffect(() => {
    checkImage();
  }, [checkImage]);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const uploadFile = async () => {
    if (!file) {
      setEditMessageUser("Please select a JPEG image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await users.uploadUser(formData);
      checkImage();
      setPreview(null);
      setEditImage(false);
    } catch (err) {
      console.log(err);
      setEditMessageUser("Upload failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white w-full min-h-screen">
        <div className="max-w-7xl mx-auto p-10 ">
          <div className="flex gap-4  justify-between">
            <div className="flex flex-col space-y-8 w-[25%] ">
              <h1 className="text-2xl font-semibold">ภาพรวมบัญชี</h1>

              <div className="flex flex-col space-y-2">
                <div
                  onClick={() => setActiveTab("profile")}
                  className={`flex flex-wrap gap-6 items-center   cursor-pointer ${
                    activeTab === "profile"
                      ? "font-bold text-red-500"
                      : "text-black"
                  }`}
                >
                  <FaRegUser />
                  <p className="text-md hover:text-red-500 transition ease-in duration-200">
                    โปรไฟล์
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("order")}
                  className={`flex flex-wrap gap-6 items-center  cursor-pointer ${
                    activeTab === "order"
                      ? "font-bold text-red-500"
                      : "text-black"
                  }`}
                >
                  <RiBillLine />
                  <p>การซื้อของฉัน</p>
                </div>

                <div className="flex items-center gap-6 cursor-pointer">
                  <RiLogoutBoxLine />
                  <button
                    className="cursor-pointer text-md hover:text-red-500 transition ease-in duration-200"
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
                                onClick={userLogout}
                                type="button"
                                className="cursor-pointer w-full relative overflow-hidden font-semibold text-md text-white px-6 py-3 rounded-md 
             border border-black bg-black transition-colors duration-500 group"
                              >
                                <span className="relative z-10">บันทึก</span>
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
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="w-[75%]">
              {activeTab === "profile" && (
                <>
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-wrap item-center gap-20">
                      <div className="flex flex-col relative  ">
                        <img
                          src={
                            imageUser
                              ? `${
                                  import.meta.env.VITE_API
                                }/img_users/${email}.jpg?${Date.now()}`
                              : `${
                                  import.meta.env.VITE_API
                                }/img_users/default.jpg`
                          }
                          alt={email}
                          className="rounded-full w-[200px] h-[200px] bg-contain"
                        />

                        <div className="flex absolute cursor-pointer bottom-0 rounded-full w-12 h-12 items-center justify-center right-0 gap-2 bg-black ">
                          <FaRegEdit
                            onClick={() => {
                              setPreview(null);
                              setFile(null);
                              setEditImage(true);
                            }}
                            className="text-white text-xl font-semibold"
                          />
                        </div>
                      </div>

                      {editImage && (
                        <>
                          <div className="fixed top-0 right-0 flex justify-center  items-center w-full h-full bg-black/30   z-50">
                            <div className="relative bg-white w-[500px]  rounded-2xl  p-6">
                              <button
                                onClick={() => {
                                  setPreview(null); 
                                  setFile(null);
                                  setEditImage(false);
                                }}
                              >
                                <RxCross2 className="absolute top-2 right-2  cursor-pointer text-[#7f7f7f] hover:text-[#b80000] text-2xl" />
                              </button>
                              <div className="flex flex-col justify-center items-center space-y-4">
                                <h1 className="text-2xl font-semibold ">
                                  แก้ไขรูปภาพโปรไฟล์
                                </h1>
                                <div className="flex flex-col relative">
                                  <img
                                    src={
                                      preview
                                        ? preview
                                        : imageUser
                                        ? `${
                                            import.meta.env.VITE_API
                                          }/img_users/${email}.jpg?${Date.now()}`
                                        : `${
                                            import.meta.env.VITE_API
                                          }/img_users/default.jpg`
                                    }
                                    alt={email}
                                    className="rounded-full w-[200px] h-[200px] bg-contain"
                                  />
                                  <label className="flex absolute cursor-pointer bottom-0 rounded-full w-12 h-12 items-center justify-center right-0 gap-2 bg-black">
                                    <FaRegEdit className="text-white text-xl font-semibold" />
                                    <input
                                      type="file"
                                      accept="image/jpeg"
                                      className="hidden"
                                      onChange={onFileChange}
                                    />
                                  </label>
                                </div>
                                <button
                                  type="button"
                                  onClick={uploadFile}
                                  className="cursor-pointer relative overflow-hidden font-semibold text-md text-white px-6 py-3 rounded-md 
             border border-black bg-black transition-colors duration-500 group"
                                >
                                  <span className="relative z-10">
                                    เปลี่ยนรูปภาพ
                                  </span>
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
                        </>
                      )}

                      <div className="flex flex-wrap gap-6 items-center">
                        <p className="text-6xl  font-semibold">{name}</p>
                        <p className="text-6xl  font-semibold">{lastname}</p>
                      </div>
                    </div>

                    <div className="flex justify-between gap-10">
                      <div className="flex flex-col w-[50%] space-y-2">
                        <div className="flex flex-wrap justify-between border-b-2 p-2 border-gray-300">
                          <div className="flex flex-wrap items-center gap-4 ">
                            <BiSolidUserDetail className="text-2xl font-semibold " />
                            <p className="text-lg font-semibold ">
                              รายละเอียดบัญชี
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-lg underline font-semibold cursor-pointer"
                            onClick={handleOpenEditUser}
                          >
                            แก้ไข
                          </button>
                          {editUser && (
                            <>
                              <div className="fixed top-0 right-0 flex justify-center  items-center w-full h-full bg-black/30   z-50">
                                <div className="bg-white w-[500px]  rounded-2xl  p-6">
                                  <div className="flex flex-col space-y-4">
                                    <h1 className="text-2xl font-semibold">
                                      แก้ไขโปรไฟล์
                                    </h1>

                                    <form className="flex flex-col space-y-2">
                                      <div className="flex flex-col">
                                        <label
                                          htmlFor="nameuser"
                                          className="text-md font-semibold"
                                        >
                                          ชื่อ
                                        </label>
                                        <input
                                          onChange={(e) =>
                                            setTempName(e.target.value)
                                          }
                                          type="text"
                                          id="username"
                                          value={tempName}
                                          className="border-2 border-[#919191] p-2 rounded-xs  pl-4"
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <label
                                          htmlFor="lastnameuser"
                                          className="text-md font-semibold"
                                        >
                                          นามสกุล
                                        </label>
                                        <input
                                          onChange={(e) =>
                                            setTempLastname(e.target.value)
                                          }
                                          type="text"
                                          id="lastnameuser"
                                          value={tempLastname}
                                          className="border-2 border-[#919191] p-2 rounded-xs  pl-4"
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <label
                                          htmlFor="emailuser"
                                          className="text-md font-semibold"
                                        >
                                          อีเมล
                                        </label>
                                        <input
                                          onChange={(e) =>
                                            setTempEmail(e.target.value)
                                          }
                                          type="email"
                                          id="useemailusername"
                                          value={tempEmail}
                                          className="border-2 border-[#919191] p-2 rounded-xs  pl-4"
                                        />
                                      </div>

                                      {editMessageUser && (
                                        <>
                                          <p className="text-md pl-2 font-medium  text-red-500">
                                            {editMessageUser}
                                          </p>
                                        </>
                                      )}
                                    </form>
                                    <div className="flex gap-4  justify-between">
                                      <button
                                        type="button"
                                        onClick={() => setEditUser(false)}
                                        className="cursor-pointer px-4 py-2 border-2 w-full hover:border-red-600  transition ease-in duration-200 text-black rounded-md  text-center bg-white  font-semibold"
                                      >
                                        ยกเลิก
                                      </button>
                                      <button
                                        type="submit"
                                        onClick={handleUpdateInfo}
                                        className="cursor-pointer w-full relative overflow-hidden font-semibold text-md text-white px-6 py-3 rounded-md 
             border border-black bg-black transition-colors duration-500 group"
                                      >
                                        <span className="relative z-10">
                                          บันทึก
                                        </span>
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
                            </>
                          )}
                        </div>

                        <div className="flex flex-col  space-y-2 ">
                          <div className="flex flex-wrap justify-between">
                            <p className="text-lg font-semibold ">ชื่อ</p>
                            <p className="text-lg  font-medium w-[50%]">
                              {" "}
                              {name}
                            </p>
                          </div>
                          <div className="flex flex-wrap justify-between">
                            <p className="text-lg font-semibold ">นามสกุล</p>
                            <p className="text-lg font-medium w-[50%]">
                              {lastname}
                            </p>
                          </div>
                          <div className="flex flex-wrap justify-between">
                            <p className="text-lg font-semibold ">อีเมล</p>
                            <p className="text-lg  font-medium w-[50%]">
                              {email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 w-[50%]">
                        <div className="flex flex-wrap justify-between border-b-2 p-2 border-gray-300">
                          <div className="flex flex-wrap items-center gap-4 ">
                            <FaLock className="text-2xl font-semibold " />
                            <p className="text-lg font-semibold ">รหัสผ่าน</p>
                          </div>
                          <button
                            type="button"
                            className="text-lg underline font-semibold cursor-pointer"
                            onClick={() => setEditPassword(true)}
                          >
                            แก้ไข
                          </button>
                          {editPassword && (
                            <>
                              <div className="fixed top-0 right-0 flex justify-center  items-center w-full h-full bg-black/30   z-50">
                                <div className="bg-white w-[500px]  rounded-2xl  p-6">
                                  <div className="flex flex-col space-y-4">
                                    <h1 className="text-2xl font-semibold">
                                      แก้ไขรหัสผ่าน
                                    </h1>

                                    <form className="flex flex-col space-y-2">
                                      <div className="flex flex-col">
                                        <label
                                          htmlFor="passworduser"
                                          className="text-md font-semibold"
                                        >
                                          รหัสผ่านปัจจุบัน
                                        </label>
                                        <input
                                          type="password"
                                          value={currentPassword}
                                          onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                          }
                                          id="passwordusername"
                                          className="border-2 border-[#919191] p-2 rounded-xs  pl-4"
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <label
                                          htmlFor="newpassworduser"
                                          className="text-md font-semibold"
                                        >
                                          รหัสผ่านใหม่
                                        </label>
                                        <input
                                          type="password"
                                          value={newPassword}
                                          onChange={(e) =>
                                            setNewPassword(e.target.value)
                                          }
                                          id="newpassworduser"
                                          className="border-2 border-[#919191] p-2 rounded-xs  pl-4"
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <label
                                          htmlFor="confirmpassworduser"
                                          className="text-md font-semibold"
                                        >
                                          ยืนยันรหัสผ่านใหม่
                                        </label>
                                        <input
                                          value={confirmPassword}
                                          onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                          }
                                          type="password"
                                          id="confirmpassworduser"
                                          className="border-2 border-[#919191] p-2 rounded-xs  pl-4"
                                        />
                                      </div>
                                      {editMessagePassword && (
                                        <>
                                          <p className="text-md pl-2 font-medium  text-red-500">
                                            {editMessagePassword}
                                          </p>
                                        </>
                                      )}
                                    </form>
                                    <div className="flex gap-4  justify-between">
                                      <button
                                        type="button"
                                        onClick={() => setEditPassword(false)}
                                        className="cursor-pointer px-4 py-2 border-2 w-full hover:border-red-600 transition ease-in duration-200 text-black rounded-md  text-center bg-white  font-semibold"
                                      >
                                        ยกเลิก
                                      </button>
                                      <button
                                        onClick={handleUpdatePassword}
                                        type="submit"
                                        className="cursor-pointer w-full relative overflow-hidden font-semibold text-md text-white px-6 py-3 rounded-md 
             border border-black bg-black transition-colors duration-500 group"
                                      >
                                        <span className="relative z-10">
                                          บันทึก
                                        </span>
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
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap justify-between">
                          <p className="text-lg font-semibold">รหัสผ่าน</p>
                          <p className="text-lg font-medium w-[50%]">
                            *************
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activeTab === "order" && (
                <>
                  <CartOrder email={email} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PageUser;
