import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAdminRefreshToken from '../hooks/useAdminRefreshToken';
import useAuth from '../hooks/useAuth';
import Spinners from '../components/spinner/Spinners';

const AdminPersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useAdminRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <Spinners /> : <Outlet />}</>;
};

export default AdminPersistLogin;
