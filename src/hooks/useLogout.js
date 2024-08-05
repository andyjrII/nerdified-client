import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from './useAuth';
import storage from '../utils/storage';
import useStudent from './useStudent';

const useLogout = () => {
  const { auth, setAuth } = useAuth();
  const { setStudent } = useStudent();
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  const logout = async () => {
    const email = auth.email;
    try {
      await axios.post(
        'auth/signout',
        {
          params: {
            email,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }
    localStorage.clear();
    setAuth({});
    setStudent({});
    navigate('/', { replace: true });
  };

  return logout;
};

export default useLogout;
