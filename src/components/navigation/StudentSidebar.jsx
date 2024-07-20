import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoSettings, IoMail, IoCall } from 'react-icons/io5';
import { FaHeart, FaSignOutAlt, FaUserGraduate } from 'react-icons/fa';
import { GrMap } from 'react-icons/gr';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useStudent from '../../hooks/useStudent';
import useLogout from '../../hooks/useLogout';

const StudentSidebar = () => {
  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem('STUDENT_EMAIL');

  const { student, setStudent } = useStudent();
  const [totalCount, setTotalCount] = useState(0);
  const [totalWishes, setTotalWishes] = useState(0);

  const fetchStudent = async () => {
    try {
      const response = await axiosPrivate.get(`students/${email}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      localStorage.setItem('STUDENT_ID', response?.data.id);
      await totalWishItems(response.data.id);
      setStudent(response?.data);
    } catch (error) {
      console.error('Error:', error);
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
      console.error('Error:', error);
    }
  };

  const totalCourses = async () => {
    try {
      const response = await axiosPrivate.get(`students/total/${email}`);
      setTotalCount(response?.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchStudent();
    totalCourses();
  }, []);

  const signOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className='nav-menu'>
      <ul className='mt-5'>
        <li>
          <Link
            title='Profile'
            role='button'
            data-bs-toggle='modal'
            data-bs-target='#studentProfile'
          >
            <span className='span-icons'>
              <FaUserGraduate />
            </span>
          </Link>
          {/*  Modal */}
          <div
            class='modal fade'
            id='studentProfile'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            tabindex='-1'
            aria-labelledby='studentProfileLabel'
            aria-hidden='true'
          >
            <div class='modal-dialog modal-dialog-centered'>
              <div class='modal-content'>
                <div class='modal-header'>
                  <h1 class='modal-title fs-5' id='studentProfileLabel'>
                    {student.name} Profile
                  </h1>
                  <button
                    type='button'
                    class='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div class='modal-body text-center'>
                  <div className='m-2'>
                    <button type='button' className='btn btn-primary mx-2'>
                      Courses{' '}
                      <span class='badge text-bg-secondary'>{totalCount}</span>
                    </button>
                    <button type='button' className='btn btn-primary mx-2'>
                      Wishlist{' '}
                      <span class='badge text-bg-secondary'>{totalWishes}</span>
                    </button>
                  </div>
                  <p className='d-inline-flex gap-1 m-2'>
                    <button
                      class='btn btn-primary'
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target='#email'
                      aria-expanded='false'
                      aria-controls='email'
                    >
                      <IoMail />
                    </button>
                    <button
                      class='btn btn-primary'
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
                  <div class='row'>
                    <div class='col'>
                      <div class='collapse multi-collapse' id='email'>
                        <div class='card card-body'>Email: {student.email}</div>
                      </div>
                    </div>
                    <div class='col'>
                      <div class='collapse multi-collapse' id='phoneNumber'>
                        <div class='card card-body'>
                          Phone: {student.phoneNumber}
                        </div>
                      </div>
                    </div>
                    <div class='col'>
                      <div class='collapse multi-collapse' id='address'>
                        <div class='card card-body'>
                          Address: {student.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class='modal-footer'>
                  <button
                    type='button'
                    class='btn'
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
          <Link to='/wishlist' title='Wishlist'>
            <span className='span-icons'>
              <FaHeart />
            </span>
          </Link>
        </li>
        <li>
          <Link to='/student/settings' title='Account Settings'>
            <span className='span-icons'>
              <IoSettings />
            </span>
          </Link>
        </li>
        <li>
          <Link role='button' onClick={signOut} title='Sign Out'>
            <span className='span-icons'>
              <FaSignOutAlt />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StudentSidebar;
