import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaCommentDots
} from "react-icons/fa"

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery()

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="lg:block xl:block md:block mt-1">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="ml-1 xl:w-[40rem] lg:w-[40rem] md:w-[40rem] sm:w-[40rem] sm:block"
        >
          {products.map(
            ({
              _id,
              name,
              price,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              images,
              countInStock,
            }) => (
              <div key={_id}>
                <img
                  src={images[0]}
                  alt={name}
                  className="w-[59rem] h-[25rem] object-cover rounded-lg border-2 border-orange-500"
                />

                <div className="mt-[1rem] flex justify-between">
                  <div className="one text-xs">
                    <h2 className="font-medium text-xl">{name}</h2>
                    <p className="text-orange-500 text-lg font-bold">
                      Rp{isLoading ? "Loading..." : new Intl.NumberFormat('id-ID').format(price)}
                    </p>
                    <br />
                    <br />
                  </div>

                  <div className="flex justify-between w-[20rem]">
                    <div className="one text-sm">
                      <h1 className="flex items-center mb-6">
                        <FaStore className="mr-2 text-white" /> Brand: {brand}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaClock className="mr-2 text-white" /> Added:{" "}
                        {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaCommentDots className="mr-2 text-white" /> Reviews:{" "}
                        {numReviews}
                      </h1>
                    </div>

                    <div className="two text-sm">
                      <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2 text-white" /> Ratings:{" "}
                        {Math.round(rating)}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                        {quantity}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaBox className="mr-2 text-white" /> In Stock:{" "}
                        {countInStock}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
