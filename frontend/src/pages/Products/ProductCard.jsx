import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";

const ProductCard = ({ p }) => {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useDispatch()

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
    toast.success("Item added successfully")
  };

  return (
    <div className="group relative bg-neutral-900 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      <div className="aspect-square overflow-hidden">
        <Link to={`/product/${p._id}`}>
          <img
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            src={isHovered && p?.images?.[1] ? p.images[1] : p?.images?.[0]}
            alt={p.name}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </Link>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-white truncate">
            {p?.name}
          </h3>
          <span className="block text-orange-500 font-semibold whitespace-nowrap">
            {p?.price?.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
          <p className="text-sm text-neutral-400 line-clamp-2">
            {p?.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors"
          >
            View Details
            <FaArrowRight className="w-3 h-3 ml-2" />
          </Link>

          <button
            onClick={() => addToCartHandler(p, 1)}
            disabled={p.countInStock === 0}
            className={`p-2 rounded-full ${
              p.countInStock === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
            } text-white transition-colors`}
          >
            <FaShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard