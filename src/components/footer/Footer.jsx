import { Link } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaWhatsapp, FaCopyright } from 'react-icons/fa';
import { GrMail, GrPhone } from 'react-icons/gr';
import '../../assets/styles/footer.css';
import Logo from '../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className='navy text-white p-4'>
      <div className='row'>
        <div className='col-md-4'>
          <h6 className='mb-3'>JOIN US ON SOCIAL MEDIA</h6>
          <p>
            <Link
              className='text-white'
              to='https://www.facebook.com/get-nerdifiedIT'
              target='_blank'
            >
              <FaFacebook id='social-icon' />
              <span> Facebook</span>
            </Link>
          </p>
          <p>
            <Link
              className='text-white'
              to='https://www.youtube.com/channel/UC6X7jQL8km-8ILVVlOq_xjg'
              target='_blank'
            >
              <FaYoutube id='social-icon' />
              <span> YouTube</span>
            </Link>
          </p>
          <p>
            <Link
              className='text-white'
              to='https://chat.whatsapp.com/HyKLt42tu8WFv4z2CRU9ky'
              target='_blank'
            >
              <FaWhatsapp id='social-icon' />
              <span> Whatsapp Community</span>
            </Link>
          </p>
        </div>
        <div className='col-md-4'>
          <h6 className='mb-3'>CONTACT US</h6>
          <p>
            <Link
              className='text-white'
              to='mailto:nerdified.get@gmail.com'
              target='_blank'
            >
              <GrMail id='social-icon' />
              <span> nerdified.get@gmail.com</span>
            </Link>
          </p>
          <p>
            <Link
              className='text-white'
              to='https://wa.me/2349063368647'
              target='_blank'
            >
              <FaWhatsapp id='social-icon' />
              <span> +2349063368647</span>
            </Link>
          </p>
          <p>
            <Link className='text-white'>
              <GrPhone className='phone' />
              <span> +2349063368647</span>
            </Link>
          </p>
        </div>
        <div className='col-md-4'>
          <div className='row text-center mb-2'>
            <Link to='/'>
              <img src={Logo} alt='<Nerdified />' id='footer-logo' />
            </Link>
          </div>
          <div className='row text-center'>
            <p className='text-white'>
              <span>
                <FaCopyright className='bi' /> 2024 lt;Nerdified /gt;
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
