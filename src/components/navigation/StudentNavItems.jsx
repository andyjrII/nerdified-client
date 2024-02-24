import { Link } from "react-router-dom";
import { IoHomeSharp, IoSettings } from "react-icons/io5";
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
          <Link to="/" title="Home">
            <span className="span-icons">
              <IoHomeSharp />
            </span>
          </Link>
        </li>
      </ul>
      <ul className="middle-nav">
        <li>
          <Link to="/products" title="Products">
            <span className="span-icons">
              <FaShoppingCart />
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
      </ul>
      <ul className="bottom-nav">
        <li>
          <Link to="#" role="button" onClick={signOut} title="Sign Out">
            <span className="span-icons">
              <FaLock />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StudentNavItems;