import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/loader";

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
    setActiveTab,
}) => {

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    return (
        <div className="bg-[#f0f0ef] rounded-lg p-4">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-18">
                    <div
                        className={`p-3 cursor-pointer text-sm mb-2 rounded-lg transition-colors ${activeTab === 1
                            ? "bg-orange-600 text-white font-bold"
                            : "bg-white text-gray-800 hover:bg-orange-100"
                            }`}
                        onClick={() => handleTabClick(1)}
                    >
                        All Reviews
                    </div>
                    <div
                        className={`p-3 cursor-pointer text-sm mb-2 rounded-lg transition-colors ${activeTab === 2
                            ? "bg-orange-600 text-white font-bold"
                            : "bg-white text-gray-800 hover:bg-orange-100"
                            }`}
                        onClick={() => handleTabClick(2)}
                    >
                        Write Review
                    </div>

                </div>
                <div className="flex-1">
                    {activeTab === 1 && (
                        <div className="space-y-4">
                            {product.reviews.length === 0 ? (
                                <p className="text-gray-600 italic">No reviews yet</p>
                            ) : (
                                product.reviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="bg-neutral-700 p-4 rounded-lg shadow-sm"
                                    >
                                        <div className="flex justify-between mb-2 text-sm">
                                            <strong className="text-white">{review.name}</strong>
                                            <p className="text-white">
                                                {review.createdAt
                                                    ? new Date(review.createdAt).toLocaleDateString()
                                                    : ""}
                                            </p>
                                        </div>
                                        <div className="flex items-center mb-3">
                                            <Ratings value={review.rating || 0} />
                                        </div>
                                        <p className="text-white text-sm">
                                            {review.comment || "No comment provided"}
                                        </p>
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
                                        <label htmlFor="rating" className="block text-lg mb-2 text-gray-800">
                                            Rating
                                        </label>
                                        <select
                                            id="rating"
                                            required
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                            className="w-[10rem] p-2 text-sm rounded-lg bg-neutral-700 border border-gray-300 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                                        >
                                            <option value="">Select Rating</option>
                                            <option value="1">⭐</option>
                                            <option value="2">⭐⭐</option>
                                            <option value="3">⭐⭐⭐</option>
                                            <option value="4">⭐⭐⭐⭐</option>
                                            <option value="5">⭐⭐⭐⭐⭐</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="comment" className="block text-sm mb-2 text-gray-800">
                                            Comment
                                        </label>
                                        <textarea
                                            id="comment"
                                            rows="4"
                                            required
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full p-2 text-sm rounded-lg bg-neutral-700 text-white border border-gray-300 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loadingProductReview}
                                        className="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400"
                                    >
                                        Submit Review
                                    </button>
                                </form>
                            ) : (
                                <p className="text-center py-4 text-gray-800">
                                    Please{" "}
                                    <Link to="/login" className="text-orange-600 hover:underline">
                                        sign in
                                    </Link>{" "}
                                    to write a review
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductTabs;