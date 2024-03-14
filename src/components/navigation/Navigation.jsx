import { Link } from "react-router-dom";
import { useEffect } from "react";
import { IoHomeSharp, IoSchool } from "react-icons/io5";
import { FaQuestion, FaBlog, FaUserGraduate } from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useStudent from "../../hooks/useStudent";
import "../../assets/styles/navigation.css";
import Logo from "../../assets/images/logo.png";

const Navigation = () => {
  const axios = useAxiosPrivate();

  const { student, setStudent } = useStudent();

  const email = localStorage.getItem("STUDENT_EMAIL");
  const access = localStorage.getItem("ACCESS_TOKEN");
  const refresh = localStorage.getItem("REFRESH_TOKEN");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`students/${email}`);
        setStudent(response?.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (email) fetchStudent();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark nerd-navbar-light navy">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={Logo} width="70" height="70" alt="<Nerdified />" />
          GET NERDIFIED
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ms-auto py-4 py-lg-0">
            <li className="nav-item me-2">
              <Link className="nav-link text-center" aria-current="page" to="/">
                <IoHomeSharp /> Home
              </Link>
            </li>

            <li className="nav-item me-2">
              <Link className="nav-link text-center" to="/courses">
                <IoSchool /> Courses
              </Link>
            </li>
            <li className="nav-item me-2">
              <Link className="nav-link text-center" to="/blog">
                <FaBlog /> Blog
              </Link>
            </li>
            <li className="nav-item me-2">
              <Link className="nav-link text-center" to="/about">
                <FaQuestion /> About
              </Link>
            </li>
            <div className="topbar-divider d-none d-sm-block"></div>

            {/*  Nav Item - User Information */}
            {access && refresh && email && (
              <li className="nav-item text-center">
                <Link
                  className="nav-link"
                  id="userDropdown"
                  role="button"
                  to="/student"
                >
                  <FaUserGraduate /> {student.name}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
