import React from 'react'

const Category = () => {
  return (
    <>
    <div className="bg-white">
        <div className="flex flex-col p-2 space-y-6">
            <h1 className="text-2xl font-semibold text-center">All Product</h1>
            <ul className="text-center space-y-4">
                <li className="text-xl font-semibold cursor-pointer">Sneaker</li>
                <li className="text-xl font-semibold cursor-pointer">Football</li>
                <li className="text-xl font-semibold cursor-pointer">Basketball</li>
                <li className="text-xl font-semibold cursor-pointer">Slide & Flip Flops</li>
            </ul>
        </div>
    </div>
    </>
  )
}

export default Category