import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMale, faSignOut } from '@fortawesome/free-solid-svg-icons';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useStudent from '../../hooks/useStudent';
import useLogout from '../../hooks/useLogout';
import DPDefault from '../../assets/images/navpages/person_profile.jpg';
import WishlistPopover from '../popovers/WishlistPopover';
import PicturePopover from '../popovers/PicturePopover';
import PasswordPopover from '../popovers/PasswordPopover';
import db from '../../utils/localBase';

const DropdownMenu = () => {
  const axiosPrivate = useAxiosPrivate();
  const { student, setStudent } = useStudent();
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');

  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const data = await db.collection('auth_student').get();
        if (data.length > 0) {
          setEmail(data[0].email);
        }
      } catch (error) {
        console.error('Error fetching email from localBase:', error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (email) {
      const fetchStudent = async () => {
        try {
          const response = await axiosPrivate.get(`students/${email}`);
          setStudent(response?.data);
          fetchImage(email); // Fetch image after student data is set
        } catch (error) {
          console.error('Error fetching Student Profile:', error);
        }
      };

      fetchStudent();
    }
  }, [email, axiosPrivate, setStudent]);

  const fetchImage = async (email) => {
    try {
      const response = await axiosPrivate.get(`students/image/${email}`, {
        responseType: 'arraybuffer',
      });
      const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl);
    } catch (error) {
      console.error('Error getting Profile picture!', error);
    }
  };

  const signOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <>
      <Link
        className='userDropdown dropdown-toggle text-white'
        id='userDropdown'
        data-bs-toggle='dropdown'
        aria-expanded='false'
      >
        <img src={image || DPDefault} alt='Student' className='dp' />
      </Link>
      <ul className='dropdown-menu dropdown-menu-dark navy shadow'>
        <li>
          <Link
            className='dropdown-item d-flex gap-2 align-items-center'
            to='/student'
          >
            <FontAwesomeIcon
              icon={faMale}
              className='me-2'
              width='16'
              height='16'
            />
            {student.name || 'Student Name'}
          </Link>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <WishlistPopover />
        <PicturePopover email={email} />
        <PasswordPopover />
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li>
          <Link
            className='dropdown-item d-flex gap-2 align-items-center'
            role='button'
            onClick={signOut}
          >
            <FontAwesomeIcon
              icon={faSignOut}
              className='me-2'
              width='16'
              height='16'
            />
            Sign Out
          </Link>
        </li>
      </ul>
    </>
  );
};

export default DropdownMenu;
