import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaCopyright,
} from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import "../../assets/styles/footer.css";
import Logo from "../../assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="d-flex flex-wrap justify-content-between bg-black border-top">
      <div className="col-md-5 justify-content-start">
        <span className="mb-3 mb-md-0 text-white">
          <FaCopyright className="bi" /> Copyright 2024, made by
        </span>
        <Link
          to="/"
          className="me-2 mb-md-0 text-muted text-decoration-none lh-1"
        >
          <img src={Logo} width="100" height="100" alt="<NerdVified />" />
        </Link>
      </div>
      <ul className="nav col-md-6 justify-content-end list-unstyled my-auto">
        <li className="icon-list">
          <Link
            className="text-white"
            to="mailto:enehizenajames@gmail.com"
            target="_blank"
          >
            <GrMail id="gmail" />
          </Link>
        </li>
        <li className="icon-list">
          <Link
            className="text-white"
            to="https://www.linkedin.com/in/andyjr002/"
            target="_blank"
          >
            <FaLinkedin id="linkedin" />
          </Link>
        </li>
        <li className="icon-list">
          <Link
            className="text-white"
            to="https://www.facebook.com/nerdvilla"
            target="_blank"
          >
            <FaFacebook id="facebook" />
          </Link>
        </li>
        <li className="icon-list">
          <Link
            className="text-white"
            to="https://twitter.com/AndyJrII"
            target="_blank"
          >
            <FaTwitter id="twitter" />
          </Link>
        </li>
        <li className="icon-list">
          <Link
            className="text-white"
            to="https://www.instagram.com/andyjr_ii/"
            target="_blank"
          >
            <FaInstagram id="instagram" />
          </Link>
        </li>
        <li className="icon-list">
          <Link
            className="text-white"
            to="https://wa.me/2349063368647"
            target="_blank"
          >
            <FaWhatsapp id="whatsapp" />
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
