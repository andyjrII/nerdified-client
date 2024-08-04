import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoMail, IoCall } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { FcSettings, FcLock, FcLike, FcBusinessman } from 'react-icons/fc';
import { GrMap, GrView } from 'react-icons/gr';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import storage from '../../utils/storage';
import useStudent from '../../hooks/useStudent';
import useLogout from '../../hooks/useLogout';
import PasswordChange from '../forms/PasswordChange';
import ImageChange from '../forms/ImageChange';

const StudentSidebar = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const { student, setStudent } = useStudent();

  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const [totalWishes, setTotalWishes] = useState(0);
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
      await totalWishItems(response.data.id);
      await getWishlist(response.data.id);
      setStudent(response?.data);
    } catch (error) {
      console.error('Error fetching Student Profile');
      navigate('/signin', { state: { from: location }, replace: true });
    }
  };

  const totalWishItems = async (studentId) => {
    try {
      const response = await axiosPrivate.get(`wishlist/total/${studentId}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setTotalWishes(response?.data);
    } catch (error) {
      console.error('Error getting total Wishlist items');
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

  const handleRemove = async (studentId, courseId) => {
    try {
      await axiosPrivate.delete(
        'wishlist/remove',
        { data: { studentId, courseId } },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      alert('Course successfully removed!');
      getWishlist(studentId);
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
            onClick={() => handleRemove(student.id, wish.courseId)}
          />
        </td>
      </tr>
    );
  });

  return (
    <div className='floating-nav'>
      <ul className='mt-5'>
        <li>
          <Link
            title='Profile'
            role='button'
            data-bs-toggle='modal'
            data-bs-target='#studentProfile'
          >
            <span className='span-icons'>
              <FcBusinessman />
            </span>
          </Link>
          {/*  Profile Modal */}
          <div
            className='modal fade'
            id='studentProfile'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            tabIndex='-1'
            aria-labelledby='studentProfileLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-dialog-centered'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h1 className='modal-title fs-5' id='studentProfileLabel'>
                    My Profile
                  </h1>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body text-center'>
                  <p className='d-inline-flex gap-1 m-2'>
                    <button
                      className='btn btn-primary'
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target='#email'
                      aria-expanded='false'
                      aria-controls='email'
                    >
                      <IoMail />
                    </button>
                    <button
                      className='btn btn-primary'
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target='#phoneNumber'
                      aria-expanded='false'
                      aria-controls='phoneNumber'
                    >
                      <IoCall />
                    </button>
                    <button
                      className='btn btn-primary'
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target='#address'
                      aria-expanded='false'
                      aria-controls='address'
                    >
                      <GrMap />
                    </button>
                  </p>
                  <div className='row'>
                    <div className='col'>
                      <div className='collapse multi-collapse' id='email'>
                        <div className='card card-body'>
                          Email: {student.email}
                        </div>
                      </div>
                    </div>
                    <div className='col'>
                      <div className='collapse multi-collapse' id='phoneNumber'>
                        <div className='card card-body'>
                          Phone: {student.phoneNumber}
                        </div>
                      </div>
                    </div>
                    <div className='col'>
                      <div className='collapse multi-collapse' id='address'>
                        <div className='card card-body'>
                          Address: {student.address}
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
          <Link
            title='Wishlist'
            role='button'
            data-bs-toggle='modal'
            data-bs-target='#wishlist'
          >
            <span className='span-icons'>
              <FcLike />
            </span>
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
                  <button type='button' className='btn btn-primary m-2'>
                    Wishlist{' '}
                    <span className='badge text-bg-secondary'>
                      {totalWishes}
                    </span>
                  </button>
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
            to='/student/settings'
            title='Account Settings'
            role='button'
            data-bs-toggle='modal'
            data-bs-target='#accountSettings'
          >
            <span className='span-icons'>
              <FcSettings />
            </span>
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
          <Link role='button' onClick={signOut} title='Sign Out'>
            <span className='span-icons'>
              <FcLock />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StudentSidebar;
