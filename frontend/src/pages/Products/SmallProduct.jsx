import { Link } from "react-router-dom"
import HeartIcon from "./HeartIcon"

const SmallProduct = ({ product }) => {
    return (
        <div className="w-[20rem] ml-[2rem] p-3">
            <Link to={`/product/${product._id}`} className="block relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[200px] object-cover rounded"
                />
                <HeartIcon product={product} />

                <div className="mt-2 p-2">
                    <h2 className="flex justify-between items-center">
                        <div>{product.name.substring(0, 19)}..</div>
                        <span className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300">
                            RP. {new Intl.NumberFormat('id-ID').format(product.price)}
                        </span>
                    </h2>
                </div>
            </Link>
        </div>
    )
}

export default SmallProduct
