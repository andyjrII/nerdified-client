import { Link } from "react-router-dom";
import { IoHomeSharp, IoSettings, IoSchool } from "react-icons/io5";
import { FaBlog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

const StudentNavItems = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="nav-menu">
      <ul className="mt-3">
        <li>
          <Link to="/" title="Home">
            <span className="span-icons">
              <IoHomeSharp />
            </span>
          </Link>
        </li>
        <li className="mt-5">
          <Link to="/courses" title="Courses">
            <span className="span-icons">
              <IoSchool />
            </span>
          </Link>
        </li>
        <li>
          <Link to="/blog" title="Blog">
            <span className="span-icons">
              <FaBlog />
            </span>
          </Link>
        </li>
        <li>
          <Link to="/student/settings" title="Settings">
            <span className="span-icons">
              <IoSettings />
            </span>
          </Link>
        </li>
        <li className="mt-5">
          <Link role="button" onClick={signOut} title="Sign Out">
            <span className="span-icons">
              <FaSignOutAlt />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StudentNavItems;
