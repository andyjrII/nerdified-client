import { Link } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaWhatsapp, FaCopyright } from 'react-icons/fa';
import {
  GrMail,
  GrPhone,
  GrBook,
  GrHome,
  GrBlog,
  GrArticle,
  GrMap,
} from 'react-icons/gr';
import '../../assets/styles/footer.css';
import Logo from '../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className='navy text-white p-4'>
      <div className='row'>
        <div className='col-md-3'>
          <div className='row mb-2'>
            <Link to='/'>
              <img src={Logo} alt='<Nerdified />' id='footer-logo' />
            </Link>
          </div>
          <div className='row'>
            <p className='text-white'>
              <span>
                <FaCopyright className='bi' /> 2024 Nerdified
              </span>
            </p>
          </div>
        </div>
        <div className='col-md-3'>
          <h6 className='mb-3'>JOIN US ON SOCIAL MEDIA</h6>
          <p>
            <Link
              className='text-white'
              to='https://www.facebook.com/get-nerdifiedIT'
              target='_blank'
            >
              <FaFacebook className='social-icon' />
              <span> Facebook</span>
            </Link>
          </p>
          <p>
            <Link
              className='text-white'
              to='https://www.youtube.com/channel/UC6X7jQL8km-8ILVVlOq_xjg'
              target='_blank'
            >
              <FaYoutube className='social-icon' />
              <span> YouTube</span>
            </Link>
          </p>
          <p>
            <Link
              className='text-white'
              to='https://wa.me/2349063368647'
              target='_blank'
            >
              <FaWhatsapp className='social-icon' />
              <span> Whatsapp</span>
            </Link>
          </p>
        </div>
        <div className='col-md-3'>
          <h6 className='mb-3'>CONTACT US</h6>
          <p>
            <Link className='text-white'>
              <GrMap className='social-icon' />
              <span> Efab Estate, Lokogoma, Abuja</span>
            </Link>
          </p>
          <p>
            <Link
              className='text-white'
              to='mailto:nerdified.get@gmail.com'
              target='_blank'
            >
              <GrMail className='social-icon' />
              <span> nerdified.get@gmail.com</span>
            </Link>
          </p>
          <p>
            <Link className='text-white'>
              <GrPhone className='social-icon' />
              <span> +2349063368647</span>
            </Link>
          </p>
        </div>
        <div className='col-md-3'>
          <p>
            <Link className='text-white' to='/'>
              <GrHome />
              <span> Home</span>
            </Link>
          </p>
          <p>
            <Link className='text-white' to='/classes'>
              <GrBook className='nav-icon' />
              <span> Classes</span>
            </Link>
          </p>
          <p>
            <Link className='text-white' to='/blog'>
              <GrBlog />
              <span> Blog</span>
            </Link>
          </p>
          <p>
            <Link className='text-white' to='/about'>
              <GrArticle />
              <span> About Us</span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
