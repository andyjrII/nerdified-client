import {
  FaHome,
  FaInbox,
  FaBook,
  FaTasks,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className='sidebar bg-light p-3'>
      <div className='logo mb-3'>
        <h3>Course Dashboard</h3>
      </div>
      <nav>
        <ul className='nav flex-column'>
          <li className='nav-item mb-2'>
            <FaHome /> Dashboard
          </li>
          <li className='nav-item mb-2'>
            <FaInbox /> Inbox
          </li>
          <li className='nav-item mb-2'>
            <FaBook /> Lessons
          </li>
          <li className='nav-item mb-2'>
            <FaTasks /> Tasks
          </li>
          <li className='nav-item mb-2'>
            <FaUser /> Profile
          </li>
          <li className='nav-item mb-2'>
            <FaCog /> Settings
          </li>
          <li className='nav-item mb-2'>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
