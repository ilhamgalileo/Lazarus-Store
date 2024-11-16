import { useSelector } from "react-redux"

const FavoritesCount = () => {
  const favorites = useSelector(state => state.favorites)
  const favoriteCount = favorites.length
  return (
    <div className="absolute left-4 top-10">
      {favoriteCount > 0 && (
        <span className="px-1 py-1 text-xs text-white bg-orange-500 rounded-full w-4 h-4 flex items-center justify-center">
          {favoriteCount}
        </span>
      )}
    </div>
  )
}

export default FavoritesCount