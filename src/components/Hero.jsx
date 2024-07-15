import { Link } from 'react-router-dom';
import Carousel1 from '../assets/images/hero/carousel-bg-1.jpg';
import Carousel2 from '../assets/images/hero/carousel-bg-2.jpg';
import Carousel3 from '../assets/images/hero/carousel-bg-3.jpg';
import Carousel4 from '../assets/images/hero/carousel-bg-4.jpg';
import Carousel5 from '../assets/images/hero/carousel-bg-5.jpg';

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
        <button
          type='button'
          data-bs-target='#heroCarousel'
          data-bs-slide-to='3'
          aria-label='Slide 4'
        ></button>
        <button
          type='button'
          data-bs-target='#heroCarousel'
          data-bs-slide-to='4'
          aria-label='Slide 5'
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
                  to='/classes'
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
                  On-Site & Online Classes
                </span>
              </h1>
              <p>
                <span className='carousel-text badge navy text-wrap p-3 text-end'>
                  On-Site & Online Classes to ensure that distance is never a
                  barrier to gaining quality education.
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
                  Internship Program
                </span>
              </h1>
              <p>
                <span className='carousel-text badge navy text-wrap text-start p-3'>
                  Internship Program that allows you to apply what you've
                  learned in real-world scenarios, invaluable for building your
                  resume & gaining practical skills that employers seek.
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
            src={Carousel4}
            alt='Carousel 4'
            className='bd-placeholder-img'
            width='100%'
            height='100%'
            loading='lazy'
          />
          <div className='container'>
            <div className='carousel-caption'>
              <h1>
                <span className='carousel-text badge navy p-3'>
                  Flexible Learning Schedule
                </span>
              </h1>
              <p>
                <span className='carousel-text badge navy text-wrap p-3'>
                  Flexible Learning Schedule that allow you to choose your
                  preferred class times & the number of sessions per week.
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
            src={Carousel5}
            alt='Carousel 5'
            className='bd-placeholder-img'
            width='100%'
            height='100%'
            loading='lazy'
          />
          <div className='container'>
            <div className='carousel-caption text-end'>
              <h1>
                <span className='carousel-text badge navy p-3'>
                  Real-World Projects
                </span>
              </h1>
              <p>
                <span className='carousel-text badge navy text-wrap text-end p-3'>
                  Real-World Projects that gives you the confidence & skills
                  needed to tackle real-world challenges.
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
