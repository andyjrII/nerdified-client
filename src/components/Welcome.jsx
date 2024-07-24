import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';

const Welcome = () => {
  const axiosPrivate = useAxiosPrivate();

  const email = localStorage.getItem('STUDENT_EMAIL');

  const [imagePath, setImagePath] = useState('');
  const [quote, setQuote] = useState('');

  const fetchQuote = async () => {
    try {
      const response = await axios.get(
        'https://programming-quotes-api.herokuapp.com/quotes/random'
      );
      setQuote(response.data.en);
    } catch (error) {
      console.error('Error fetching the quote:', error);
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axiosPrivate.get(`students/image/${email}`, {
        responseType: 'arraybuffer',
      });
      const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImagePath(imageUrl);
    } catch (error) {
      alert('Error getting profile image');
    }
  };

  useEffect(() => {
    fetchImage();
    fetchQuote(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchQuote(); // Fetch new quote every 10 minutes
    }, 600000); // 600000ms = 10 minutes

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='card'>
      <div className='card-body row'>
        <div className='col-md-10'>
          <p className='card-text text-white'>Welcome Back!</p>
          <h5 className='card-title text-white'>Your Dashboard</h5>
          <p className='card-text text-white'>
            'Education is the ability to listen to anything without losing your
            temper or your self-confidence'
          </p>
          <p>{quote}</p>
        </div>
        <div className='col-md-2'>
          <img src={imagePath} id='student-img' alt='Profile' />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
