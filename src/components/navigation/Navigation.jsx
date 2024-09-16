import { Link } from 'react-router-dom';
import {
  IoHomeSharp,
  IoBook,
  IoInformationCircle,
  IoCall,
} from 'react-icons/io5';
import { FaBlogger, FaLock } from 'react-icons/fa';
import '../../assets/styles/navigation.css';
import Logo from '../../assets/images/logo.png';
import DropdownMenu from './DropdownMenu';
import useAuth from '../../hooks/useAuth';

const Navigation = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner if desired
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-dark nerd-navbar-light navy'>
      <div className='container-fluid'>
        <Link className='navbar-brand d-flex' to='/'>
          <img src={Logo} alt='<Nerdified />' id='nerdified-logo' />
          <div className='ml-3'>
            <span className='brand-top'>
              Nerdified <span className='text-success'>Af</span>
              <span className='text-warning'>ri</span>
              <span className='text-danger'>ca</span>
            </span>
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
            <li className='nav-item me-2'>
              <Link
                className='nav-link text-center d-flex align-items-center'
                to='/contact'
              >
                <IoCall className='mr-2' /> Contact us
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
          {auth.email && <DropdownMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
