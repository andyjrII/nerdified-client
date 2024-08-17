import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FaBlog,
  FaUserAlt,
  FaLock,
  FaDollarSign,
  FaLaughWink,
  FaBinoculars,
  FaPenAlt,
  FaAngleRight,
  FaUserGraduate,
} from 'react-icons/fa';
import { IoSchool } from 'react-icons/io5';
import useAdminLogout from '../../hooks/useAdminLogout';
import useAdminAxiosPrivate from '../../hooks/useAdminAxiosPrivate';
import useAdmin from '../../hooks/useAdmin';
import db from '../../utils/localBase';

const AdminSidebar = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const { admin, setAdmin } = useAdmin();
  const navigate = useNavigate();
  const logout = useAdminLogout();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchEmail();
        if (email) {
          await fetchAdmin();
          console.log(admin.name, admin.role);
        }
      } catch (error) {
        console.error('Error fetching email from localBase:', error);
      }
    };

    initializeData();
  }, []);

  const fetchEmail = async () => {
    const data = await db.collection('auth_admin').get();
    setEmail(data[0].email);
  };

  const fetchAdmin = async () => {
    try {
      const response = await axiosPrivate.get(`admin/${email}`);
      setAdmin(response?.data);
    } catch (error) {
      console.error('Error:', error);
      const localAdmin = await db.collection('admin').doc(email).get();
      setAdmin(localAdmin);
    }
  };

  const signOut = async () => {
    await logout();
    navigate('/admin/signin');
  };

  return (
    <ul
      className='navbar-nav bg-gradient-dark sidebar accordion'
      id='accordionSidebar'
    >
      <Link
        className='sidebar-brand d-flex align-items-center justify-content-center'
        to='/admin'
      >
        <div className='sidebar-brand-icon rotate-n-15'>
          <FaLaughWink />
        </div>
        <div className='sidebar-brand-text mx-3'>{admin.name}</div>
      </Link>

      <hr className='sidebar-divider bg-white' />

      {/* Nav Item - Pages Collapse Menu */}

      <li className='nav-item'>
        <Link
          className='nav-link collapsed'
          data-bs-toggle='collapse'
          data-bs-target='#courses'
          aria-expanded='false'
          aria-controls='courses'
        >
          <IoSchool className='mr-2' />
          <span>Courses</span>
          <FaAngleRight className='angle' />
        </Link>
        <div
          id='courses'
          className='collapse'
          aria-labelledby='headingOne'
          data-bs-parent='#accordionSidebar'
        >
          <div className='py-2 collapse-inner rounded'>
            <Link className='collapse-item' to='/admin/courses'>
              <FaBinoculars className='inner-icon' />
              View
            </Link>
            <Link className='collapse-item' to='/admin/courses/new'>
              <FaPenAlt className='inner-icon' />
              Create
            </Link>
          </div>
        </div>
      </li>

      <li className='nav-item'>
        <Link
          className='nav-link collapsed'
          data-bs-toggle='collapse'
          data-bs-target='#blog-posts'
          aria-expanded='false'
          aria-controls='blog-posts'
        >
          <FaBlog className='mr-2' />
          <span>Blog Posts</span>
          <FaAngleRight className='angle' />
        </Link>
        <div
          id='blog-posts'
          className='collapse'
          aria-labelledby='headingThree'
          data-bs-parent='#accordionSidebar'
        >
          <div className='py-2 collapse-inner rounded'>
            <Link className='collapse-item' to='/admin/posts'>
              <FaBinoculars className='inner-icon' />
              View
            </Link>
            <Link className='collapse-item' to='/admin/posts/new'>
              <FaPenAlt className='inner-icon' />
              Create
            </Link>
          </div>
        </div>
      </li>

      <li className='nav-item'>
        <Link className='nav-link collapsed' to='/admin/students'>
          <FaUserGraduate className='mr-2' />
          <span>Students</span>
        </Link>
      </li>

      <li className='nav-item'>
        <Link className='nav-link collapsed' to='/admin/courses/payment'>
          <FaDollarSign className='mr-2' />
          <span>Payments</span>
        </Link>
      </li>

      <hr className='sidebar-divider bg-white' />

      {/* Nav Item - Admins */}
      {admin.role === 'SUPER' && (
        <>
          <li className='nav-item'>
            <Link
              className='nav-link collapsed'
              data-bs-toggle='collapse'
              data-bs-target='#admins'
              aria-expanded='false'
              aria-controls='admins'
            >
              <i className='mr-2'>
                <FaUserAlt />
              </i>
              <span>Admins</span>
              <FaAngleRight className='angle' />
            </Link>
            <div
              id='admins'
              className='collapse'
              aria-labelledby='headingThree'
              data-bs-parent='#accordionSidebar'
            >
              <div className='py-2 collapse-inner rounded'>
                <Link className='collapse-item' to='/admins'>
                  <FaBinoculars className='inner-icon' />
                  View
                </Link>
                <Link className='collapse-item' to='/admins/new'>
                  <FaPenAlt className='inner-icon' />
                  Create
                </Link>
              </div>
            </div>
          </li>
          <hr className='sidebar-divider bg-white' />
        </>
      )}

      {/* Nav Item - Sign Out */}
      <li className='nav-item'>
        <Link className='nav-link collapsed' role='button' onClick={signOut}>
          <FaLock className='mr-2' />
          <span>Sign Out</span>
        </Link>
      </li>
    </ul>
  );
};

export default AdminSidebar;
