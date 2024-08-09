import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import useStudent from '../hooks/useStudent';
import storage from '../utils/storage';

const Welcome = () => {
  const axiosPrivate = useAxiosPrivate();

  const { auth, setAuth } = useAuth();
  const { student, setStudent } = useStudent(null);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }

    fetchStudent();
    fetchQuote(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchQuote(); // Fetch new quote every 10 minutes
    }, 1800000); // 600000ms = 10 minutes

    return () => clearInterval(intervalId);
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await axios.get('https://api.adviceslip.com/advice');
      setQuote(response.data.slip.advice);
    } catch (error) {
      console.error('Error fetching Quote!');
    }
  };

  const fetchStudent = async () => {
    try {
      const response = await axiosPrivate.get(`students/${auth.email}`);
      setStudent(response?.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='card'>
      <div className='card-body row'>
        <div className='col-md-10'>
          <h4 className='card-title text-white mb-3'>
            Welcome back{' '}
            <span className='text-warning fs-5'>{student.name}</span>!
          </h4>
          <div className='d-flex text-white'>
            <FaQuoteLeft />
            {quote ? (
              <p className='card-text text-white mx-2 quote-text'>{quote}</p>
            ) : (
              <p className='card-text text-white mx-2 quote-text'>
                Education is the ability to listen to anything without losing
                your temper or your self-confidence.
              </p>
            )}
            <FaQuoteRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
