import '../assets/styles/student.css';
import { useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import useStudent from '../hooks/useStudent';
import storage from '../utils/storage';
import Moment from 'react-moment';
import Navigation from '../components/navigation/Navigation';
import Footer from '../components/Footer';
import Welcome from '../components/Welcome';
import EnrolledCourses from '../components/EnrolledCourses';
import NewestCourses from '../components/NewestCourses';
import MostEnrolled from '../components/MostEnrolled';
import CourseTotals from '../components/CourseTotals';
import { FaClock, FaEnvelope, FaLocationArrow, FaPhone } from 'react-icons/fa';

const Student = () => {
  const axiosPrivate = useAxiosPrivate();

  const { auth, setAuth } = useAuth();
  const { student, setStudent } = useStudent(null);

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }

    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const response = await axiosPrivate.get(`students/${auth.email}`);
      setStudent(response?.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Navigation />
      <section id='student-section' className='border-top border-bottom'>
        <main id='student-main' className='mx-3 mb-3 pb-2'>
          <div class='container text-center mt-3'>
            <div className='row align-items-start'>
              <div class='col'>
                <button type='button' class='btn btn-primary'>
                  {student.email}{' '}
                  <span class='badge navy'>
                    <FaEnvelope />
                  </span>
                </button>
              </div>
              <div class='col'>
                <button type='button' class='btn btn-primary'>
                  {student.phoneNumber}{' '}
                  <span class='badge navy'>
                    <FaPhone />
                  </span>
                </button>
              </div>
              <div class='col'>
                <button type='button' class='btn btn-primary'>
                  {student.address}{' '}
                  <span class='badge navy'>
                    <FaLocationArrow />
                  </span>
                </button>
              </div>
              <div class='col'>
                <button
                  type='button'
                  class='btn btn-primary'
                  title='Account Created On'
                >
                  <Moment format='MMMM D, YYYY'>{student.createdAt}</Moment>{' '}
                  <span class='badge navy'>
                    <FaClock />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className='p-3 mx-5'>
            <Welcome name={student.name} />
          </div>

          <CourseTotals />

          <div className='p-3 m-3 shadow rounded'>
            <EnrolledCourses />
          </div>

          <div className='p-3 m-3 shadow rounded'>
            <MostEnrolled />
          </div>

          <div className='p-3 m-3 shadow rounded'>
            <NewestCourses />
          </div>
        </main>
      </section>
      <Footer />
    </>
  );
};

export default Student;
