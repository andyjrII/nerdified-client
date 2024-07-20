import { Link } from 'react-router-dom';
import '../assets/styles/home.css';
import Marketing1 from '../assets/images/marketing/marketing-1.jpg';
import Marketing2 from '../assets/images/marketing/marketing-2.jpg';
import Navigation from '../components/navigation/Navigation';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import LatestBlogs from '../components/LatestBlogs';
import Testimonial from '../components/Testimonial';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <section>
      <Navigation />
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
              <div className='row justify-content-center'>
                <iframe
                  className='rounded-4'
                  style={{ border: 'none' }}
                  width='600'
                  height='400'
                  src='https://www.youtube.com/embed/819zkRMjn4k?si=1E5f2zphhW52I_6D'
                  title='Why Get Nerdified?'
                  referrerPolicy='strict-origin-when-cross-origin'
                  allowFullScreen
                ></iframe>
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
                      Practical Learning
                    </span>
                    <span className='section-heading-lower'>
                      LEARN TO CODE & BUILD AMAZING SOFTWARE
                    </span>
                  </h2>
                  <p className='mb-2'>
                    We are thrilled to have you consider joining our community
                    of learners. Our classes are designed to provide you with a
                    comprehensive & practical learning experience, tailored to
                    meet the needs of both on-site & distant learners.
                  </p>
                  <div className='intro-button mx-auto'>
                    <Link className='btn btn-xl text-white' to='about'>
                      Check us out
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
                    in high-demand technologies. Our classes cover the entire
                    web development spectrum, from design to deployment.
                  </p>
                  <div className='intro-button mx-auto'>
                    <Link className='btn btn-xl text-white' to='courses'>
                      Enroll now!
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className='page-section clearfix'>
            <div className='blog_section text-center'>
              <p className='h1'>
                <span className='badge text-white my-2 tomato'>
                  Latest Posts
                </span>
              </p>
              <LatestBlogs />
            </div>
          </section>

          <section className='page-section clearfix'>
            <div className='testimonial_section text-center'>
              <p className='h1'>
                <span className='badge text-white my-2 tomato'>
                  Testimonials
                </span>
              </p>
              <Testimonial />
            </div>
          </section>
        </section>
        <Footer />
      </main>
    </section>
  );
};

export default Home;
