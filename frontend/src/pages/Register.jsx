import axios from "axios";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [regist, setRegist] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setRegist(false);
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/user/register`,
        { name, lastname, email, password }
      );
      console.log(res.data);
      setRegist(res.data.regist);
      setMessage(res.data.message);

      if (res.data.regist === true) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data) {
        setRegist(false);
        setMessage(err.response.data.message || "Login failed");
      } else {
        setRegist(false);
        setMessage("Server error");
      }
    }
  };
  return (
    <>
      <div className="bg-[#7D7D7D] flex justify-center items-center min-h-screen">
        <div className="w-[400px]  rounded-2xl  bg-white p-8 relative">
          <h1 className="text-center font-bold text-[40px]">Sign up</h1>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-[24px] font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-[#919191] p-2 rounded-md  pl-4"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="lastname" className="text-[24px] font-semibold ">
                Lastname
              </label>
              <input
                type="text"
                onChange={(e) => setLastname(e.target.value)}
                id="lastname"
                className="border-2 border-[#919191] p-2 rounded-md pl-4"
                placeholder="LastName"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="mail" className="text-[24px]  font-semibold ">
                Email
              </label>
              <input
                type="email"
                id="mail"
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-[#919191] p-2 rounded-md  pl-4"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="pwd" className="text-[24px]  font-semibold ">
                Password
              </label>
              <input
                type="password"
                id="pwd"
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-[#919191] p-2 rounded-md  pl-4"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="confirmpassword"
                className="text-[24px]  font-semibold "
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmpassword"
                onChange={(e) => setConfirm(e.target.value)}
                className="border-2 border-[#919191] p-2 rounded-md  pl-4"
                placeholder="Confirm Password"
                required
              />
            </div>

            <div className="flex  justify-center ">
              <button
                type="submit"
                className="bg-[#3D3737] cursor-pointer text-white text-[18px] font-semibold  hover:bg-black hover:scale-105 transition-all duration-300 w-full py-2 px-4 rounded-md"
              >
                Sign up
              </button>
            </div>
            {message && (
              <p
                className={` font-semibold text-xs ${
                  regist ? "text-green-400" : "text-red-500"
                }`}
              >
                {regist ? "ลงทะเบียนสำเร็จ - " : "ลงทะเบียนไม่สำเร็จ - "}
                {message}
              </p>
            )}
            <p className="text-center text-[#7B7B7B] text-[17px] font-semibold mt-[8px]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#4A4A4A] font-semibold hover:text-[#020a13] underline"
              >
                Sign in here
              </Link>
            </p>
          </form>

          <Link to="/home" className="cursor-pointer">
            <RxCross2 className="absolute top-2 right-2  cursor-pointer text-[#7f7f7f] hover:text-[#b80000] text-2xl" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;
