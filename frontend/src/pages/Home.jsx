import { Link, useParams } from "react-router-dom"
import { useGetProductsQuery } from "../redux/api/productApiSlice"
import { useMemo } from "react"
import Loader from "../components/loader"
import Header from "../components/Header"
import Message from "../components/Message"
import Product from "./Products/Product"
import logo from '../assets/1-removebg-preview.png'
import ProductCarousel from "./Products/ProductCarousel"
import Footer from "../footer"

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  const shuffledProducts = useMemo(() => {
    if (data?.products) {
      return [...data.products].sort(() => Math.random() - 0.5);
    }
    return [];
  }, [data]);

  return (
    <>
      {/* Header with Logo & Navigation Menu */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#0f0f10] top-0 z-50 ml-[4rem]">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="w-40 h-40 object-contain"
            />
          </Link>

          {/* Product Carousel */}
          <div className="absolute left-[53rem] w-full top-[4rem]">
            <ProductCarousel />
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/shop" className="text-lg font-semibold hover:text-orange-600">
              All Products
            </Link>
            <Link to="/about" className="text-lg font-semibold hover:text-orange-600">
              About Us
            </Link>
          </nav>
        </div>
      </div>

      {/* Our New Releases Section */}
      <div className="ml-[21rem] mt-4">
        <h1 className="text-xl font-semibold">Our New Releases</h1>
      </div>

      {/* Header for Filter/Small Product */}
      {!keyword ? <Header /> : null}

      {/* Handle Loading & Error */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          {/* Special Products Section */}
          <div className="flex flex-col items-center sm:flex-row sm:justify-between sticky top-0 z-40 bg-[#0f0f10] py-4 px-6">
            <h1 className="text-[3rem] ml-[17rem]">Special Products</h1>
            <Link
              to="/shop"
              className="bg-orange-600 font-bold rounded-full py-3 px-10 sm:mt-8 mr-[20rem]"
            >
              Shop
            </Link>
          </div>

          {/* Products Grid */}
          <div className="flex justify-center flex-wrap mt-[5rem] px-6">
            {shuffledProducts.map((product) => (
              <div key={product._id}>
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;