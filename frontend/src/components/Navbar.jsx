
import logo from "../assets/logo.jpg"

//icon
import { IoMdSearch } from "react-icons/io";
import { RiShoppingBag2Line } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import {Link} from "react-router-dom"
const Navbar = () => {


  return (
    <>
    <div className=" bg-black">
        <div className="flex container mx-auto items-center justify-between p-6">
            <div className="">
                <Link to="/">
                <img src={logo} alt="Logo" className="w-20 h-10 cursor-pointer" />

                </Link>
            </div>
            <div className="flex items-center gap-8">
                <Link to="/">
                <p className="text-white text-xl font-semibold cursor-pointer">Home</p>

                </Link>
                <Link to="products">
                <p className="text-white text-xl font-semibold cursor-pointer">Products</p>

                </Link>
                <Link to="brands">
                <p className="text-white text-xl font-semibold cursor-pointer">Brands</p>

                </Link>
            </div>
            <div className="flex gap-4 items-center ">
                <div className="flex justify-between items-center p-1 w-70 border-2 border-white rounded-full">
                    <input type="text" placeholder="Search" className="pl-2 outline-none h-8 px-2 bg-transparent text-white placeholder:text-white placeholder:px-2"/>
                    <IoMdSearch className="text-white font-semibold text-2xl cursor-pointer "/>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/cart">
                    <RiShoppingBag2Line className="text-white font-semibold text-4xl cursor-pointer "/>
                    
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/register">
                    <FaRegUserCircle className="text-white text-4xl"/>
                    
                    </Link>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Navbar