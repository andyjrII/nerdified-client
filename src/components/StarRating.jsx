import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating, editable = false }) => {
  const roundedRating = roundToHalf(rating);

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(
        <span key={i} onClick={() => editable && setRating(i)}>
          <FaStar
            style={{ color: 'gold', cursor: editable ? 'pointer' : 'default' }}
          />
        </span>
      );
    } else if (
      i === Math.ceil(roundedRating) &&
      !Number.isInteger(roundedRating)
    ) {
      stars.push(
        <span key={i} onClick={() => editable && setRating(i - 0.5)}>
          <FaStarHalfAlt
            style={{ color: 'gold', cursor: editable ? 'pointer' : 'default' }}
          />
        </span>
      );
    } else {
      stars.push(
        <span key={i} onClick={() => editable && setRating(i)}>
          <FaRegStar
            style={{ color: 'grey', cursor: editable ? 'pointer' : 'default' }}
          />
        </span>
      );
    }
  }

  return <>{stars}</>;
};

// Helper function to round to the nearest 0.5
const roundToHalf = (num) => {
  return Math.round(num * 2) / 2;
};

export default StarRating;
