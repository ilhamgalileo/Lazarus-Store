import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[6rem] h-auto p-1 text-xs bg-neutral-800 rounded-md text-gray-100 
      sm:w-[18rem] sm:text-sm sm:p-3 md:w-[18rem] lg:w-[18rem] max-w-xs mx-auto">
      
      <div className="block relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-[4rem] object-cover rounded 
            sm:h-[8rem]"
        />
        <HeartIcon product={product} />
      </div>

      <div className="mt-1 p-1 text-[10px] sm:mt-3 sm:p-2 sm:text-sm">
        <h2 className="flex justify-between items-center">
          <Link
            to={`/product/${product._id}`}
            className="hover:underline hover:underline-offset-1 sm:hover:underline-offset-2"
          >
            {product.name.length > 10 ? product.name.substring(0, 20) : product.name}
          </Link>

          <p className="text-orange-500 font-bold sm:text-lg">
            Rp{new Intl.NumberFormat('id-ID').format(product.price)}
          </p>
        </h2>
      </div>
    </div>
  );
};

export default SmallProduct;
