"use client";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  editable?: boolean;
}

const roundToHalf = (num: number): number => {
  return Math.round(num * 2) / 2;
};

const StarRating = ({ rating, setRating, editable = false }: StarRatingProps) => {
  const roundedRating = roundToHalf(rating);

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(
        <span
          key={i}
          onClick={() => editable && setRating && setRating(i)}
          className={editable ? "cursor-pointer" : ""}
        >
          <FaStar
            className="text-yellow-400"
            style={{ cursor: editable ? "pointer" : "default" }}
          />
        </span>
      );
    } else if (
      i === Math.ceil(roundedRating) &&
      !Number.isInteger(roundedRating)
    ) {
      stars.push(
        <span
          key={i}
          onClick={() => editable && setRating && setRating(i - 0.5)}
          className={editable ? "cursor-pointer" : ""}
        >
          <FaStarHalfAlt
            className="text-yellow-400"
            style={{ cursor: editable ? "pointer" : "default" }}
          />
        </span>
      );
    } else {
      stars.push(
        <span
          key={i}
          onClick={() => editable && setRating && setRating(i)}
          className={editable ? "cursor-pointer" : ""}
        >
          <FaRegStar
            className="text-gray-300"
            style={{ cursor: editable ? "pointer" : "default" }}
          />
        </span>
      );
    }
  }

  return <div className="flex items-center space-x-1">{stars}</div>;
};

export default StarRating;
