import { Link, useParams } from "react-router-dom"
import { useGetProductsQuery } from "../redux/api/productApiSlice"
import { useMemo } from "react" // Import useMemo
import Loader from "../components/loader"
import Header from "../components/Header"
import Message from "../components/Message"
import Product from "./Products/Product"

const Home = () => {
  const { keyword } = useParams()
  const { data, isLoading, isError } = useGetProductsQuery({ keyword })

  const shuffledProducts = useMemo(() => {
    if (data?.products) {
      return [...data.products].sort(() => Math.random() - 0.5)
    }
    return []
  }, [data])

  return (
    <>
    <div className="flex justify-between items-center">
            <h1 className="ml-[22rem] mt-[0rem] text-[2rem] font-semibold">
              Our New Releases
            </h1>
      </div>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[7rem] text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-orange-600 font-bold rounded-full py-2 px-10 mr-[20rem] mt-[7rem]"
            >
              Shop
            </Link>
          </div>
          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {shuffledProducts.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Home
