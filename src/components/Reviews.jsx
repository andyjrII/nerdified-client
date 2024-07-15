import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';
import StarRating from '../components/StarRating';
import '../assets/styles/reviews.css';

const Reviews = ({ courseId }) => {
  const axiosPrivate = useAxiosPrivate();
  const studentId = parseInt(localStorage.getItem('STUDENT_ID'));
  const accessToken = localStorage.getItem('ACCESS_TOKEN');

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosPrivate.get(`/reviews/course/${courseId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [courseId]);

  const handleReviewSubmit = async () => {
    if (!accessToken || !studentId) {
      alert('You must be signed in to submit a review');
      return;
    }

    if (newReview.rating === 0) {
      alert('Please select a star rating');
      return;
    }

    try {
      await axiosPrivate.post(
        `/reviews`,
        { courseId, studentId, ...newReview },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setNewReview({ rating: 0, comment: '' });
      // Refresh reviews after submission
      const response = await axiosPrivate.get(`/reviews/course/${courseId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className='reviews-container mt-3'>
      <p className='h2'>
        <span className='badge bg-danger'>Reviews</span>
      </p>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className='review-item'>
            <img
              src={review.studentImage}
              alt={review.studentName}
              className='review-student-image'
            />
            <div className='review-content'>
              <h5>{review.studentName}</h5>
              <StarRating rating={review.rating} />
              <p>{review.comment}</p>
              <small className='text-muted'>
                <Moment format='MMMM D, YYYY'>{review.createdAt}</Moment>
              </small>
            </div>
          </div>
        ))
      ) : (
        <p>No reviews</p>
      )}

      <div className='new-review'>
        <h4>Leave a Review</h4>
        <p>
          Give us a rating:
          <StarRating
            rating={newReview.rating}
            setRating={(rating) => setNewReview({ ...newReview, rating })}
            size={25}
            editable
          />
        </p>
        <textarea
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          placeholder='Write your review here'
          rows='4'
          required
        ></textarea>
        <button
          onClick={handleReviewSubmit}
          className='btn mt-2'
          id='review-btn'
          type='submit'
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default Reviews;
