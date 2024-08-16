import '../assets/styles/student.css';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';
import { FaClock, FaEnvelope, FaPhone } from 'react-icons/fa';
import { IoLocation } from 'react-icons/io5';
import db from '../utils/localBase';
import Welcome from './Welcome';
import Spinners from './Spinners';

const StudentInfo = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState('');
  const [student, setStudent] = useState({});

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail();
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
    <>
      <div className='container text-center mt-4'>
        <div className='row align-items-start'>
          <div className='col mb-2'>
            <button type='button' className='btn btn-primary'>
              {student.email || <Spinners />}{' '}
              <span className='badge navy'>
                <FaEnvelope />
              </span>
            </button>
          </div>
          <div className='col mb-2'>
            <button type='button' className='btn btn-primary'>
              {student.phoneNumber || <Spinners />}{' '}
              <span className='badge navy'>
                <FaPhone />
              </span>
            </button>
          </div>
          <div className='col mb-2'>
            <button type='button' className='btn btn-primary'>
              {student.address || <Spinners />}{' '}
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
              <Moment format='MMMM D, YYYY'>
                {student.createdAt || <Spinners />}
              </Moment>{' '}
              <span className='badge navy'>
                <FaClock />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className='p-3 mx-5'>
        <Welcome name={student.name} />
      </div>{' '}
    </>
  );
};

export default StudentInfo;
