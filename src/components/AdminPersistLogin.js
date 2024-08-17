import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAdminRefreshToken from '../hooks/useAdminRefreshToken';
import db from '../utils/localBase';
import Spinners from './Spinners';

const AdminPersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useAdminRefreshToken();

  useEffect(() => {
    const fetchTokenAndVerify = async () => {
      try {
        const data = await db.collection('auth_admin').get();

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

  if (isLoading) return <Spinners />;

  return <Outlet />;
};

export default AdminPersistLogin;
