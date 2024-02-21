import { Link } from "react-router-dom";
import { IoHomeSharp, IoSchool, IoSettings } from "react-icons/io5";
import { FaShoppingCart, FaBlog, FaLock } from "react-icons/fa";
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
      <ul>
        <li>
          <Link to="/">
            <span className="span-icons">
              <IoHomeSharp />
            </span>
            Home
          </Link>
        </li>
        <li>
          <Link to="/courses">
            <span className="span-icons">
              <IoSchool />
            </span>
            Courses
          </Link>
        </li>
        <li>
          <Link to="/products">
            <span className="span-icons">
              <FaShoppingCart />
            </span>
            Products
          </Link>
        </li>
        <li>
          <Link to="/blog">
            <span className="span-icons">
              <FaBlog />
            </span>
            Blog
          </Link>
        </li>
        <li>
          <Link to="/student/settings">
            <span className="span-icons">
              <IoSettings />
            </span>
            Settings
          </Link>
        </li>
        <li>
          <Link to="#" role="button" onClick={signOut}>
            <span className="span-icons">
              <FaLock />
            </span>
            Sign out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StudentNavItems;
