import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAdminRefreshToken from '../hooks/useAdminRefreshToken';
import useAuth from '../hooks/useAuth';
import storage from '../utils/storage';
import Spinners from './Spinners';

const AdminPersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useAdminRefreshToken();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const storedAuth = storage.getData('admin_auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }

    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <Spinners /> : <Outlet />}</>;
};

export default AdminPersistLogin;
