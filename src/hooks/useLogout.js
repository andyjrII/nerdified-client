import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from './useAuth';
import db from '../utils/localBase';

const useLogout = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(
        'auth/signout',
        {},
        {
          params: { email: auth.email },
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }

    // Clear auth data
    setAuth({ email: null, accessToken: null });

    // Clear local storage and delete data from the database
    localStorage.clear();
    await db.collection('auth_student').delete();
    await db.collection('student').delete();

    navigate('/', { replace: true });
  };

  return logout;
};

export default useLogout;
