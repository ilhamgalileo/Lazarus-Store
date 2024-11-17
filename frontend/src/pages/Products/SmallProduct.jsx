import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  const productImage = product.images && product.images.length > 0 ? product.images[0] : product.name

  return (
    <div className="w-full sm:w-[18rem] md:w-[18rem] lg:w-[18rem] max-w-xs mx-auto p-3">
      <Link to={`/product/${product._id}`} className="block relative">
        <img
          src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
          alt={product.name}
          className="w-[40rem] h-[9rem] object-cover rounded"
        />
        <HeartIcon product={product} />

        <div className="mt-2 p-2 text-xs">
          <h2 className="flex justify-between items-center">
            <div>{product.name.length > 19 ? product.name.substring(0, 15) + '..' : product.name}</div>
            <span className="bg-orange-100 text-orange-800 font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300">
              RP. {new Intl.NumberFormat('id-ID').format(product.price)}
            </span>
          </h2>
        </div>
      </Link>
    </div>
  )
}

export default SmallProduct