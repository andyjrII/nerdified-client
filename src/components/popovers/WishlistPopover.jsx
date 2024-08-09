import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FaHeart } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const WishlistPopover = ({ email, studentId }) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    getWishlist(studentId);
  }, [wishlist]);

  const getWishlist = async (studentId) => {
    try {
      const response = await axiosPrivate.get(`wishlist/${studentId}`, {
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
      await axiosPrivate.delete(
        'wishlist/remove',
        { data: { email, courseId } },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      alert('Course successfully removed!');
      getWishlist(studentId);
    } catch (error) {
      alert('Error removing Course');
    }
  };

  const handleCourseView = (course) => {
    localStorage.setItem('NERDVILLE_COURSE', JSON.stringify(course));
    navigate('/course-details');
  };

  const displayWishlist = wishlist.map((wish) => (
    <tr key={wish.id} className='text-white'>
      <td>{wish.course.title}</td>
      <td>
        <GrView
          role='button'
          tabIndex='0'
          title='View Course'
          onClick={() => handleCourseView(wish.course)}
        />
      </td>
      <td>
        <FaHeart
          role='button'
          tabIndex='0'
          title='Remove from Wishlist'
          className='text-danger'
          onClick={() => handleRemove(email, wish.courseId)}
        />
      </td>
    </tr>
  ));

  return (
    <li>
      <OverlayTrigger
        trigger='click'
        placement='bottom'
        overlay={
          <Popover id='popover-wishlist' className='large-popover'>
            <Popover.Header as='h3'>My Wishlist</Popover.Header>
            <Popover.Body>
              <table className='table'>
                <tbody>{displayWishlist}</tbody>
              </table>
            </Popover.Body>
          </Popover>
        }
        rootClose // This will allow the popover to close when clicking outside of it
      >
        <Link className='dropdown-item d-flex gap-2 align-items-center'>
          <FontAwesomeIcon
            icon={faHeart}
            className='me-2'
            width='16'
            height='16'
          />
          Wishlist
        </Link>
      </OverlayTrigger>
    </li>
  );
};

export default WishlistPopover;
