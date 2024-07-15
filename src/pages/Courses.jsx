import Navigation from '../components/navigation/Navigation';
import Footer from '../components/footer/Footer';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';
import ReactPaginate from 'react-paginate';
import '../assets/styles/navpages.css';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import StarRating from '../components/stars/StarRating';

const Courses = () => {
  const axiosPrivate = useAxiosPrivate();

  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCourses, setTotalCourses] = useState();

  const [wishlist, setWishlist] = useState(new Set());

  const studentId = parseInt(localStorage.getItem('STUDENT_ID'));
  const access = localStorage.getItem('ACCESS_TOKEN');
  const refresh = localStorage.getItem('REFRESH_TOKEN');

  const coursesPerPage = 20;

  const getCourses = async () => {
    try {
      const response = await axiosPrivate.get(
        `courses/${currentPage}`,
        {
          params: {
            search: searchQuery,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setTotalCourses(response.data.totalCourses);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getWishlist = async () => {
    try {
      const response = await axiosPrivate.get(`wishlist/${studentId}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const wishlistSet = new Set(response.data.map((item) => item.courseId));
      setWishlist(wishlistSet);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getCourses();
    if (studentId) getWishlist();
  }, [currentPage, searchQuery]);

  const handleWishlistToggle = async (courseId) => {
    if (access && refresh && studentId) {
      try {
        if (wishlist.has(courseId)) {
          await axiosPrivate.delete('/wishlist/remove', {
            data: { studentId, courseId },
          });
          setWishlist((prev) => {
            const newSet = new Set(prev);
            newSet.delete(courseId);
            return newSet;
          });
        } else {
          await axiosPrivate.post(
            '/wishlist/add',
            { studentId, courseId },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }
          );
          setWishlist((prev) => new Set(prev).add(courseId));
        }
      } catch (error) {
        console.error('Error toggling wishlist:', error);
      }
    } else {
      alert('You must be signed in first to be able to add class to wishlist');
    }
  };

  const pageCount = Math.ceil(totalCourses / coursesPerPage);

  const changePage = ({ selected }) => {
    selected += 1;
    setCurrentPage(selected);
  };

  const saveCourse = async (course) => {
    localStorage.setItem('NERDVILLE_COURSE', JSON.stringify(course));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
  };

  const displayCourses = courses.map((course) => {
    const isInWishlist = wishlist.has(course.id);
    return (
      <motion.div layout className='mb-4' key={course.id}>
        <div className='card mb-0 rounded-3 shadow-sm'>
          <div className='card-header py-3 course-card'>
            <h4 className='my-0 fw-normal text-white course-title'>
              {course.title}
            </h4>
          </div>
          <div className='card-body'>
            <ul className='list-unstyled mt-1 mb-3'>
              <li className='mb-2'>
                Updated:{' '}
                <small className='text-muted fw-light'>
                  <Moment format='MMMM D, YYYY'>{course.updatedAt}</Moment>
                </small>
              </li>
              <li className='mb-2'>
                <StarRating rating={course.averageRating} />
              </li>
              <li>&#8358;{course.price}</li>
            </ul>
            <Link
              to='/courses/course'
              role='button'
              className='w-50 btn btn-lg mr-2'
              id='check-btn'
              onClick={() => saveCourse(course)}
            >
              View
            </Link>
            <FaHeart
              onClick={() => handleWishlistToggle(course.id)}
              className='wish-btn'
              color={isInWishlist ? 'tomato' : 'grey'}
              role='button'
              title='Add Course to Wishlist'
            />
          </div>
        </div>
      </motion.div>
    );
  });

  return (
    <>
      <Navigation />
      <header className='py-3 bg-light border-bottom mb-4 header-bg'>
        <div className='container'>
          <div className='text-center my-3'>
            <p className='h1'>
              <span className='badge bg-danger'>Courses</span>
            </p>
          </div>
        </div>
      </header>
      <div className='container'>
        {/* Search filter for Courses */}
        <div className='p-3 mx-auto row'>
          <div className='col-sm-12 mb-4'>
            <input
              type='text'
              className='form-control rounded'
              placeholder='Search for Class...'
              aria-label='Search'
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Courses */}
        <motion.div
          layout
          className='row row-cols-1 row-cols-md-4 text-center justify-content-center'
        >
          {displayCourses}
        </motion.div>

        {/* Pagination */}
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={'paginationBttns'}
          previousLinkClassName={'previousBttn'}
          nextLinkClassName={'nextBttn'}
          disabledClassName={'paginationDisabled'}
          activeClassName={'paginationActive'}
        />
      </div>
      <Footer />
    </>
  );
};

export default Courses;
