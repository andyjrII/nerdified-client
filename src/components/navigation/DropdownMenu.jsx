import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMale,
  faHeart,
  faImage,
  faEdit,
  faSignOut,
  faDashboard,
} from '@fortawesome/free-solid-svg-icons';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import storage from '../../utils/storage';
import useStudent from '../../hooks/useStudent';
import useLogout from '../../hooks/useLogout';
import PasswordChange from '../forms/PasswordChange';
import ImageChange from '../forms/ImageChange';
import DPDefault from '../../assets/images/navpages/person_profile.jpg';
import InfoModal from '../modals/InfoModal';

const DropdownMenu = ({ image }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const { student, setStudent } = useStudent();

  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }

    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const response = await axiosPrivate.get(`students/${auth.email}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      await getWishlist(response.data.id);
      setStudent(response?.data);
    } catch (error) {
      console.error('Error fetching Student Profile');
      navigate('/signin', { state: { from: location }, replace: true });
    }
  };

  const getWishlist = async (studentId) => {
    try {
      const response = await axiosPrivate.get(`wishlist/${studentId}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setWishlist(response?.data);
    } catch (error) {
      console.error('Error getting Wishlist');
    }
  };

  const handleRemove = async (email, courseId) => {
    try {
      await axiosPrivate.delete(
        'wishlist/remove',
        { data: { email, courseId } },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      alert('Course successfully removed!');
      getWishlist(student.id);
    } catch (error) {
      alert('Error removing Course');
    }
  };

  const handleCourseView = async (course) => {
    localStorage.setItem('NERDVILLE_COURSE', JSON.stringify(course));
    navigate('/course-details');
  };

  const signOut = async () => {
    await logout();
    navigate('/');
  };

  const displayWishlist = wishlist.map((wish) => {
    return (
      <tr key={wish.id} className='text-white'>
        <td>{wish.course.title}</td>
        <td>
          <GrView
            role='button'
            tabIndex='0'
            title='View Course'
            data-bs-dismiss='modal'
            onClick={() => handleCourseView(wish.course)}
          />
        </td>
        <td>
          <FaHeart
            role='button'
            tabIndex='0'
            title='Remove from Wishlist'
            className='text-danger'
            onClick={() => handleRemove(auth.email, wish.courseId)}
          />
        </td>
      </tr>
    );
  });

  return (
    <>
      <Link
        className='userDropdown dropdown-toggle text-white'
        id='userDropdown'
        data-bs-toggle='dropdown'
        aria-expanded='false'
      >
        <img src={!image ? DPDefault : image} alt='Student' className='dp' />
      </Link>
      <ul className='dropdown-menu dropdown-menu-dark navy shadow'>
        <li>
          <Link
            className='dropdown-item d-flex gap-2 align-items-center'
            to='/student'
          >
            <FontAwesomeIcon
              icon={faDashboard}
              className='me-2'
              width='16'
              height='16'
            />
            Dashboard
          </Link>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li>
          <Link
            className='dropdown-item d-flex gap-2 align-items-center'
            role='button'
            data-bs-toggle='modal'
            data-bs-target='#studentProfile'
          >
            <FontAwesomeIcon
              icon={faMale}
              className='me-2'
              width='16'
              height='16'
            />
            {student.name}
          </Link>
          {/*  Profile Modal */}
          <InfoModal
            email={student.email}
            phoneNumber={student.phoneNumber}
            address={student.address}
          />
        </li>
        <li>
          <Link
            className='dropdown-item d-flex gap-2 align-items-center'
            role='button'
            data-bs-toggle='modal'
            data-bs-target='#wishlist'
          >
            <FontAwesomeIcon
              icon={faHeart}
              className='me-2'
              width='16'
              height='16'
            />
            Wishlist
          </Link>
          {/* Wishlist Modal */}
          <div
            className='modal fade'
            id='wishlist'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            tabIndex='-1'
            aria-labelledby='wishlistLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h1 className='modal-title fs-5' id='wishlistLabel'>
                    My Wishlist
                  </h1>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body'>
                  <table className='table table-responsive'>
                    {/* Display Wishlist */}
                    <tbody>{displayWishlist}</tbody>
                  </table>
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn'
                    id='btn-profile'
                    data-bs-dismiss='modal'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li>
          <Link
            className='dropdown-item d-flex gap-2 align-items-center'
            role='button'
            data-bs-toggle='modal'
            data-bs-target='#accountSettings'
          >
            <FontAwesomeIcon
              icon={faEdit}
              className='me-2'
              width='16'
              height='16'
            />
            Edit
          </Link>
          {/* Account Settings Modal */}
          <div
            className='modal fade'
            id='accountSettings'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            tabIndex='-1'
            aria-labelledby='accountSettingsLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h1 className='modal-title fs-5' id='accountSettingsLabel'>
                    My Settings
                  </h1>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body'>
                  {/* Password & profile picture change accordion */}
                  <div
                    className='accordion accordion-flush'
                    id='accordionSettings'
                  >
                    <div className='accordion-item'>
                      <h2 className='accordion-header'>
                        <button
                          className='accordion-button collapsed'
                          type='button'
                          data-bs-toggle='collapse'
                          data-bs-target='#passwordSettings'
                          aria-expanded='false'
                          aria-controls='passwordSettings'
                        >
                          Change Password
                        </button>
                      </h2>
                      <div
                        id='passwordSettings'
                        className='accordion-collapse collapse'
                        data-bs-parent='#accordionSettings'
                      >
                        <div>
                          <PasswordChange />
                        </div>
                      </div>
                    </div>
                    <div className='accordion-item'>
                      <h2 className='accordion-header'>
                        <button
                          className='accordion-button collapsed'
                          type='button'
                          data-bs-toggle='collapse'
                          data-bs-target='#pictureSettings'
                          aria-expanded='false'
                          aria-controls='pictureSettings'
                        >
                          Change Picture
                        </button>
                      </h2>
                      <div
                        id='pictureSettings'
                        className='accordion-collapse collapse'
                        data-bs-parent='#accordionSettings'
                      >
                        <div>
                          <ImageChange />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn'
                    id='btn-profile'
                    data-bs-dismiss='modal'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li>
          <Link
            className='dropdown-item d-flex gap-2 align-items-center'
            role='button'
            onClick={signOut}
          >
            <FontAwesomeIcon
              icon={faSignOut}
              className='me-2'
              width='16'
              height='16'
            />
            Sign Out
          </Link>
        </li>
      </ul>
    </>
  );
};

export default DropdownMenu;
