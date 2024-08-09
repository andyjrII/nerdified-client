import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoHomeSharp, IoBook, IoInformationCircle } from 'react-icons/io5';
import { FaBlogger, FaLock } from 'react-icons/fa';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import storage from '../../utils/storage';
import '../../assets/styles/navigation.css';
import Logo from '../../assets/images/logo.png';
import DropdownMenu from './DropdownMenu';

const Navigation = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const [imagePath, setImagePath] = useState('');

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axiosPrivate.get(
          `students/image/${auth.email}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(imageBlob);
        setImagePath(imageUrl);
      } catch (error) {
        console.error('Error getting Profile picture!');
      }
    };
    if (auth.email) fetchImage();
  }, [auth.email]);

  return (
    <nav className='navbar navbar-expand-lg navbar-dark nerd-navbar-light navy'>
      <div className='container-fluid'>
        <Link className='navbar-brand d-flex' to='/'>
          <img src={Logo} alt='<Nerdified />' id='nerdified-logo' />
          <div className='ml-3'>
            <span className='brand-top'>Nerdified</span>
            <span className='brand-bottom'>Educate. Empower. Nerdify</span>
          </div>
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
          <ul className='navbar-nav ms-auto py-lg-0'>
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
            {!auth.email && (
              <li className='nav-item text-center'>
                <Link
                  className='nav-link d-flex align-items-center'
                  to='/signin'
                >
                  <FaLock className='mr-2' />
                  Sign in
                </Link>
              </li>
            )}
          </ul>
          {auth.email && <DropdownMenu image={imagePath} />}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
