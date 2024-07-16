import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';
import StarRating from '../components/StarRating';
import '../assets/styles/reviews.css';

const Reviews = ({ courseId }) => {
  const axiosPrivate = useAxiosPrivate();
  const studentId = parseInt(localStorage.getItem('STUDENT_ID'));
  const accessToken = localStorage.getItem('ACCESS_TOKEN');
  const email = localStorage.getItem('STUDENT_EMAIL');

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [imagePath, setImagePath] = useState('');

  const fetchReviews = async () => {
    try {
      const response = await axiosPrivate.get(`/reviews/course/${courseId}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      console.log(response.data);
      await fetchImage();
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
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
      const response = fetchReviews();
      setReviews(response.data);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axiosPrivate.get(`students/image/${email}`, {
        responseType: 'arraybuffer', // Set the response type to 'arraybuffer'
      });
      const imageBlob = new Blob([response.data], { type: 'image/jpeg' }); // Create a Blob from the binary data
      const imageUrl = URL.createObjectURL(imageBlob); // Create a temporary URL for the image
      setImagePath(imageUrl);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='reviews-container mt-3'>
      <p className='h2 mb-4'>
        <span className='badge bg-danger'>Reviews</span>
      </p>
      {reviews ? (
        reviews.map((review) => (
          <div key={review.id} className='review-item row'>
            <div className='col-md-2 text-center py-3 mx-2 shadow rounded-2'>
              <img
                src={imagePath}
                alt={review.student.name}
                className='review-student-image'
              />
              <h5>{review.student.name}</h5>
              <StarRating rating={review.rating} />
            </div>
            <div className='review-content col-md-6 py-3 mx-2 shadow rounded-2'>
              <small className='text-muted'>
                <Moment format='MMMM D, YYYY'>{review.createdAt}</Moment>
              </small>
              <p className='mt-3'>{review.comment}</p>
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
