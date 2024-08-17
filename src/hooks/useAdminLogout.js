import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAdminAuth from './useAdminAuth';
import db from '../utils/localBase';

const useAdminLogout = () => {
  const { auth, setAuth } = useAdminAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(
        'auth/admin/signout',
        {},
        {
          params: {
            email: auth.email,
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

    setAuth({ email: null, accessToken: null });

    localStorage.clear();
    await db.collection('auth_admin').delete();
    await db.collection('admin').delete();

    navigate('/admin/signin', { replace: true });
  };

  return logout;
};

export default useAdminLogout;
