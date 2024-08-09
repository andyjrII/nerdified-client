import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMale, faSignOut } from '@fortawesome/free-solid-svg-icons';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import storage from '../../utils/storage';
import useStudent from '../../hooks/useStudent';
import useLogout from '../../hooks/useLogout';
import DPDefault from '../../assets/images/navpages/person_profile.jpg';
import WishlistPopover from '../popovers/WishlistPopover';
import PicturePopover from '../popovers/PicturePopover';
import PasswordPopover from '../popovers/PasswordPopover';

const DropdownMenu = ({ image }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const { student, setStudent } = useStudent();

  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }

    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const response = await axiosPrivate.get(`students/${auth.email}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setStudent(response?.data);
      localStorage.setItem('student_id', student.id);
    } catch (error) {
      console.error('Error fetching Student Profile');
      navigate('/signin', { state: { from: location }, replace: true });
    }
  };

  const signOut = async () => {
    await logout();
    navigate('/');
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
            {student.name}
          </Link>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <WishlistPopover email={auth.email} />
        <PicturePopover email={auth.email} />
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
