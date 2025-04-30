"use client";
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
}

const StarRating = ({
  rating,
  onRatingChange,
  maxRating = 5,
}: StarRatingProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  // Get active rating (hovered or selected)
  const activeRating = hoveredRating || rating;

  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isActiveHalf =
          activeRating >= starValue - 0.5 && activeRating < starValue;
        const isActiveFull = activeRating >= starValue;

        return (
          <div key={starValue} className="relative mx-1">
            {/* Star background */}
            <Star className="w-5 h-5 text-gray-500" />

            {/* Half star overlay */}
            {(isActiveHalf || isActiveFull) && (
              <div
                className={`absolute top-0 left-0 overflow-hidden ${
                  isActiveHalf ? "w-1/2" : "w-full"
                }`}
              >
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
            )}

            {/* Left half click area (0.5) */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full cursor-pointer"
              onClick={() => onRatingChange(starValue - 0.5)}
              onMouseEnter={() => setHoveredRating(starValue - 0.5)}
              onMouseLeave={() => setHoveredRating(0)}
              aria-label={`Rate ${starValue - 0.5} out of ${maxRating}`}
            />

            {/* Right half click area (1.0) */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full cursor-pointer"
              onClick={() => onRatingChange(starValue)}
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(0)}
              aria-label={`Rate ${starValue} out of ${maxRating}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
