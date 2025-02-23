import { Link } from "react-router-dom"
import moment from "moment"
import { useAllProductsQuery } from "../../redux/api/productApiSlice"
import AdminMenu from "./AdminMenu"
import Loader from "../../components/loader"

const AllProducts = () => {
    const { data: products, isLoading, isError } = useAllProductsQuery()

    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return <div>Error loading products</div>
    }
    return (
        <>
            <div className="container mx-[9rem]">
                <div className="flex flex-col md:flex-row mr-[5rem]">
                    <div className="p-3">
                        <div className="ml-[2rem] text-xl font-bold h-12 text-gray-950">
                            All Products ({products.length})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="border rounded-lg shadow-lg p-4 mb-4 overflow-hidden bg-neutral-700"
                                >
                                    <div className="flex">
                                        <img
                                            src={ product?.images?.[0] }
                                            alt={product.name}
                                            className="w-[5rem] h-[5rem] object-cover mr-4"
                                        />
                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <h5 className="text-xl font-semibold mb-1">
                                                    {product?.name}
                                                </h5>
                                                <p className="text-gray-400 text-sm">
                                                    {moment(product.createAt).format("MMMM Do YYYY")}
                                                </p>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-4">
                                                {product?.description?.substring(0, 160)}...
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <Link
                                                    to={`/admin/product/update/${product._id}`}
                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                                                >
                                                    Update Product
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
                                                <p>Rp {new Intl.NumberFormat('id-ID').format(product?.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/4 p-3 mt-2">
                        <AdminMenu />
                    </div>
                </div>
            </div>
        </>
    )
}
export default AllProducts
