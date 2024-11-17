import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color = '#f8e825' }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center text-sm">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} style={{ color }} className="ml-1" />
      ))}

      {halfStars === 1 && <FaStarHalfAlt style={{ color }} className="ml-1" />}
      {[...Array(emptyStar)].map((_, index) => (
        <FaRegStar key={index} style={{ color }} className="ml-1"/>
      ))}

      <span className="rating-text ml-2" style={{ color }}>
        {text && text}
      </span>
    </div>
  )
}

export default Ratings;
