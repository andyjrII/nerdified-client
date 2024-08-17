import { useEffect, useState } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import db from '../utils/localBase';
import Spinners from './Spinners';

const RequireAuth = () => {
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const data = await db.collection('auth_student').get();
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
    <Navigate to='/signin' state={{ from: location }} replace />
  );
};

export default RequireAuth;
