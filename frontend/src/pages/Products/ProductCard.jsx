import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { FaShoppingCart, FaHeart, FaArrowRight } from "react-icons/fa";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully");
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
          <HeartIcon product={p}/>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-lg text-white truncate">
              {p?.name}
            </h3>
            <span className="text-orange-500 font-semibold whitespace-nowrap">
              {p?.price?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </span>
          </div>
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
            className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            <FaShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {p?.brand && (
          <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full bg-black/50 backdrop-blur-sm text-white">
            {p.brand}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;