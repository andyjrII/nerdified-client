import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { IoHomeSharp, IoBook, IoInformationCircle } from 'react-icons/io5';
import { FaBlogger, FaUserGraduate, FaLock } from 'react-icons/fa';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import storage from '../../utils/storage';
import useStudent from '../../hooks/useStudent';
import '../../assets/styles/navigation.css';
import Logo from '../../assets/images/logo.png';

const Navigation = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const { student, setStudent } = useStudent(null);

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axiosPrivate.get(`students/${auth.email}`);
        setStudent(response?.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    if (auth.email) fetchStudent();
  }, [auth.email, axiosPrivate]);

  return (
    <nav className='navbar navbar-expand-lg navbar-dark nerd-navbar-light navy'>
      <div className='container-fluid'>
        <Link className='navbar-brand d-flex' to='/'>
          <img src={Logo} alt='<Nerdified />' id='nerdified-logo' />
          <span className='align-self-center ml-3'>Nerdified</span>
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarCollapse'
          aria-controls='navbarCollapse'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarCollapse'>
          <ul className='navbar-nav ms-auto py-4 py-lg-0'>
            <li className='nav-item me-2'>
              <Link
                className='nav-link text-center d-flex align-items-center'
                aria-current='page'
                to='/'
              >
                <IoHomeSharp className='mr-2' /> Home
              </Link>
            </li>

            <li className='nav-item me-2'>
              <Link
                className='nav-link text-center d-flex align-items-center'
                to='/courses'
              >
                <IoBook className='mr-2' /> Courses
              </Link>
            </li>
            <li className='nav-item me-2'>
              <Link
                className='nav-link text-center d-flex align-items-center'
                to='/blog'
              >
                <FaBlogger className='mr-2' /> Blog
              </Link>
            </li>
            <li className='nav-item me-2'>
              <Link
                className='nav-link text-center d-flex align-items-center'
                to='/about'
              >
                <IoInformationCircle className='mr-2' /> About us
              </Link>
            </li>

            {/*  Nav Item - Login/User Information */}

            <li className='nav-item text-center'>
              <Link
                className='nav-link d-flex align-items-center'
                id='userDropdown'
                role='button'
                to={student.name ? '/student' : '/signin'}
              >
                {student.name ? (
                  <>
                    <FaUserGraduate className='mr-2' />
                    {student.name}
                  </>
                ) : (
                  <>
                    <FaLock className='mr-2' />
                    Sign in
                  </>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
