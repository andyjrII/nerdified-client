import { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import storage from '../utils/storage';

const RequireAuth = () => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  return auth.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to='/signin' state={{ from: location }} replace />
  );
};

export default RequireAuth;
