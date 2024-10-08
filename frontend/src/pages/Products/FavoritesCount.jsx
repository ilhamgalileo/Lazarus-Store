import { useSelector } from "react-redux"

const FavoritesCount = () => {
  const favorites = useSelector(state => state.favorites)
  const favoriteCount = favorites.length
    return (
    <div className="absolute left-7 top-8">
        {favoriteCount > 0 && (
            <span className="px-1 py-0 text-sm text-white bg-orange-500 rounded-full">
                {favoriteCount}
            </span>
        )}
    </div>
  )
}

export default FavoritesCount