import Footer from '../components/Footer';
import Navigation from '../components/navigation/Navigation';
import PurposeImage from '../assets/images/navpages/about-purpose.jpeg';
import ServiceImage from '../assets/images/navpages/about-service.jpeg';
import '../assets/styles/navpages.css';

const About = () => {
  return (
    <>
      <Navigation />
      <header className='py-3 border-bottom header-bg'>
        <div className='container'>
          <div className='text-center my-3'>
            <p className='h1'>
              <span className='badge bg-danger'>About Us</span>
            </p>
          </div>
        </div>
      </header>
      <section className='p-5' id='about'>
        <div className='container'>
          <ul className='timeline'>
            <li>
              <div className='timeline-image'>
                <img
                  className='rounded-circle img-fluid'
                  src={PurposeImage}
                  alt='...'
                />
              </div>
              <div className='timeline-panel'>
                <div className='timeline-heading'>
                  <h3 className='subheading'>Our Vision</h3>
                </div>
                <div className='timeline-body'>
                  <p>
                    Empowering Africa's tech potential for a sustainable and
                    prosperous future.
                  </p>
                </div>
              </div>
            </li>
            <li className='timeline-inverted'>
              <div className='timeline-image'>
                <img
                  className='rounded-circle img-fluid'
                  src={ServiceImage}
                  alt='...'
                />
              </div>
              <div className='timeline-panel'>
                <div className='timeline-heading'>
                  <h3 className='subheading'>Our Mission</h3>
                </div>
                <div className='timeline-body'>
                  <p>
                    Building a nerd culture in Africa by unlocking Africa's
                    potential through technology and education, to drive digital
                    transformation, economic growth & sustainable development.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
