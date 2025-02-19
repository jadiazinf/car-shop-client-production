import { useState } from "react";

type RatingProps = {
  maxRating?: number;
  rating?: number;
  onRatingChange?: (rating: number) => void;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
  "2xl": "text-5xl",
};

function RatingComponent({
  maxRating = 5,
  rating: initialRating = 0,
  onRatingChange,
  isDisabled = false,
  size = "md",
}: RatingProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleClick = (index: number) => {
    if (!isDisabled) {
      setRating(index);
      if (onRatingChange) {
        onRatingChange(index);
      }
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!isDisabled) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isDisabled) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            className={`${sizeClasses[size]} cursor-pointer ${
              ratingValue <= (hoverRating || rating)
                ? "text-yellow-500"
                : "text-gray-400"
            } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => handleMouseEnter(ratingValue)}
            onMouseLeave={handleMouseLeave}
            disabled={isDisabled}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default RatingComponent;
