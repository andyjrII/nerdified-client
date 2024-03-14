import { Link } from "react-router-dom";
import "../assets/styles/home.css";
import Marketing1 from "../assets/images/marketing/marketing-1.jpg";
import Marketing2 from "../assets/images/marketing/marketing-2.jpg";
import Navigation from "../components/navigation/Navigation";
import Footer from "../components/footer/Footer";
import Hero from "../components/carousels/Hero";
import Testimonial from "../components/carousels/Testimonial";
import { motion } from "framer-motion";
import { FaCertificate, FaLaptop, FaList, FaGlobe } from "react-icons/fa";

const Home = () => {
  return (
    <section className="home-bg">
      <Navigation />
      <main>
        <Hero />

        <section className="page-section">
          <p className="h1 mb-2 text-center">
            <span className="badge text-white my-2 tomato text-wrap">
              Why you should Get Nerdified!
            </span>
          </p>

          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-5 why-container rounded-3">
                <h2 className="why-h2 mb-4">
                  <FaCertificate className="why-icon" />
                  We have Expert Instructors
                </h2>
                <h2 className="why-h2">
                  <FaGlobe className="why-icon" />
                  Interactive Live Online Classes
                </h2>
              </div>
              <div className="col-md-5 why-container rounded-3">
                <h2 className="why-h2 mb-4">
                  <FaList className="why-icon" />
                  Structured Curriculum
                </h2>
                <h2 className="why-h2">
                  <FaLaptop className="why-icon" />
                  Practical Hands-On Projects
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section clearfix">
          <div className="container">
            <div className="intro">
              <motion.img
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ type: "tween", duration: 2 }}
                className="intro-img img-fluid mb-lg-0 rounded"
                src={Marketing1}
                alt="..."
                loading="lazy"
              />
              <motion.div
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ type: "tween", duration: 2 }}
                className="intro-text left-0 text-center bg-faded p-5 rounded"
              >
                <h2 className="section-heading mb-4">
                  <span className="section-heading-upper">CODING ACADEMY</span>
                  <span className="section-heading-lower">
                    LEARN TO CODE ONLINE & BUILD AMAZING SOFTWARE
                  </span>
                </h2>
                <p className="mb-3">
                  We offer a variety of online programming classes for all skill
                  levels, from beginner to advanced. Our classes are taught by
                  experienced & qualified instructors who will help you learn
                  the skills you need to build amazing software.
                </p>
                <div className="intro-button mx-auto">
                  <Link className="btn btn-xl text-white" to="courses">
                    Enroll now!
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="page-section clearfix">
          <div className="container">
            <div className="intro">
              <motion.img
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ type: "tween", duration: 2 }}
                className="intro-img img-fluid mb-lg-0 rounded"
                src={Marketing2}
                alt="..."
                loading="lazy"
              />
              <motion.div
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ type: "tween", duration: 2 }}
                className="intro-text left-0 text-center bg-faded p-5 rounded"
              >
                <h2 className="section-heading mb-4">
                  <span className="section-heading-upper">
                    Amazing Websites
                  </span>
                  <span className="section-heading-lower">
                    Build amazing websites at an affordable price
                  </span>
                </h2>
                <p className="mb-3">
                  We pride ourselves in building websites that meet clients'
                  needs. We believe that the best websites are the ones that are
                  tailored to each individual client. We'll work closely with
                  you to understand your business goals & create a site that's
                  both beautiful & functional.
                </p>
                <div className="intro-button mx-auto">
                  <Link
                    className="btn btn-xl text-white"
                    to="https://www.github.com/andyjrii"
                  >
                    Visit GitHub!
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="page-section clearfix">
          <div className="testimonial_section text-center">
            <p className="h1">
              <span className="badge text-white my-2 tomato">Testimonials</span>
            </p>
            <Testimonial />
          </div>
        </section>

        <Footer />
      </main>
    </section>
  );
};

export default Home;
