import ClientImage from '../assets/images/testimonial/client-img.png';
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Testimonial = () => {
  return (
    <div
      id='testimonialCarousel'
      className='carousel slide'
      data-bs-ride='carousel'
    >
      <div className='carousel-indicators'>
        <button
          type='button'
          data-bs-target='#testimonialCarousel'
          data-bs-slide-to='0'
          className='active'
          aria-current='true'
          aria-label='Slide 1'
        ></button>
        <button
          type='button'
          data-bs-target='#testimonialCarousel'
          data-bs-slide-to='1'
          aria-label='Slide 2'
        ></button>
        <button
          type='button'
          data-bs-target='#testimonialCarousel'
          data-bs-slide-to='2'
          aria-label='Slide 3'
        ></button>
        <button
          type='button'
          data-bs-target='#testimonialCarousel'
          data-bs-slide-to='3'
          aria-label='Slide 4'
        ></button>
        <button
          type='button'
          data-bs-target='#testimonialCarousel'
          data-bs-slide-to='4'
          aria-label='Slide 5'
        ></button>
      </div>

      <div className='carousel-inner'>
        <div className='carousel-item active'>
          <div className='row g-3'>
            <div className='col-md-4'>
              <div className='client_left'>
                <img
                  src={ClientImage}
                  className='rounded'
                  alt='...'
                  width='230px'
                  height='290px'
                  loading='lazy'
                />
              </div>
            </div>
            <div className='client_right col-md-8 bg-faded text-dark rounded'>
              <h3 className='client_name'>Chineye</h3>
              <p className='client_text text-black d-flex justify-content-center'>
                <FaQuoteLeft className='mr-2 text-black' />
                I honestly love how I was taught!
                <FaQuoteRight className='ml-2 text-black' />
              </p>
              <p className='d-flex justify-content-center'>
                <Link className='client_icon mx-2'>
                  <FaFacebook />
                </Link>
                <Link className='client_icon mx-2'>
                  <FaTwitter />
                </Link>
                <Link className='client_icon mx-2'>
                  <FaTiktok />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='carousel-item'>
          <div className='row g-3'>
            <div className='col-md-4'>
              <div className='client_left'>
                <img
                  src={ClientImage}
                  className='rounded'
                  alt='...'
                  width='230px'
                  height='290px'
                  loading='lazy'
                />
              </div>
            </div>
            <div className='client_right col-md-8 bg-faded text-dark rounded'>
              <h3 className='client_name'>Michael Owen</h3>
              <p className='client_text text-black d-flex justify-content-center'>
                <FaQuoteLeft className='mr-2 text-black' />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip.
                <FaQuoteRight className='ml-2 text-black' />
              </p>
              <p className='d-flex justify-content-center'>
                <Link className='client_icon mx-2'>
                  <FaFacebook />
                </Link>
                <Link className='client_icon mx-2'>
                  <FaInstagram />
                </Link>
                <Link className='client_icon mx-2'>
                  <FaTiktok />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='carousel-item'>
          <div className='row g-3'>
            <div className='col-md-4'>
              <div className='client_left'>
                <img
                  src={ClientImage}
                  className='rounded'
                  alt='...'
                  width='230px'
                  height='290px'
                  loading='lazy'
                />
              </div>
            </div>
            <div className='client_right col-md-8 bg-faded text-dark rounded'>
              <h3 className='client_name'>John Smith</h3>
              <p className='client_text text-black d-flex justify-content-center'>
                <FaQuoteLeft className='mr-2 text-black' />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip.
                <FaQuoteRight className='ml-2 text-black' />
              </p>
              <p className='d-flex justify-content-center'>
                <Link className='client_icon mx-2'>
                  <FaFacebook />
                </Link>
                <Link className='client_icon mx-2'>
                  <FaTwitter />
                </Link>
                <Link className='client_icon mx-2'>
                  <FaLinkedin />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='carousel-item'>
          <div className='row g-3'>
            <div className='col-md-4'>
              <div className='client_left'>
                <img
                  src={ClientImage}
                  className='rounded'
                  alt='...'
                  width='230px'
                  height='290px'
                  loading='lazy'
                />
              </div>
            </div>
            <div className='client_right col-md-8 bg-faded text-dark rounded'>
              <h3 className='client_name'>Ismael Bennacer</h3>
              <p className='client_text text-black d-flex justify-content-center'>
                <FaQuoteLeft className='mr-2 text-black' />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip.
                <FaQuoteRight className='ml-2 text-black' />
              </p>
              <p className='d-flex justify-content-center'>
                <Link className='client_icon mx-2'>
                  <FaFacebook />
                </Link>
                <Link className='client_icon mx-2'>
                  <FaInstagram />
                </Link>
                <Link className='client_icon mx-2'>
                  <FaLinkedin />
                </Link>
                <Link className='client_icon mx-2'>
                  <FaTwitter />
                </Link>
                <Link className='client_icon mx-2'>
                  <FaTiktok />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='carousel-item'>
          <div className='row g-3'>
            <div className='col-md-4'>
              <div className='client_left'>
                <img
                  src={ClientImage}
                  className='rounded'
                  width='230px'
                  height='290px'
                  alt='...'
                  loading='lazy'
                />
              </div>
            </div>
            <div className='client_right col-md-8 bg-faded text-dark rounded'>
              <h3 className='client_name'>Christian Pulisic</h3>
              <p className='client_text text-black d-flex justify-content-center'>
                <FaQuoteLeft className='mr-2 text-black' />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip.
                <FaQuoteRight className='ml-2 text-black' />
              </p>
              <Link className='client_icon mx-2'>
                <FaLinkedin />
              </Link>
              <Link className='client_icon mx-2'>
                <FaFacebook />
              </Link>
              <Link className='client_icon mx-2'>
                <FaTwitter />
              </Link>
              <Link className='client_icon mx-2'>
                <FaTiktok />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button
        className='carousel-control-prev testimonial-button'
        type='button'
        data-bs-target='#testimonialCarousel'
        data-bs-slide='prev'
      >
        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
        <span className='visually-hidden'>Previous</span>
      </button>

      <button
        className='carousel-control-next testimonial-button'
        type='button'
        data-bs-target='#testimonialCarousel'
        data-bs-slide='next'
      >
        <span className='carousel-control-next-icon' aria-hidden='true'></span>
        <span className='visually-hidden'>Next</span>
      </button>
    </div>
  );
};

export default Testimonial;
