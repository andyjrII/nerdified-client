import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faGear,
  faMale,
  faSignOut,
} from '@fortawesome/free-solid-svg-icons';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useStudent from '../../hooks/useStudent';
import useLogout from '../../hooks/useLogout';
import DPDefault from '../../assets/images/navpages/person_profile.jpg';
import db from '../../utils/localBase';

const DropdownMenu = () => {
  const axiosPrivate = useAxiosPrivate();
  const { student, setStudent } = useStudent();
  const [email, setEmail] = useState('');

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
        } catch (error) {
          console.error('Error fetching Student Profile:', error);
          // Fallback: Fetch from Localbase if server fails
          const localStudent = await db.collection('student').doc(email).get();
          setStudent(localStudent);
        }
      };

      fetchStudent();
    }
  }, [email]);

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
        <img
          src={student.imagePath || DPDefault}
          alt='Student'
          className='dp'
        />
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
        <li>
          <Link
            className='dropdown-item d-flex gap-2 align-items-center'
            to='/student/wishlist'
          >
            <FontAwesomeIcon
              icon={faHeart}
              className='me-2'
              width='16'
              height='16'
            />
            Wishlist
          </Link>
        </li>
        <li>
          <Link
            className='dropdown-item d-flex gap-2 align-items-center'
            to='/student/picture'
          >
            <FontAwesomeIcon
              icon={faGear}
              className='me-2'
              width='16'
              height='16'
            />
            Settings
          </Link>
        </li>
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
