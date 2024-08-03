import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import storage from '../utils/storage';

const Welcome = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const url = 'https://api.adviceslip.com/advice';

  const [imagePath, setImagePath] = useState('');
  const [quote, setQuote] = useState('');

  const fetchQuote = async () => {
    try {
      const response = await axios.get(url);
      setQuote(response.data.slip.advice);
    } catch (error) {
      console.error('Error fetching Quote!');
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axiosPrivate.get(`students/image/${auth.email}`, {
        responseType: 'arraybuffer',
      });
      const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImagePath(imageUrl);
    } catch (error) {
      console.error('Error getting Profile picture!');
    }
  };

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }

    fetchImage();
    fetchQuote(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchQuote(); // Fetch new quote every 10 minutes
    }, 1800000); // 600000ms = 10 minutes

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='card'>
      <div className='card-body row'>
        <div className='col-md-10'>
          <h5 className='card-title text-white mb-3'>Welcome Back!</h5>
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
        <div className='col-md-2'>
          <img src={imagePath} id='student-img' alt='Profile' />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
