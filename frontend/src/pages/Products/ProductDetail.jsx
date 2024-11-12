import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../../redux/api/productApiSlice";
import Loader from "../../components/loader";
import Message from "../../components/Message";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore, FaMinus, FaPlus } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetail = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [activeTab, setActiveTab] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null)

    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
    const { userInfo } = useSelector((state) => state.auth);
    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

    if (product && !mainImage) {
        setMainImage(product.images?.[0])
        setSelectedImage(product.images?.[0])
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap()
            refetch()
            setActiveTab(2)
            toast.success("Review created successfully")
        } catch (error) {
            toast.error(error?.data || error.message)
        }
    }

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    }

    return (
        <>
            <div>
                <Link
                    to='/'
                    className="text-white font-semibold hover:underline ml-[10rem]">
                    Go Back
                </Link>
            </div>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.message}</Message>
            ) : (
                <>
                    <div className="flex justify-between mt-[2rem] ml-[10rem]">
                        {/* Gambar dan Thumbnail */}
                        <div className="flex flex-col w-[50%]">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
                            />
                            <HeartIcon product={product} />

                            <div className="flex mt-4 space-x-2">
                                {product.images?.map((imgSrc, index) => (
                                    <img
                                        key={index}
                                        src={imgSrc}
                                        alt={`${product.name} thumbnail ${index + 1}`}
                                        className={`w-20 h-20 border border-gray-300 rounded cursor-pointer ${selectedImage === imgSrc ? 'border-4 border-orange-600' : ''}`}
                                        onClick={() => {
                                            setMainImage(imgSrc);
                                            setSelectedImage(imgSrc);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col justify-between w-[50%] ml-8">
                            <h2 className="text-5xl font-semibold mb-4">{product.name}</h2>
                            <p className="text-5xl font-extrabold text-orange-500 mb-6">
                                RP. {isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(product.price)}
                            </p>
                            <p className="text-lg text-[#B0B0B0] mb-6 xl:w-[35rem] lg:w-[35rem] md:w-[30rem]">
                                {product.description}
                            </p>
                            <div className="flex flex-wrap mb-6 space-x-4">
                                <div className="w-full sm:w-[48%] lg:w-[48%]">
                                    <h1 className="flex items-center mb-4 text-lg">
                                        <FaStore className="mr-2 text-white" /> Brand: {product.brand}
                                    </h1>
                                    <h1 className="flex items-center mb-4 text-lg">
                                        <FaClock className="mr-2 text-white" /> Added: {moment(product.createdAt).format('DD MMMM YYYY')}
                                    </h1>
                                    <h1 className="flex items-center mb-4 text-lg">
                                        <FaStore className="mr-2 text-white" /> Reviews: {product.numReviews}
                                    </h1>
                                </div>
                                <div className="w-full sm:w-[48%] lg:w-[48%]">
                                    <h1 className="flex items-center mb-4 text-lg">
                                        <FaStar className="mr-2 text-white" /> Ratings: {product.rating}
                                    </h1>
                                    <h1 className="flex items-center mb-4 text-lg">
                                        <FaShoppingCart className="mr-2 text-white" /> Quantity: {product.quantity}
                                    </h1>
                                    <h1 className="flex items-center mb-4 text-lg">
                                        <FaBox className="mr-2 text-white" /> Count In Stock: {product.countInStock}
                                    </h1>
                                </div>
                            </div>

                            <div className="flex justify-between flex-wrap mb-6">
                                <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
                                {product.countInStock > 0 && (
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                                            className="bg-[#0f0f10] text-white px-4 py-2 rounded-l-lg"
                                        >
                                            <FaMinus />
                                        </button>
                                        <div className="bg-[#0f0f10] text-white text-center px-4 py-2">
                                            {qty}
                                        </div>
                                        <button
                                            onClick={() => setQty(qty < product.countInStock ? qty + 1 : qty)}
                                            className="bg-[#0f0f10] text-white px-4 py-2 rounded-r-lg"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="btn-container">
                                <button
                                    onClick={addToCartHandler}
                                    disabled={product.countInStock === 0}
                                    className="bg-orange-600 text-white py-2 px-4 rounded-lg"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        <div
                            className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]"
                        >
                            <ProductTabs
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                loadingProductReview={loadingProductReview}
                                userInfo={userInfo}
                                submitHandler={submitHandler}
                                rating={rating}
                                setRating={setRating}
                                comment={comment}
                                setComment={setComment}
                                product={product}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ProductDetail