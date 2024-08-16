import { useState, useEffect } from 'react';
import axios from '../api/axios';

const Welcome = ({ name }) => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    fetchQuote(); // Initial fetch
    const intervalId = setInterval(() => {
      fetchQuote();
    }, 1800000); // 30 minutes

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

  return (
    <div className='card'>
      <div className='card-body navy rounded'>
        <h2 className='card-title text-white mb-3'>Welcome back!</h2>
        <div className='d-flex text-white'>
          <p className='card-text text-white quote-text'>
            "{name},{' '}
            {quote ? (
              <>{quote.toLowerCase()}</>
            ) : (
              <>
                Education is the ability to listen to anything without losing
                your temper or your self-confidence.
              </>
            )}
            "
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
