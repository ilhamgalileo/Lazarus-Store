import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
    toast.success("Item added successfully")
  }

  return (
    <div className="max-w-sm h-full relative bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-orange-100 text-orange-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300">
            {p?.brand}
          </span>
          <div className="overflow-hidden rounded-t-lg">
            {p?.images && p.images.length > 0 ? (
              <img
                className="cursor-pointer w-full hover:scale-105 transition-transform duration-300 ease-in-out"
                src={isHovered ? p.images[1] : p.images[0]} // Gambar berubah saat hover
                alt={p.name}
                style={{ height: "230px", objectFit: "cover" }}
                onMouseEnter={() => setIsHovered(true)}  // Ketika hover
                onMouseLeave={() => setIsHovered(false)}  // Ketika keluar hover
              />
            ) : (
              <img
                className="cursor-pointer w-full hover:scale-105 transition-transform duration-300 ease-in-out"
                src="/images/default-image.jpg" // Gambar fallback jika tidak ada gambar produk
                alt="Product image"
                style={{ height: "230px", objectFit: "cover" }}
              />
            )}
          </div>
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5 h-[250px] flex flex-col justify-between">
        <div>
          <div className="flex justify-between">
            <h5 className="mb-2 text-xl text-white dark:text-white">
              {p?.name?.length > 25 ? p.name.substring(0, 25) + "..." : p.name}
            </h5>
            <p className="font-semibold text-orange-500 text-lg">
              {p?.price?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </p>
          </div>
          <p className="mb-3 font-normal text-[#CFCFCF]">
            {p?.description?.length > 125 ? p.description.substring(0, 125) + "..." : p.description}
          </p>
        </div>

        <section className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
