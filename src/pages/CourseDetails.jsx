import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../assets/styles/navpages.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import db from '../utils/localBase';
import Moment from 'react-moment';
import { FaClock, FaMoneyBill, FaStar, FaHeart } from 'react-icons/fa';
import Missing from './Missing';
import StarRating from '../components/StarRating';
import Reviews from '../components/Reviews';
import PDFViewer from '../components/PDFViewer';
import Swal from 'sweetalert2';

const CourseDetails = () => {
  let { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState('');

  const course = JSON.parse(localStorage.getItem('NERDVILLE_COURSE'));
  if (course) {
    var courseId = course.id;
    var courseTitle = course.title;
  }
  id = courseId;

  const [courseEnrolled, setCourseEnrolled] = useState(null);

  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail(); // Fetch and set email
        if (email) {
          await isCourseEnrolled();
          await checkIfInWishlist();
        }
      } catch (error) {
        console.log('Error during initialization:', error);
      }
    };

    initialize();
  });

  const fetchEmail = async () => {
    const data = await db.collection('auth_student').get();
    setEmail(data[0].email);
  };

  const isCourseEnrolled = async () => {
    try {
      const response = await axiosPrivate.get(
        `students/course_enrolled/${id}`,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      setCourseEnrolled(response.data);
    } catch (error) {
      console.error('Error verifying if Course is Enrolled.');
    }
  };

  const checkIfInWishlist = async () => {
    try {
      const response = await axiosPrivate.get(`wishlist/email/${email}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const wishlistSet = new Set(response.data.map((item) => item.courseId));
      setIsInWishlist(wishlistSet.has(id));
    } catch (error) {
      console.log('Error fetching Wishlist!');
    }
  };

  const handleWishlistToggle = async () => {
    if (email) {
      try {
        if (isInWishlist) {
          await axiosPrivate.delete('/wishlist/remove', {
            data: { email, courseId: id },
          });
          Swal.fire({
            icon: 'success',
            title: 'Course Removed',
            text: 'Course has been successfully removed from wishlist!',
            confirmButtonText: 'OK',
          });
          setIsInWishlist(false);
        } else {
          await axiosPrivate.post(
            '/wishlist/add',
            JSON.stringify({
              email,
              courseid: id,
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }
          );
          Swal.fire({
            icon: 'success',
            title: 'Course Added',
            text: 'Course has been successfully added to wishlist!',
            confirmButtonText: 'OK',
          });
          setIsInWishlist(true);
        }
      } catch (error) {
        console.log('Error toggling Wishlist!');
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'You must be signed in first!',
        confirmButtonText: 'Ok',
      });
    }
  };

  return (
    <>
      {course ? (
        <main>
          <header className='py-3 bg-light border-bottom mb-4 header-bg'>
            <div className='container'>
              <div className='text-center my-3'>
                <p className='h1'>
                  <span className='badge bg-danger'>{courseTitle}</span>
                </p>
              </div>
            </div>
          </header>

          {/* Course Payment */}
          <div className='container-fluid my-5'>
            <div className='row'>
              {/* PDF Viewer */}
              <PDFViewer />
            </div>
            <div className='row'>
              <div className='col-md-3 mt-3'>
                <div className='rounded-4 shadow'>
                  <div className='modal-body p-3'>
                    <div className='payment-head rounded py-2'>
                      <h5 className='fw-bold text-center text-white'>
                        Overview
                      </h5>
                    </div>
                    <ul className='d-grid gap-4 list-unstyled p-3'>
                      <li className='d-flex gap-4'>
                        <FaClock className='bi text-black flex-shrink-0' />
                        <div>
                          <h5 className='mb-0 section-heading'>Last Updated</h5>
                          <span className='text-dark'>
                            <Moment format='MMMM D, YYYY'>
                              {course.updatedAt}
                            </Moment>
                          </span>
                        </div>
                      </li>
                      <li className='d-flex gap-4'>
                        <FaStar className='bi text-warning flex-shrink-0' />
                        <div>
                          <h5 className='mb-0 section-heading'>
                            Average Rating
                          </h5>
                          <span className='d-flex'>
                            <StarRating rating={course.averageRating} />
                          </span>
                        </div>
                      </li>
                      <li className='d-flex gap-4'>
                        <FaMoneyBill className='bi text-success flex-shrink-0' />
                        <div>
                          <h5 className='mb-0 section-heading'>Price</h5>
                          <span className='text-dark'>{course.price}</span>
                        </div>
                      </li>
                    </ul>
                    <div className='pt-0 d-flex justify-content-center'>
                      {email ? (
                        courseEnrolled ? (
                          <button
                            type='button'
                            className='btn btn-lg w-50'
                            id='check-btn'
                            disabled
                          >
                            Enrolled
                          </button>
                        ) : (
                          <Link
                            to={`/courses/${id}/payment`}
                            className='btn btn-lg w-50'
                            id='check-btn'
                          >
                            Enroll now
                          </Link>
                        )
                      ) : (
                        <Link
                          to='/signin'
                          className='btn btn-lg w-50'
                          id='check-btn'
                        >
                          Login to enrol!
                        </Link>
                      )}
                      <FaHeart
                        onClick={() => handleWishlistToggle(course.id)}
                        className={isInWishlist ? 'wish-btn' : 'no-wish-btn'}
                        role='button'
                        title={
                          isInWishlist
                            ? 'Remove Course from Wishlist'
                            : 'Add Course to Wishlist'
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-9 mt-3'>
                <Reviews courseId={id} />
              </div>
            </div>
          </div>
        </main>
      ) : (
        <Missing />
      )}
    </>
  );
};

export default CourseDetails;
