import { useState, useEffect } from 'react';
import Navigation from '../components/navigation/Navigation';
import Footer from '../components/Footer';
import '../assets/styles/navpages.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';
import { FaClock, FaMoneyBill, FaStar, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Missing from './Missing';
import StarRating from '../components/StarRating';
import Reviews from '../components/Reviews';
import PDFViewer from '../components/PDFViewer';

const CourseDetails = () => {
  const axiosPrivate = useAxiosPrivate();

  const course = JSON.parse(localStorage.getItem('NERDVILLE_COURSE'));
  if (course) {
    var courseId = course.id;
    var courseTitle = course.title;
  }
  const email = localStorage.getItem('STUDENT_EMAIL');
  const accessToken = localStorage.getItem('ACCESS_TOKEN');
  const refreshToken = localStorage.getItem('REFRESH_TOKEN');
  const studentId = parseInt(localStorage.getItem('STUDENT_ID'));

  const [courseEnrolled, setCourseEnrolled] = useState(null);

  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const isCourseEnrolled = async () => {
      try {
        const response = await axiosPrivate.get(
          `students/course_enrolled/${courseId}`,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          }
        );
        setCourseEnrolled(response.data);
      } catch (error) {
        //console.error('Error:', error);
      }
    };
    isCourseEnrolled();
  }, [courseId]);

  useEffect(() => {
    const checkIfInWishlist = async () => {
      try {
        const response = await axiosPrivate.get(`wishlist/${studentId}`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        const wishlistSet = new Set(response.data.map((item) => item.courseId));
        setIsInWishlist(wishlistSet.has(courseId));
      } catch (error) {
        alert('Error fetching Wishlist!');
      }
    };
    if (localStorage.getItem('STUDENT_ID')) {
      checkIfInWishlist();
    }
  }, [courseId]);

  const handleWishlistToggle = async () => {
    if (accessToken && refreshToken && studentId) {
      try {
        if (isInWishlist) {
          await axiosPrivate.delete('/wishlist/remove', {
            data: { studentId, courseId },
          });
          setIsInWishlist(false);
        } else {
          await axiosPrivate.post(
            '/wishlist/add',
            JSON.stringify({
              studentId,
              courseId,
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }
          );
          setIsInWishlist(true);
        }
      } catch (error) {
        alert('Error toggling Wishlist!');
      }
    } else {
      alert('You must be signed in first to be able to add class to wishlist');
    }
  };

  return (
    <>
      {course ? (
        <>
          <Navigation />
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
              <div className='col-md-3'>
                <div className='modal-content rounded-4 shadow'>
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
                          <span className='text-dark'>
                            &#8358;{course.price}.00
                          </span>
                        </div>
                      </li>
                    </ul>
                    <div className='pt-0 d-flex justify-content-center'>
                      {accessToken && email ? (
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
                            to='/courses/course-enroll'
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
            </div>
            <div className='row'>
              <Reviews courseId={courseId} />
            </div>
          </div>
        </>
      ) : (
        <Missing />
      )}
      <Footer />
    </>
  );
};

export default CourseDetails;
