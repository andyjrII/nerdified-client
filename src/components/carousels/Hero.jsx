import { Link } from "react-router-dom";
import Carousel1 from "../../assets/images/hero/carousel-bg-1.jpg";
import Carousel2 from "../../assets/images/hero/carousel-bg-2.jpg";
import Carousel3 from "../../assets/images/hero/carousel-bg-3.jpg";
import Carousel4 from "../../assets/images/hero/carousel-bg-4.jpg";
import Carousel5 from "../../assets/images/hero/carousel-bg-5.jpg";

const Hero = () => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const email = localStorage.getItem("STUDENT_EMAIL");

  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="3"
          aria-label="Slide 4"
        ></button>
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="4"
          aria-label="Slide 5"
        ></button>
      </div>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src={Carousel1}
            alt="Carousel 1"
            className="bd-placeholder-img"
            width="100%"
            height="100%"
            loading="lazy"
          />
          <div className="container">
            <div className="carousel-caption">
              <h1>
                <span className="carousel-text badge navy p-3">
                  Nerdified Coding Academy
                </span>
              </h1>
              <p>
                <span className="carousel-text badge navy text-wrap p-3">
                  Welcome to &lt;Nerdified/&gt; Coding Academy, a place where
                  Nerds are made!
                </span>
              </p>
              <p>
                <Link
                  className="btn btn-lg me-1 carousel-button"
                  to={accessToken && email ? "/student" : "/signup"}
                  role="button"
                >
                  {accessToken && email ? "Profile" : "Register Now"}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src={Carousel2}
            alt="Carousel 2"
            className="bd-placeholder-img"
            width="100%"
            height="100%"
            loading="lazy"
          />
          <div className="container">
            <div className="carousel-caption text-end">
              <h1>
                <span className="carousel-text badge text-wrap navy p-3">
                  Interactive Live Online Classes
                </span>
              </h1>
              <p>
                <span className="carousel-text badge navy text-wrap p-3 text-end">
                  Immerse yourself in our live classes, where direct interaction
                  with instructors is integral to the learning experience.
                  Real-time problem-solving is a key feature & distance is not a
                  barrier
                </span>
              </p>
              <p>
                <Link className="btn btn-lg carousel-button" to="/courses">
                  Enroll Now
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src={Carousel3}
            alt="Carousel 3"
            className="bd-placeholder-img"
            width="100%"
            height="100%"
            loading="lazy"
          />
          <div className="container">
            <div className="carousel-caption text-start">
              <h1>
                <span className="carousel-text badge navy p-3">
                  Structured Curriculum
                </span>
              </h1>
              <p>
                <span className="carousel-text badge navy text-wrap text-start p-3">
                  Our carefully crafted curriculum takes you on a logical
                  journey through the world of coding. From foundational
                  concepts to specialized topics, every module is designed to
                  build your skills incrementally
                </span>
              </p>
              <p>
                <Link className="btn btn-lg carousel-button" to="/courses">
                  Check it Out
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src={Carousel4}
            alt="Carousel 4"
            className="bd-placeholder-img"
            width="100%"
            height="100%"
            loading="lazy"
          />
          <div className="container">
            <div className="carousel-caption">
              <h1>
                <span className="carousel-text badge navy p-3">
                  Expert Instructors
                </span>
              </h1>
              <p>
                <span className="carousel-text badge navy text-wrap p-3">
                  Our coding academy is led by seasoned industry professionals
                  who bring a wealth of experience to the virtual classroom.
                  Their commitment to quality education ensures that our
                  students receive top-notch instruction
                </span>
              </p>
              <p>
                <Link className="btn btn-lg carousel-button" to="/courses">
                  Start Learning
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src={Carousel5}
            alt="Carousel 5"
            className="bd-placeholder-img"
            width="100%"
            height="100%"
            loading="lazy"
          />
          <div className="container">
            <div className="carousel-caption text-end">
              <h1>
                <span className="carousel-text badge navy p-3">
                  Practical Hands-On Projects
                </span>
              </h1>
              <p>
                <span className="carousel-text badge navy text-wrap text-end p-3">
                  Theory meets practice in our academy. Expect to work on
                  hands-on projects that mirror real-world scenarios, applying
                  the knowledge gained in class to solve tangible problems
                </span>
              </p>
              <p>
                <Link className="btn btn-lg carousel-button" to="/courses">
                  Get Started
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Hero;
