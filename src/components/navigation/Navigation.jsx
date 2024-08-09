import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoHomeSharp, IoBook, IoInformationCircle } from 'react-icons/io5';
import { FaBlogger, FaLock } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFile,
  faImage,
  faVideo,
  faMusic,
  faGamepad,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import storage from '../../utils/storage';
import '../../assets/styles/navigation.css';
import Logo from '../../assets/images/logo.png';
import DPDefault from '../../assets/images/navpages/person_profile.jpg';

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
          {auth.email && (
            <>
              <Link
                className='userDropdown dropdown-toggle text-white'
                id='userDropdown'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                <img
                  src={!imagePath ? DPDefault : imagePath}
                  alt='Student'
                  className='dp'
                />
              </Link>
              <ul className='dropdown-menu dropdown-menu-dark navy shadow'>
                <li>
                  <Link
                    className='dropdown-item d-flex gap-2 align-items-center'
                    to='#'
                  >
                    <FontAwesomeIcon
                      icon={faFile}
                      className='me-2'
                      width='16'
                      height='16'
                    />
                    Documents
                  </Link>
                </li>
                <li>
                  <Link
                    className='dropdown-item d-flex gap-2 align-items-center'
                    to='#'
                  >
                    <FontAwesomeIcon
                      icon={faImage}
                      className='me-2'
                      width='16'
                      height='16'
                    />
                    Photos
                  </Link>
                </li>
                <li>
                  <Link
                    className='dropdown-item d-flex gap-2 align-items-center'
                    to='#'
                  >
                    <FontAwesomeIcon
                      icon={faVideo}
                      className='me-2'
                      width='16'
                      height='16'
                    />
                    Movies
                  </Link>
                </li>
                <li>
                  <Link
                    className='dropdown-item d-flex gap-2 align-items-center'
                    to='#'
                  >
                    <FontAwesomeIcon
                      icon={faMusic}
                      className='me-2'
                      width='16'
                      height='16'
                    />
                    Music
                  </Link>
                </li>
                <li>
                  <Link
                    className='dropdown-item d-flex gap-2 align-items-center'
                    to='#'
                  >
                    <FontAwesomeIcon
                      icon={faGamepad}
                      className='me-2'
                      width='16'
                      height='16'
                    />
                    Games
                  </Link>
                </li>
                <li>
                  <hr className='dropdown-divider' />
                </li>
                <li>
                  <Link
                    className='dropdown-item d-flex gap-2 align-items-center'
                    to='#'
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className='me-2'
                      width='16'
                      height='16'
                    />
                    Trash
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
