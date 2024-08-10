import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import storage from '../utils/storage';

const AdminRequireAuth = () => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const storedAuth = storage.getData('admin_auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to='/admin/signin' state={{ from: location }} replace />
  );
};

export default AdminRequireAuth;
