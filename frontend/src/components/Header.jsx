import ProductCarousel from "../pages/Products/ProductCarousel"
import SmallProduct from "../pages/Products/SmallProduct"
import { useGetNewProductsQuery } from "../redux/api/productApiSlice"
import Loader from "./loader"


const Header = () => {
    const { data, isLoading, error } = useGetNewProductsQuery()

    if (isLoading) {
        return <Loader />
    }

    if (error) {
        return <h1>Error</h1>
    }
    return <>
        <div className="flex ml-[10rem]">
            <div className="xl:block lg:hidden mf:hidden sm:hidden">
                <div className="grid grid-cols-2">
                    {data.map((product) => (
                        <div key={product._id}>
                            <SmallProduct product={product} />
                        </div>
                    ))}
                </div>
            </div>
                {/* <ProductCarousel/> */}
        </div>
    </>

}

export default Header