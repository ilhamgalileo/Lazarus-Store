import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full sm:w-[18rem] text-lg text-gray-950 md:w-[18rem] lg:w-[18rem] max-w-xs mx-auto p-3">
      <div className="block relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-[40rem] h-[9rem] object-cover rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="mt-3 p-2 text-sm shadow-2xl shadow-gray-500">
        <h2 className="flex justify-between items-center">
          <Link
            to={`/product/${product._id}`}
            className="hover:underline hover:underline-offset-2"
          >
            {product.name.length > 19 ? product.name.substring(0, 15) + ".." : product.name}
          </Link>

          <span className="bg-orange-200 text-orange-900 text-sm font-semibold mr-2 px-2.5 py-0.5 
          rounded-full dark:bg-orange-600 dark:text-orange-200">
            Rp{new Intl.NumberFormat('id-ID').format(product.price)}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default SmallProduct;