import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full sm:w-[18rem] text-lg bg-neutral-800 rounded-lg text-gray-100 md:w-[18rem] 
    lg:w-[18rem] max-w-xs mx-auto p-3"
    >
      <div className="block relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-[40rem] h-[9rem] object-cover rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="mt-3 p-2 text-sm shadow-2xl bgneutra shadow-gray-500">
        <h2 className="flex justify-between items-center">
          <Link
            to={`/product/${product._id}`}
            className="hover:underline hover:underline-offset-2"
          >
            {product.name.length > 19 ? product.name.substring(0, 15) + ".." : product.name}
          </Link>

          <p className="text-orange-500 text-lg font-bold">
            Rp{new Intl.NumberFormat('id-ID').format(product.price)}
          </p>
        </h2>
      </div>
    </div>
  );
};

export default SmallProduct;