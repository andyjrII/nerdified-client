import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from '../api/axios';
import useAuth from './useAuth';
import storage from '../utils/storage';
import useAdmin from './useAdmin';

const useAdminLogout = () => {
  const { auth, setAuth } = useAuth();
  const { setAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = storage.getData('admin_auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  const logout = async () => {
    const email = auth.email;
    try {
      await axios.post(
        'auth/admin/signout',
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
    setAdmin({});
    navigate('/admin/signin', { replace: true });
  };

  return logout;
};

export default useAdminLogout;
