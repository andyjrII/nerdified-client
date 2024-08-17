import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';
import StarRating from '../components/StarRating';
import '../assets/styles/reviews.css';
import db from '../utils/localBase';
import Swal from 'sweetalert2';

const Reviews = ({ courseId }) => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail(); // Fetch and set email
        if (email) {
          await fetchReviews();
        }
      } catch (error) {
        console.log('Error during initialization:', error);
      }
    };

    initialize();
  }, [email]);

  const fetchEmail = async () => {
    const data = await db.collection('auth_student').get();
    setEmail(data[0].email);
  };

  const fetchReviews = async () => {
    try {
      const response = await axiosPrivate.get(`/reviews/course/${courseId}`);
      const emails = response.data.map((datum) => datum.student.email);
      await fetchImages(emails);
      setReviews(response.data);
    } catch (error) {
      console.log('Error fetching reviews');
    }
  };

  const handleReviewSubmit = async () => {
    if (!email) {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'You must be signed in first to make a review!',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (newReview.rating === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Star Rating',
        text: 'Please select a star rating!',
        confirmButtonText: 'OK',
      });
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
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error submitting review!',
        confirmButtonText: 'OK',
      });
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
      console.log('Error getting images');
      return [];
    }
  };

  return (
    <div className='reviews-container mt-2'>
      <p className='h2'>
        <span className='badge bg-danger'>Reviews</span>
      </p>
      {reviews ? (
        reviews.map((review) => (
          <div key={review.id} className='review-item row'>
            <div className='col-md-2 py-3 mx-2 d-flex shadow rounded-2'>
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={review.student.name}
                  className='review-student-image align-self-center mr-2'
                />
              ))}
              <div className=' align-self-center'>
                <h6 className='text-wrap'>{review.student.name}</h6>
                <span className='d-flex'>
                  <StarRating rating={review.rating} />
                </span>
              </div>
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
          <span className='d-flex'>
            <StarRating
              rating={newReview.rating}
              setRating={(rating) => setNewReview({ ...newReview, rating })}
              editable
            />
          </span>
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
