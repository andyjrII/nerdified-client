import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FaHeart } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import db from '../../utils/localBase';
import Moment from 'react-moment';
import { formatCurrency } from '../../utils/formatCurrency';
import StarRating from '../../components/StarRating';
import StudentInfo from '../../components/StudentInfo';
import Swal from 'sweetalert2';

const Wishlist = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail(); // Fetch and set email
        if (email) await getWishlist();
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

  const getWishlist = async () => {
    try {
      const response = await axiosPrivate.get(`wishlist/email/${email}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setWishlist(response?.data);
    } catch (error) {
      console.error('Error getting Wishlist');
    }
  };

  const handleRemove = async (email, courseId) => {
    try {
      await axiosPrivate.delete('wishlist/remove', {
        data: { email, courseId },
      });
      Swal.fire({
        icon: 'success',
        title: 'Course Removed',
        text: 'Course has been successfully removed from wishlist!',
        confirmButtonText: 'OK',
      });
      getWishlist();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error removing course from wishlist!',
        confirmButtonText: 'Try again',
      });
    }
  };

  const handleCourseView = (course) => {
    localStorage.setItem('NERDVILLE_COURSE', JSON.stringify(course));
    navigate(`/courses/${course.id}`);
  };

  const displayWishlist = wishlist.map((wish) => (
    <tr key={wish.id} className='text-white'>
      <td>{wish.course.title}</td>
      <td>
        <StarRating rating={wish.course.averageRating} />
      </td>
      <td className='col-price'>{formatCurrency(wish.course.price)}</td>
      <td>
        <Moment format='MMMM D, YYYY'>{wish.createdAt}</Moment>
      </td>
      <td>
        <GrView
          role='button'
          tabIndex='0'
          title='View Course'
          onClick={() => handleCourseView(wish.course)}
          className='wish-icons wish-view'
        />
        <FaHeart
          role='button'
          tabIndex='0'
          title='Remove from Wishlist'
          className='wish-icons wish-remove'
          onClick={() => handleRemove(email, wish.courseId)}
        />
      </td>
    </tr>
  ));

  return (
    <section id='student-section' className='border-top border-bottom'>
      <main id='student-main' className='mx-3 mb-3 pb-2'>
        <StudentInfo />

        <div className='text-center'>
          <p className='h1'>
            <span className='badge bg-danger'>Wishlist</span>
          </p>
        </div>

        <div id='wishlist-div'>
          <table className='table'>
            <thead>
              <tr className='bg-black text-white'>
                <th>Course Title</th>
                <th>Rating</th>
                <th className='col-price'>Price</th>
                <th>Date Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{displayWishlist}</tbody>
          </table>
        </div>
      </main>
    </section>
  );
};

export default Wishlist;
