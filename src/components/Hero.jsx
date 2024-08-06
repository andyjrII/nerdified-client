import { Link } from 'react-router-dom';
import Carousel1 from '../assets/images/hero/carousel-bg-1.jpg';
import Carousel2 from '../assets/images/hero/carousel-bg-2.jpg';
import Carousel3 from '../assets/images/hero/carousel-bg-3.jpg';

const Hero = () => {
  return (
    <div id='heroCarousel' className='carousel slide' data-bs-ride='carousel'>
      <div className='carousel-indicators'>
        <button
          type='button'
          data-bs-target='#heroCarousel'
          data-bs-slide-to='0'
          className='active'
          aria-current='true'
          aria-label='Slide 1'
        ></button>
        <button
          type='button'
          data-bs-target='#heroCarousel'
          data-bs-slide-to='1'
          aria-label='Slide 2'
        ></button>
        <button
          type='button'
          data-bs-target='#heroCarousel'
          data-bs-slide-to='2'
          aria-label='Slide 3'
        ></button>
      </div>

      <div className='carousel-inner'>
        <div className='carousel-item active'>
          <img
            src={Carousel1}
            alt='Carousel 1'
            className='bd-placeholder-img'
            width='100%'
            height='100%'
            loading='lazy'
          />
          <div className='container'>
            <div className='carousel-caption'>
              <h1>
                <span className='carousel-text badge navy p-3'>
                  Nerdified Coding Academy
                </span>
              </h1>
              <p>
                <span className='carousel-text badge navy text-wrap p-3'>
                  Join us today & take the first step towards a successful
                  career in programming!
                </span>
              </p>
              <p>
                <Link
                  className='btn btn-lg me-1 carousel-button'
                  to='/courses'
                  role='button'
                >
                  Get Nerdified
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='carousel-item'>
          <img
            src={Carousel2}
            alt='Carousel 2'
            className='bd-placeholder-img'
            width='100%'
            height='100%'
            loading='lazy'
          />
          <div className='container'>
            <div className='carousel-caption text-end'>
              <h1>
                <span className='carousel-text badge text-wrap navy p-3'>
                  Nerdified Coding Academy
                </span>
              </h1>
              <p>
                <span className='carousel-text badge navy text-wrap p-3 text-end'>
                  Join us today & take the first step towards a successful
                  career in programming!
                </span>
              </p>
              <p>
                <Link className='btn btn-lg carousel-button' to='/courses'>
                  Get Nerdified
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='carousel-item'>
          <img
            src={Carousel3}
            alt='Carousel 3'
            className='bd-placeholder-img'
            width='100%'
            height='100%'
            loading='lazy'
          />
          <div className='container'>
            <div className='carousel-caption text-start'>
              <h1>
                <span className='carousel-text badge navy p-3'>
                  Nerdified Coding Academy
                </span>
              </h1>
              <p>
                <span className='carousel-text badge navy text-wrap text-start p-3'>
                  Join us today & take the first step towards a successful
                  career in programming!
                </span>
              </p>
              <p>
                <Link className='btn btn-lg carousel-button' to='/courses'>
                  Get Nerdified
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        className='carousel-control-prev'
        type='button'
        data-bs-target='#heroCarousel'
        data-bs-slide='prev'
      >
        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
        <span className='visually-hidden'>Previous</span>
      </button>
      <button
        className='carousel-control-next'
        type='button'
        data-bs-target='#heroCarousel'
        data-bs-slide='next'
      >
        <span className='carousel-control-next-icon' aria-hidden='true'></span>
        <span className='visually-hidden'>Next</span>
      </button>
    </div>
  );
};

export default Hero;
