import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const MenuRating = ({ rating }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (rating >= star)
          return <FaStar key={star} color="#fbbf24" size={14} />;
        if (rating >= star - 0.5)
          return <FaStarHalfAlt key={star} color="#fbbf24" size={14} />;
        return <FaRegStar key={star} color="#d1d5db" size={14} />;
      })}
    </div>
  );
};

export default MenuRating;
