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

        <section className="page-section bg-transparent rounded">
          <p className="h1 mb-2 text-center">
            <span className="badge text-white my-2 tomato">
              Why you should Get Nerdified!
            </span>
          </p>

          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-5 navy p-5 rounded-3">
                <h2 className="text-white mb-4">
                  <FaCertificate className="why-icon" />
                  We have Expert Instructors
                </h2>
                <h2 className="text-white mb-4">
                  <FaGlobe className="why-icon" />
                  Interactive Live Online Classes
                </h2>
                <h2 className="text-white mb-4">
                  <FaList className="why-icon" />
                  Structured Curriculum
                </h2>
                <h2 className="text-white">
                  <FaLaptop className="why-icon" />
                  Practical Hands-On Projects
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section clearfix bg-transparent">
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

        <section className="page-section clearfix bg-transparent">
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
                  <span className="section-heading-upper">App Gallery</span>
                  <span className="section-heading-lower">
                    Visit our app Gallery for amazing apps
                  </span>
                </h2>
                <p className="mb-3">
                  We also develop apps for various platforms to meet your needs.
                  Visit our app gallery for samples of apps developed by our
                  team. Our products are designed to help you be more productive
                  and efficient in your work.
                </p>
                <div className="intro-button mx-auto">
                  <Link className="btn btn-xl text-white" to="/products">
                    Visit Gallery!
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="page-section clearfix shadow m-5 rounded navy">
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
