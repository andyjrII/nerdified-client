import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import db from '../utils/localBase';
import Spinners from './Spinners';

const AdminRequireAuth = () => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const data = await db.collection('auth_admin').get();
        if (data.length > 0) {
          setToken(data[0].accessToken);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  if (isLoading) return <Spinners />;

  return token ? (
    <Outlet />
  ) : (
    <Navigate to='/admin/signin' state={{ from: location }} replace />
  );
};

export default AdminRequireAuth;
