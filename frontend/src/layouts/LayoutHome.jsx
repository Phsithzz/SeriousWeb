import React from "react";
import Navbar from "../components/Navbar";
import Category from "../components/Category";
import Hero from "../components/Hero";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as user from "../function/user.js";
import Footer from "../components/Footer.jsx";
const LayoutHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await user.getUser();
        if (res.data.role === "admin") {
          navigate("/admin/products");
        }
      } catch (err) {
        console.log("ไม่พบผู้ใช้หรือ token หมดอายุ", err);
      }
    };

    checkUser();
  }, [navigate]);
  return (
    <>
      <div className="flex flex-col">
        <Navbar />
      </div>
      <div className="flex flex-col md:flex-row gap-2 p-4">
        <div className="w-full md:w-[15%] ">
          <Category />
        </div>
        <div className="flex flex-col space-y-10 p-4 w-[85%] ">
          <Hero />
          <div className="mt-6">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </>
  );
};

export default LayoutHome;
