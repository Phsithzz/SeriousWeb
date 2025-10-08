import { Link } from "react-router-dom";
const Category = () => {
  return (
    <>
      <div className="bg-white">
        <div className="flex flex-col text-center   p-2 space-y-6">
          <h1 className="text-2xl font-semibold text-center">All Category</h1>
          <Link
            to="/products/type/sneaker"
            className="text-xl font-semibold cursor-pointer"
          >
            Sneaker
          </Link>
          <Link
            to="/products/type/football"
            className="text-xl font-semibold cursor-pointer"
          >
            Football
          </Link>

          <Link
            to="/products/type/basketball"
            className="text-xl font-semibold cursor-pointer"
          >
            Basketball
          </Link>
          <Link
            to="/products/type/flipflops"
            className="text-xl font-semibold cursor-pointer"
          >
            Slide & Flip Flops
          </Link>
        </div>
      </div>
    </>
  );
};

export default Category;
