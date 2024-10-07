import { useGetTopProductsQuery } from "../../redux/api/productApiSlice"
import Message from "../../components/Message"
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import moment from "moment"
import {
    FaBox,
    FaClock,
    FaShoppingCart,
    FaStar,
    FaStore,
} from "react-icons/fa"

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetTopProductsQuery()
    console.log(products)
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: true,
        arrows: true,
        autoplay: true,
        autoplayspeed: 3000,
    }

    return (
        <div className="mb-4 lg:block xl:block md:block">
            {isLoading ? null : error ? (
                <Message variant='danger' >
                    {error?.data?.message || error.message}
                </Message>
            ) : <Slider
                {...settings}
                className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
            >
                {
                    products.map(({ image, _id, name, price, description, brand, createAt, numReviews,
                        rating, quantity, countInStock }) => (
                        <div key={_id}>
                            <img
                                src={image}
                                alt={name}
                                className="w-full rounded-lg object-cover h-[30rem]"
                            />

                            <div className="flex justify-between w-[20rem]">
                                <div className="one">
                                    <h2>{name}</h2>
                                    <p>${price}</p> <br /> <br />
                                    <p className="w-[25rem]">
                                        {description}
                                    </p>
                                </div>
                                <div className="flex justify-between gap-8 w-[20rem]">
                                    <div className="one gap-6 flex flex-col">
                                        <h1 className="flex items-center">
                                            <FaStore className="mr-2 text-white text-2xl" /> Brand: {brand}
                                        </h1>
                                        <h1 className="flex items-center">
                                            <FaClock className="mr-2 text-white text-2xl" /> Added: {" "}
                                            {moment(createAt).format('DD MMMM')}
                                        </h1>
                                        <h1 className="flex items-center">
                                            <FaStar className="mr-2 text-white text-2xl" /> Reviews: {" "}
                                            {numReviews}
                                        </h1>
                                    </div>

                                    <div className="two gap-6 flex flex-col">
                                        <div className="flex items-center w-[20rem]">
                                            <FaStar className="mr-2 text-white text-2xl" /> Ratings:{" "} {Math.round(rating)}
                                        </div>
                                        <div className="flex items-center w-[20rem]">
                                            <FaShoppingCart className="mr-2 text-white text-2xl" /> Quantity:{" "} {quantity}
                                        </div>
                                        <div className="flex items-center w-[20rem]">
                                            <FaBox className="mr-2 text-white text-2xl" /> Stock:{" "} {countInStock}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </Slider>
            }
        </div>
    )
}

export default ProductCarousel
