import Navigation from '../components/navigation/Navigation';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import storage from '../utils/storage';
import Moment from 'react-moment';
import ReactPaginate from 'react-paginate';
import '../assets/styles/navpages.css';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import StarRating from '../components/StarRating';

const Courses = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCourses, setTotalCourses] = useState();

  const [wishlist, setWishlist] = useState(new Set());

  const coursesPerPage = 20;

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  useEffect(() => {
    getCourses();
    if (auth.accessToken) getWishlist();
  }, [currentPage, searchQuery]);

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
      console.error('Error fetching Courses!');
    }
  };

  const getWishlist = async () => {
    try {
      const response = await axiosPrivate.get(`wishlist/email/${auth.email}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const wishlistSet = new Set(response.data.map((item) => item.courseId));
      setWishlist(wishlistSet);
    } catch (error) {
      console.error('Error getting wishlist');
    }
  };

  const handleWishlistToggle = async (courseId) => {
    if (auth) {
      try {
        if (wishlist.has(courseId)) {
          await axiosPrivate.delete('/wishlist/remove', {
            data: { email: auth.email, courseId },
          });
          setWishlist((prev) => {
            const newSet = new Set(prev);
            newSet.delete(courseId);
            return newSet;
          });
        } else {
          await axiosPrivate.post(
            '/wishlist/add',
            { email: auth.email, courseId },
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
      alert('You must be signed in first to be able to add Course to Wishlist');
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
        <div className='card mb-0 rounded-3 shadow-lg'>
          <div className='card-header py-3 course-card'>
            <h4 className='my-0 fw-normal text-white course-title'>
              {course.title}
            </h4>
          </div>
          <div className='card-body'>
            <ul className='list-unstyled mt-1 mb-3 justify-content-center'>
              <li className='mb-2'>
                Updated:{' '}
                <small className='text-muted fw-light'>
                  <Moment format='MMMM D, YYYY'>{course.updatedAt}</Moment>
                </small>
              </li>
              <li className='mb-2 d-flex align-items-center justify-content-center'>
                <StarRating rating={course.averageRating} />
              </li>
              <li>{course.price}</li>
            </ul>
            <div className='justify-content-center d-flex'>
              <Link
                to='/course-details'
                role='button'
                className='w-50 btn btn-lg'
                id='check-btn'
                onClick={() => saveCourse(course)}
              >
                View
              </Link>
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
      </motion.div>
    );
  });

  return (
    <main>
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
    </main>
  );
};

export default Courses;
