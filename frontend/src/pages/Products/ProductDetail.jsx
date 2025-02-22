import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState, useEffect, useMemo } from "react";
import { useGetProductDetailsQuery, useCreateReviewMutation, useGetProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/loader";
import Message from "../../components/Message";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import Product from "./Product";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetail = () => {
    const { id: productId, keyword } = useParams();
    const { data } = useGetProductsQuery({ keyword });
    const shuffledProducts = useMemo(() => data?.products ? [...data.products].sort(() => Math.random() - 0.5) : [], [data]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [activeTab, setActiveTab] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
    const { userInfo } = useSelector((state) => state.auth);
    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

    useEffect(() => {
        if (product && !mainImage) {
            setMainImage(product.images?.[0])
            setSelectedImage(product.images?.[0])
        }
    }, [product, mainImage]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({ productId, rating, comment }).unwrap();
            refetch();
            toast.success("Review created successfully");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to create review");
        }
    };

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    return (
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-6">
                <Link to="/" className="text-black font-semibold hover:underline">Go Back</Link>
            </div>

            {isLoading ? <Loader /> : error ? <Message variant="danger">{error?.data?.message || error.message}</Message> : (
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-1/2">
                        <div className="relative">
                            <img src={mainImage} alt={product.name}
                                width="640" height="600"
                                className="w-full max-w-[40rem] h-auto max-h-[39rem] rounded-lg object-cover" />
                        </div>
                        <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
                            {product.images?.map((imgSrc, index) => (
                                <img key={index} src={imgSrc} alt={`${product.name} thumbnail ${index + 1}`}
                                    className={`w-16 h-16 rounded-md cursor-pointer transition-all object-cover ${selectedImage === imgSrc ? 'border-2 border-orange-500' : 'border border-gr'}`}
                                    onClick={() => { setMainImage(imgSrc); setSelectedImage(imgSrc); }} />
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 space-y-6">
                        <h1 className="text-2xl font-bold text-gray-950">{product.name}</h1>
                        <p className="text-3xl font-extrabold text-orange-500">Rp{new Intl.NumberFormat('id-ID').format(product.price)}</p>
                        <p className="text-gray-800 text-sm">{product.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm space-y-2 text-black">
                                <p className="flex items-center gap-2"><FaStore className="text-orange-600" /> Brand: {product.brand}</p>
                                <p className="flex items-center gap-2"><FaClock className="text-orange-600" /> Sold: {product.sold}</p>
                                <p className="flex items-center gap-2"><FaStar className="text-orange-600" /> Reviews: {product.numReviews}</p>
                            </div>
                            <div className="text-sm space-y-2 text-black">
                                <p className="flex items-center gap-2"><FaStar className="text-orange-500" /> Rating: {product.rating}</p>
                                <p className="flex items-center gap-2"><FaShoppingCart className="text-orange-500" /> Quantity: {product.quantity}</p>
                                <p className="flex items-center gap-2"><FaBox className="text-orange-500" /> Stock: {product.countInStock}</p>
                            </div>
                        </div>
                        <button onClick={addToCartHandler} disabled={product.countInStock === 0}
                            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <div className="bg-neutral-700 rounded-lg p-6">
                            <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} loadingProductReview={loadingProductReview}
                                userInfo={userInfo} submitHandler={submitHandler} rating={rating} setRating={setRating}
                                comment={comment} setComment={setComment} product={product} />
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-[2.5rem]">
                <h2 className="text-2xl sticky text-gray-950 bg-[#f0f0ef] py-4 px-6 top-0 z-40 font-bold mb-8 text-center">Recommended Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 px-4">
                    {shuffledProducts.slice(0, 6).map((product) => (
                        <div key={product._id} className="w-full"><Product product={product} /></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail