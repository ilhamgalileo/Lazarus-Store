import { Link } from "react-router-dom"
import Ratings from "./Ratings"
import SmallProduct from "./SmallProduct"
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice"
import Loader from "../../components/loader"

const ProductTabs = ({
    loadingProductReview,
    userInfo,
    submitHandler,
    rating,
    setRating,
    comment,
    setComment,
    product,
    activeTab,
    setActiveTab
}) => {
    const { data, isLoading } = useGetTopProductsQuery();

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    return (
        <div className="bg-[#1A1A1A] rounded-lg p-2">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-18">
                    <div
                        className={`p-3 cursor-pointer text-sm mb-2 rounded-lg transition-colors ${
                            activeTab === 1 ? "bg-orange-600 text-white font-bold" : "hover:bg-gray-800"
                        }`}
                        onClick={() => handleTabClick(1)}
                    >
                        All Reviews
                    </div>
                    <div
                        className={`p-3 cursor-pointer text-sm mb-2 rounded-lg transition-colors ${
                            activeTab === 2 ? "bg-orange-600 text-white font-bold" : "hover:bg-gray-800"
                        }`}
                        onClick={() => handleTabClick(2)}
                    >
                        Write Review
                    </div>
                    <div
                        className={`p-3 cursor-pointer text-sm mb-2 rounded-lg transition-colors ${
                            activeTab === 3 ? "bg-orange-600 text-white font-bold" : "hover:bg-gray-800"
                        }`}
                        onClick={() => handleTabClick(3)}
                    >
                        Related Product
                    </div>
                </div>

                <div className="flex-1">
                    {activeTab === 1 && (
                        <div className="space-y-4">
                            {product.reviews.length === 0 ? (
                                <p className="text-gray-400 italic">No reviews yet</p>
                            ) : (
                                product.reviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="bg-gray-900 p-4 rounded-lg"
                                    >
                                        <div className="flex justify-between mb-2 text-sm">
                                            <strong className="text-[#B0B0B0]">{review.name}</strong>
                                            <p className="text-[#B0B0B0]">
                                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                            </p>
                                        </div>
                                        <div className="flex items-center mb-3">
                                            <Ratings value={review.rating || 0} />
                                        </div>
                                        <p className="text-gray-300 text-xs">{review.comment || "No comment provided"}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div>
                            {userInfo ? (
                                <form onSubmit={submitHandler} className="space-y-4">
                                    <div>
                                        <label htmlFor="rating" className="block text-lg mb-2">
                                            Rating
                                        </label>
                                        <select
                                            id="rating"
                                            required
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                            className="w-[10rem] p-1 text-sm rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                        >
                                            <option value="">Select Rating</option>
                                            <option value="1">WTF ⭐</option>
                                            <option value="2">Skibidi ⭐⭐</option>
                                            <option value="3">Mid ⭐⭐⭐</option>
                                            <option value="4">Well ⭐⭐⭐⭐</option>
                                            <option value="5">Sigma ⭐⭐⭐⭐⭐</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="comment" className="block text-sm mb-2">
                                            Comment
                                        </label>
                                        <textarea
                                            id="comment"
                                            rows="4"
                                            required
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full text-white p-1 text-sm rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loadingProductReview}
                                        className="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-600"
                                    >
                                        Submit Review
                                    </button>
                                </form>
                            ) : (
                                <p className="text-center py-4">
                                    Please <Link to="/login" className="text-orange-500 hover:underline">sign in</Link> to write a review
                                </p>
                            )}
                        </div>
                    )}
                    {activeTab === 3 && (
                        <div className=" md:grid-cols-1 gap-2">
                            {isLoading ? (
                                <Loader />
                            ) : (
                                data?.map((product) => (
                                    <div key={product._id} className="bg-gray-900 rounded-lg overflow-hidden">
                                        <SmallProduct product={product} />
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductTabs;