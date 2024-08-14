import { useState, useEffect } from 'react';
import db from '../utils/localBase';

const useAuthToken = () => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const data = await db.collection('auth_student').get();
        if (data.length > 0) {
          setToken(data[0].accessToken);
          setEmail(data[0].email);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchToken();
  }, []);

  return { token, email };
};

export default useAuthToken;
