import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaYoutube,
  FaWhatsapp,
  FaCopyright,
  FaBlogger,
} from 'react-icons/fa';
import {
  IoInformationCircle,
  IoMail,
  IoCall,
  IoBook,
  IoHome,
  IoLocation,
} from 'react-icons/io5';
import '../../assets/styles/footer.css';
import Logo from '../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className='navy text-white p-4 border-top'>
      <div className='row'>
        <div className='col-md-3'>
          <div className='row mb-2'>
            <Link to='/'>
              <img src={Logo} alt='<Nerdified />' id='footer-logo' />
            </Link>
          </div>
          <div className='row'>
            <p className='text-white ml-3'>
              <span className='d-flex align-items-center'>
                <FaCopyright className='bi mr-2' /> 2024 Nerdified Africa
              </span>
            </p>
          </div>
        </div>
        <div className='col-md-3'>
          <h6 className='mb-3'>JOIN US ON SOCIAL MEDIA</h6>
          <p>
            <Link
              className='text-white d-flex align-items-center'
              to='https://www.facebook.com/get-nerdifiedIT'
              target='_blank'
            >
              <FaFacebook className='social-icon mr-2' />
              <span> Get Nerdified</span>
            </Link>
          </p>
          <p>
            <Link
              className='text-white d-flex align-items-center'
              to='https://www.youtube.com/channel/UC6X7jQL8km-8ILVVlOq_xjg'
              target='_blank'
            >
              <FaYoutube className='social-icon mr-2' />
              <span> GetNerdified</span>
            </Link>
          </p>
          <p>
            <Link
              className='text-white d-flex align-items-center'
              to='https://wa.me/2349063368647'
              target='_blank'
            >
              <FaWhatsapp className='social-icon mr-2' />
              <span> +2349063368647</span>
            </Link>
          </p>
        </div>
        <div className='col-md-3'>
          <h6 className='mb-3'>CONTACT US</h6>
          <p>
            <Link className='text-white d-flex align-items-center'>
              <IoLocation className='social-icon mr-2' />
              <span> Efab Estate, Lokogoma, Abuja</span>
            </Link>
          </p>
          <p>
            <Link
              className='text-white d-flex align-items-center'
              to='mailto:nerdified.get@gmail.com'
              target='_blank'
            >
              <IoMail className='social-icon mr-2' />
              <span> nerdified.get@gmail.com</span>
            </Link>
          </p>
          <p>
            <Link className='text-white d-flex align-items-center'>
              <IoCall className='social-icon mr-2' />
              <span> +2349063368647</span>
            </Link>
          </p>
        </div>
        <div className='col-md-3'>
          <p>
            <Link className='text-white d-flex align-items-center' to='/'>
              <IoHome className='mr-2' />
              <span> Home</span>
            </Link>
          </p>
          <p>
            <Link
              className='text-white d-flex align-items-center'
              to='/courses'
            >
              <IoBook className='nav-icon mr-2' />
              <span> Courses</span>
            </Link>
          </p>
          <p>
            <Link className='text-white d-flex align-items-center' to='/blog'>
              <FaBlogger className='mr-2' />
              <span> Blog</span>
            </Link>
          </p>
          <p>
            <Link className='text-white d-flex align-items-center' to='/about'>
              <IoInformationCircle className='mr-2' />
              <span> About Us</span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
