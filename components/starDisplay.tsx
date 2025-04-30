"use client";
import { Star } from "lucide-react";

interface StarDisplayProps {
  rating: number; // supports half ratings like 3.5
  maxRating?: number;
}

const StarDisplay = ({ rating, maxRating = 5 }: StarDisplayProps) => {
  return (
    <div className="flex items-center mt-2">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;

        const isFull = rating >= starValue;
        const isHalf = rating >= starValue - 0.5 && rating < starValue;

        return (
          <div key={starValue} className="relative mx-1">
            {/* Background star (empty) */}
            <Star className="w-4 h-4 text-gray-300" />

            {/* Full or Half overlay */}
            {(isFull || isHalf) && (
              <div
                className={`absolute top-0 left-0 overflow-hidden ${
                  isHalf ? "w-1/2" : "w-full"
                }`}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarDisplay;
