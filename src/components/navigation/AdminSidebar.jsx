import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  FaBlog,
  FaUserAlt,
  FaLock,
  FaDollarSign,
  FaLaughWink,
  FaBinoculars,
  FaEdit,
  FaPenAlt,
  FaAngleRight,
  FaUserGraduate,
} from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import useAdminLogout from "../../hooks/useAdminLogout";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import useAdmin from "../../hooks/useAdmin";

const AdminSidebar = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAdminLogout();

  const email = localStorage.getItem("ADMIN_EMAIL");
  const role = localStorage.getItem("ROLE");

  const { admin, setAdmin } = useAdmin();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axiosPrivate.get(`admin/${email}`);
        setAdmin(response?.data);
      } catch (error) {
        console.error("Error:", error);
        navigate("/admin_signin", {
          state: { from: location },
          replace: true,
        });
      }
    };
    fetchAdmin();
  }, []);

  const signOut = async () => {
    await logout();
    navigate("/admin_signin");
  };

  return (
    <ul
      className="navbar-nav bg-gradient-dark sidebar accordion"
      id="accordionSidebar"
    >
      <Link
        className="sidebar-brand d-flex align-items-center justify-content-center"
        to="/admin"
      >
        <div className="sidebar-brand-icon rotate-n-15">
          <FaLaughWink />
        </div>
        <div className="sidebar-brand-text mx-3">{admin.name}</div>
      </Link>

      <hr className="sidebar-divider bg-white" />

      {/* Nav Item - Pages Collapse Menu */}

      <li className="nav-item">
        <Link
          className="nav-link collapsed"
          data-bs-toggle="collapse"
          data-bs-target="#courses"
          aria-expanded="false"
          aria-controls="courses"
        >
          <IoSchool className="mr-2" />
          <span>Courses</span>
          <FaAngleRight className="angle" />
        </Link>
        <div
          id="courses"
          className="collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <Link className="collapse-item" to="/admin_courses">
              <FaBinoculars className="inner-icon" />
              View
            </Link>
            <Link className="collapse-item" to="/admin_new_course">
              <FaPenAlt className="inner-icon" />
              Create
            </Link>
            <Link className="collapse-item" to="/admin_update_course">
              <FaEdit className="inner-icon" />
              Edit
            </Link>
          </div>
        </div>
      </li>

      <li className="nav-item">
        <Link
          className="nav-link collapsed"
          data-bs-toggle="collapse"
          data-bs-target="#blog-posts"
          aria-expanded="false"
          aria-controls="blog-posts"
        >
          <FaBlog className="mr-2" />
          <span>Blog Posts</span>
          <FaAngleRight className="angle" />
        </Link>
        <div
          id="blog-posts"
          className="collapse"
          aria-labelledby="headingThree"
          data-bs-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <Link className="collapse-item" to="/admin_blog_posts">
              <FaBinoculars className="inner-icon" />
              View
            </Link>
            <Link className="collapse-item" to="/admin_new_post">
              <FaPenAlt className="inner-icon" />
              Create
            </Link>
            <Link className="collapse-item" to="/admin_update_post">
              <FaEdit className="inner-icon" />
              Edit
            </Link>
          </div>
        </div>
      </li>

      <li className="nav-item">
        <Link className="nav-link collapsed" to="/admin_students">
          <FaUserGraduate className="mr-2" />
          <span>Students</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link collapsed" to="/admin_course_payment">
          <FaDollarSign className="mr-2" />
          <span>Payments</span>
        </Link>
      </li>

      <hr className="sidebar-divider bg-white" />

      {/* Nav Item - Admins */}
      {role === "SUPER" && (
        <>
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#admins"
              aria-expanded="false"
              aria-controls="admins"
            >
              <i className="mr-2">
                <FaUserAlt />
              </i>
              <span>Admins</span>
              <FaAngleRight className="angle" />
            </Link>
            <div
              id="admins"
              className="collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <span className="inner-text ml-2">admins: </span>
                <Link className="collapse-item" to="/admin_all">
                  <FaBinoculars className="inner-icon" />
                  View
                </Link>
                <Link className="collapse-item" to="/admin_new_admin">
                  <FaPenAlt className="inner-icon" />
                  Create
                </Link>
              </div>
            </div>
          </li>
          <hr className="sidebar-divider bg-white" />
        </>
      )}

      {/* Nav Item - Sign Out */}
      <li className="nav-item">
        <Link className="nav-link collapsed" role="button" onClick={signOut}>
          <FaLock className="mr-2" />
          <span>Sign Out</span>
        </Link>
      </li>
    </ul>
  );
};

export default AdminSidebar;
