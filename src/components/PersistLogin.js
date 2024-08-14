import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import Spinners from './Spinners';
import db from '../utils/localBase';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();

  useEffect(() => {
    const fetchTokenAndVerify = async () => {
      try {
        const data = await db.collection('auth_student').get();

        if (!data.length || !data[0].accessToken) {
          await refresh();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenAndVerify();
  }, [refresh]);

  if (isLoading) {
    return <Spinners />;
  }

  return <Outlet />;
};

export default PersistLogin;
