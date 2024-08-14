import { useEffect, useState } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import db from '../utils/localBase';

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return token ? (
    <Outlet />
  ) : (
    <Navigate to='/signin' state={{ from: location }} replace />
  );
};

export default RequireAuth;
