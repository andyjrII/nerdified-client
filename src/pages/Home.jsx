import { Link } from 'react-router-dom';
import '../assets/styles/home.css';
import Marketing1 from '../assets/images/marketing/marketing-1.jpg';
import Marketing2 from '../assets/images/marketing/marketing-2.jpg';
import Hero from '../components/Hero';
import LatestBlogs from '../components/LatestBlogs';
import Testimonial from '../components/Testimonial';
import { motion } from 'framer-motion';
import WhyEnrollFeatures from '../components/WhyEnrollFeatures';

const Home = () => {
  return (
    <main>
      <Hero />
      <section className='home-bg'>
        <section className='page-section'>
          <p className='h1 mb-2 text-center'>
            <span className='badge text-white my-2 tomato text-wrap'>
              Why Enroll in Our Programming Classes?
            </span>
          </p>

          <div className='container'>
            <WhyEnrollFeatures />
          </div>
        </section>

        <section className='page-section clearfix'>
          <div className='container'>
            <div className='intro'>
              <motion.img
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ type: 'tween', duration: 2 }}
                className='intro-img img-fluid mb-lg-0 rounded'
                src={Marketing1}
                alt='...'
                loading='lazy'
              />
              <motion.div
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ type: 'tween', duration: 2 }}
                className='intro-text left-0 text-center bg-faded p-5 rounded'
              >
                <h2 className='section-heading mb-2'>
                  <span className='section-heading-upper'>
                    High-Demand Technologies
                  </span>
                  <span className='section-heading-lower'>
                    Expand Your Skills with Our Expert-Led Classes
                  </span>
                </h2>
                <p className='mb-2'>
                  Enhance your programming skills with our specialized classes
                  in high-demand technologies. Our classes cover the entire web
                  development spectrum, from design to deployment.
                </p>
                <div className='intro-button mx-auto'>
                  <Link className='btn btn-xl text-white' to='courses'>
                    Check out our courses
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className='page-section clearfix'>
          <div className='container'>
            <div className='intro'>
              <motion.img
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ type: 'tween', duration: 2 }}
                className='intro-img img-fluid mb-lg-0 rounded'
                src={Marketing2}
                alt='...'
                loading='lazy'
              />
              <motion.div
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ type: 'tween', duration: 2 }}
                className='intro-text left-0 text-center bg-faded p-5 rounded'
              >
                <h2 className='section-heading mb-2'>
                  <span className='section-heading-upper'>
                    High-Demand Technologies
                  </span>
                  <span className='section-heading-lower'>
                    Expand Your Skills with Our Expert-Led Classes
                  </span>
                </h2>
                <p className='mb-2'>
                  Enhance your programming skills with our specialized classes
                  in high-demand technologies. Our classes cover the entire web
                  development spectrum, from design to deployment.
                </p>
                <div className='intro-button mx-auto'>
                  <Link className='btn btn-xl text-white' to='courses'>
                    Check out our courses
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className='page-section clearfix'>
          <div className='blog_section text-center'>
            <p className='h1'>
              <span className='badge text-white my-2 tomato'>Latest Posts</span>
            </p>
            <LatestBlogs />
          </div>
        </section>

        <section className='page-section clearfix'>
          <div className='testimonial_section text-center'>
            <p className='h1'>
              <span className='badge text-white my-2 tomato'>Testimonials</span>
            </p>
            <Testimonial />
          </div>
        </section>
      </section>
    </main>
  );
};

export default Home;
