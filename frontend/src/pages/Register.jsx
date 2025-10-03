import React from 'react'
import { RxCross2 } from "react-icons/rx";
import { Link } from 'react-router-dom'
const Register = () => {
  return (
    <>
    <div className="bg-[#1E1E1E] flex justify-center items-center min-h-screen">
        <div className="w-[350px] h-[545px] rounded-2xl  bg-white p-8 relative">
            <h1 className='text-center font-bold text-xl'>Sign up</h1>
            <form  className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="name" className="text-md font-semibold">Name</label>
                    <input type="text" id="name" className="border rounded-md p-1 pl-4" placeholder="Enter your Name" required/>
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="lastname" className="text-md font-semibold focus:mx-20 my-[-20]" >Lastname</label>
                    <input type="text"  id="lastname" className="border rounded-md p-1 pl-4" placeholder="Enter your LastName" required/>
                </div>
                 <div className="flex flex-col space-y-2">
                    <label htmlFor="lastname" className="text-md font-semibold ">Lastname</label>
                    <input type="email"  id="lastname" className="border rounded-md p-1 pl-4" placeholder="Enter your LastName" required/>
                </div>
                 <div className="flex flex-col space-y-2">
                    <label htmlFor="lastname" className="text-md font-semibold ">Password</label>
                    <input type="password"  id="lastname" className="border rounded-md p-1 pl-4" placeholder="Enter your Password" required/>
                </div>
                <div className="flex mt-8  justify-center ">
                    <button type="submit" className="bg-[#1E1E1E] text-white font-semibold w-full p-1 rounded-md">Sign up</button>
                </div>
                <p className="text-center text-gray-500 text-xs font-semibold">Already have an account? <Link to="/login" className="text-gray-700 underline">Sign in here</Link></p>
            </form>
            <Link to="/" className="cursor-pointer">
          <RxCross2 className="absolute top-2 right-2 text-2xl"/>

            </Link>
        </div>
    </div>
    </>
  )
}

export default Register