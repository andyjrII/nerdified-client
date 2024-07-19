import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { IoSettings } from 'react-icons/io5';
import { FaHeart, FaSignOutAlt, FaUserGraduate } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useStudent from '../../hooks/useStudent';
import useLogout from '../../hooks/useLogout';

const StudentSidebar = () => {
  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem('STUDENT_EMAIL');

  const { student, setStudent } = useStudent();

  const fetchStudent = async () => {
    try {
      const response = await axiosPrivate.get(`students/${email}`);
      localStorage.setItem('STUDENT_ID', response?.data.id);
      setStudent(response?.data);
    } catch (error) {
      console.error('Error:', error);
      navigate('/signin', { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const signOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className='nav-menu'>
      <ul className='mt-2'>
        <li>
          <Link to='/profile' title='Profile'>
            <span className='span-icons'>
              <FaUserGraduate />
            </span>
          </Link>
        </li>
        <li>
          <Link to='/wishlist' title='Wishlist'>
            <span className='span-icons'>
              <FaHeart />
            </span>
          </Link>
        </li>
        <li>
          <Link to='/student/settings' title='Account Settings'>
            <span className='span-icons'>
              <IoSettings />
            </span>
          </Link>
        </li>
        <li>
          <Link role='button' onClick={signOut} title='Sign Out'>
            <span className='span-icons'>
              <FaSignOutAlt />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StudentSidebar;
