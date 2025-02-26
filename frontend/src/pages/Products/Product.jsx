import HeartIcon from "./HeartIcon"
import React from "react"

const Product = React.memo(({ product }) => {
    return (
        <div className=" rounded-lg w-[25rem] ml-[3rem] p-3 relative bg-neutral-800 text-gray-100 shadow-xl hover:shadow-orange-500 mb-6">            <div className="relative overflow-hidden rounded">
            <section>
                <img
                    src={product?.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-[15rem] object-cover rounded cursor-pointer 
                    hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <HeartIcon product={product} />
            </section>
        </div>
            <div className="p-3 mt-6">
                <a href={`/product/${product._id}`}
                    className="hover:underline hover:underline-offset-2"
                >
                    <h2 className="flex justify-between items-center">
                        <div className="text-lg">{product.name.substring(0, 25)}</div>
                        <p className="text-orange-500 text-lg font-bold">
                            Rp{new Intl.NumberFormat('id-ID').format(product.price)}
                        </p>
                    </h2>
                </a>
            </div>
        </div >
    )
})

export default Product