import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';
import StarRating from '../components/StarRating';
import '../assets/styles/reviews.css';

const Reviews = ({ courseId }) => {
  const axiosPrivate = useAxiosPrivate();
  const email = localStorage.getItem('STUDENT_EMAIL');
  const accessToken = localStorage.getItem('ACCESS_TOKEN');

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [imageUrls, setImageUrls] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axiosPrivate.get(`/reviews/course/${courseId}`);
      const emails = response.data.map((datum) => datum.student.email);
      await fetchImages(emails);
      setReviews(response.data);
    } catch (error) {
      alert('Error fetching reviews');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewSubmit = async () => {
    if (!accessToken || !email) {
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
        { courseId, email, ...newReview },
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
      alert('Error submitting review');
    }
  };

  const fetchImages = async (emails) => {
    try {
      const response = await axiosPrivate.post(`students/imagepaths`, emails);
      const imagePaths = response.data;
      const imageBlobs = await Promise.all(
        imagePaths.map(async (imagePath) => {
          const imageResponse = await axiosPrivate.get(
            `students/student/image/${imagePath}`,
            {
              responseType: 'arraybuffer',
            }
          );
          return new Blob([imageResponse.data], { type: 'image/jpeg' });
        })
      );
      const images = imageBlobs.map((imageBlob) =>
        URL.createObjectURL(imageBlob)
      );
      setImageUrls(images);
    } catch (error) {
      console.error('Error:', error);
      return [];
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
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={review.student.name}
                  className='review-student-image'
                />
              ))}
              <h6>{review.student.name}</h6>
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
