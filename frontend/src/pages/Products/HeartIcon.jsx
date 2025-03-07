import { useEffect } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useSelector, useDispatch } from "react-redux"
import { addToFavorites, removeFromfavorites, setFavorites } from "../../redux/features/favourites/favoriteSlice"
import { addFavoriteTolocalStorage, getFavoritesFromLocalStorage, removeFavoritesFromLocalStorage } from "../../Utils/localStorage"

const HeartIcon = ({ product }) => {
    const dispatch = useDispatch()
    const favorites = useSelector((state) => state.favorites) || []
    const isFavorite = favorites.some((p) => p._id === product._id)

    useEffect(() => {
        const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
        dispatch(setFavorites(favoritesFromLocalStorage));
    }, []);

    const toggleFavorites = () => {
        if (isFavorite) {
            dispatch(removeFromfavorites(product))
            removeFavoritesFromLocalStorage(product._id)
        } else {
            dispatch(addToFavorites(product))
            addFavoriteTolocalStorage(product)
        }
    }

    return (
        <div
            onClick={toggleFavorites}
            className="absolute top-2 right-2 cursor-pointer bg-neutral-400 rounded-full p-2 backdrop-blur-sm bg-opacity-50"
        >
            {isFavorite ? (
                <FaHeart className="text-orange-500 shadow-xl" />
            ) : (
                <FaRegHeart className="text-white" />
            )}
        </div>
    )
}

export default HeartIcon