import Footer from "../components/footer/Footer";
import Navigation from "../components/navigation/Navigation";
import PurposeImage from "../assets/images/navpages/about-purpose.jpg";
import ServiceImage from "../assets/images/navpages/about-service.jpg";
import FounderImage from "../assets/images/navpages/about-founder.jpg";
import "../assets/styles/navpages.css";

const About = () => {
  return (
    <>
      <Navigation />
      <header className='py-3 bg-light border-bottom header-bg'>
        <div className='container'>
          <div className='text-center my-3'>
            <p className='h1'>
              <span className='badge bg-danger'>About Us</span>
            </p>
          </div>
        </div>
      </header>
      <section className='page-section' id='about'>
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
                  <h4 className='subheading'>Our Purpose</h4>
                </div>
                <div className='timeline-body'>
                  <p className='text-muted'>
                    Most programming schools require your presence in a physical
                    venue or online pre-recorded videos/courses.
                  </p>
                  <p className='text-muted'>
                    &lt;NerdVille /&gt; bridges the distance between the tutor &
                    the student, making sure that anyone can learn without
                    distance being a barrier, & with our live online classes,
                    students can learn in realtime, that is, they can ask
                    questions & get answers in realtime.
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
                  <h4 className='subheading'>Our Services</h4>
                </div>
                <div className='timeline-body'>
                  <p className='text-muted'>
                    We provide online live programming classes that are more
                    practical than theory & are tailored for the absolute
                    beginner with no prior programming knowledge. We make sure
                    everyone is carried along & we only proceed to next topic
                    when everyone is on the same page.
                  </p>
                  <p className='text-muted'>
                    We also develop applications for individuals or businesses
                    irrespective of the platform. Our products gallery contains
                    samples of our applications.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className='timeline-image'>
                <img
                  className='rounded-circle img-fluid'
                  src={FounderImage}
                  alt='...'
                />
              </div>
              <div className='timeline-panel'>
                <div className='timeline-heading'>
                  <h4 className='subheading'>Our Founder</h4>
                </div>
                <div className='timeline-body'>
                  <p className='text-muted'>
                    &lt;NerdVille /&gt; is founded by{" "}
                    <span className='text-danger'>Andy James</span>, from Edo
                    State, Nigeria.
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
