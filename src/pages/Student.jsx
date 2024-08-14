import '../assets/styles/student.css';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';
import Welcome from '../components/Welcome';
import EnrolledCourses from '../components/EnrolledCourses';
import NewestCourses from '../components/NewestCourses';
import MostEnrolled from '../components/MostEnrolled';
import CourseTotals from '../components/CourseTotals';
import { FaClock, FaEnvelope, FaPhone } from 'react-icons/fa';
import { IoLocation } from 'react-icons/io5';
import db from '../utils/localBase';
import Spinners from '../components/Spinners';

const Student = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState('');
  const [student, setStudent] = useState();

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail(); // Fetch and set email
        if (email) {
          await fetchStudent(); // Fetch student data using the email
        }
      } catch (error) {
        console.log('Error during initialization:', error);
      }
    };

    initialize();
  }, [email]);

  const fetchEmail = async () => {
    const data = await db.collection('auth_student').get();
    setEmail(data[0].email);
  };

  const fetchStudent = async () => {
    if (!email) {
      console.error('Email is not set, cannot fetch student.');
      return;
    }
    try {
      const response = await axiosPrivate.get(`students/${email}`);
      const studentData = response?.data;
      // Store in Localbase
      await db.collection('student').doc(email).set(studentData);
      setStudent(studentData);
    } catch (error) {
      console.error('Failed to fetch student data from server.');

      // Fallback: Fetch from Localbase if server fails
      const localStudent = await db.collection('student').doc(email).get();
      setStudent(localStudent);
    }
  };

  return (
    <section id='student-section' className='border-top border-bottom'>
      {student?.email ? (
        <main id='student-main' className='mx-3 mb-3 pb-2'>
          <div className='container text-center mt-4'>
            <div className='row align-items-start'>
              <div className='col mb-2'>
                <button type='button' className='btn btn-primary'>
                  {student.email}{' '}
                  <span className='badge navy'>
                    <FaEnvelope />
                  </span>
                </button>
              </div>
              <div className='col mb-2'>
                <button type='button' className='btn btn-primary'>
                  {student.phoneNumber}{' '}
                  <span className='badge navy'>
                    <FaPhone />
                  </span>
                </button>
              </div>
              <div className='col mb-2'>
                <button type='button' className='btn btn-primary'>
                  {student.address}{' '}
                  <span className='badge navy'>
                    <IoLocation />
                  </span>
                </button>
              </div>
              <div className='col'>
                <button
                  type='button'
                  className='btn btn-primary'
                  title='Date Joined'
                >
                  <Moment format='MMMM D, YYYY'>{student.createdAt}</Moment>{' '}
                  <span className='badge navy'>
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
      ) : (
        <Spinners />
      )}
    </section>
  );
};

export default Student;
