import Footer from "../components/footer/Footer";
import Navigation from "../components/navigation/Navigation";
import PurposeImage from "../assets/images/navpages/about-purpose.jpg";
import ServiceImage from "../assets/images/navpages/about-service.jpg";
import "../assets/styles/navpages.css";

const About = () => {
  return (
    <>
      <Navigation />
      <header className="py-3 bg-light border-bottom header-bg">
        <div className="container">
          <div className="text-center my-3">
            <p className="h1">
              <span className="badge bg-danger">About Us</span>
            </p>
          </div>
        </div>
      </header>
      <section className="page-section" id="about">
        <div className="container">
          <ul className="timeline">
            <li>
              <div className="timeline-image">
                <img
                  className="rounded-circle img-fluid"
                  src={PurposeImage}
                  alt="..."
                />
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h4 className="subheading">Our Purpose</h4>
                </div>
                <div className="timeline-body">
                  <p className="text-muted">
                    Most programming schools require your presence in a physical
                    venue or just provide pre-recorded videos & text-based
                    courses.
                  </p>
                  <p className="text-muted">
                    Here at &lt;Nerdified /&gt;, our aim is to bridge the
                    distance between the tutor & the student, making sure that
                    distance is not a barrier, & with our live online classes,
                    students can learn, ask questions & get answers to their
                    questions in realtime.
                  </p>
                </div>
              </div>
            </li>
            <li className="timeline-inverted">
              <div className="timeline-image">
                <img
                  className="rounded-circle img-fluid"
                  src={ServiceImage}
                  alt="..."
                />
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h4 className="subheading">Our Services</h4>
                </div>
                <div className="timeline-body">
                  <p className="text-muted">
                    We provide live online programming classes that are more
                    practical than theory & are tailored for the absolute
                    beginner with no prior programming knowledge. We make sure
                    everyone is carried along & we only proceed to next topic
                    when everyone is on the same page.
                  </p>
                  <p className="text-muted">
                    We just don't teach how to code, we make sure all our
                    students code by giving them projects to work on thereby
                    making them see the applications of what they are learning &
                    making sure they utilize all they have learnt.
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
