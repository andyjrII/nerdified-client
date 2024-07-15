import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  const roundedRating = roundToHalf(rating);

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<FaStar key={i} style={{ color: 'gold' }} />);
    } else if (
      i === Math.ceil(roundedRating) &&
      !Number.isInteger(roundedRating)
    ) {
      stars.push(<FaStarHalfAlt key={i} style={{ color: 'gold' }} />);
    } else {
      stars.push(<FaRegStar key={i} style={{ color: 'grey' }} />);
    }
  }

  return <div>{stars}</div>;
};

// Helper function to round to the nearest 0.5
const roundToHalf = (num) => {
  return Math.round(num * 2) / 2;
};

export default StarRating;
