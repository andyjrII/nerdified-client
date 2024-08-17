import useAuth from './useAuth';
import { axiosPrivate } from '../api/axios';
import db from '../utils/localBase';

const useAdminRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axiosPrivate.post(
        'auth/admin/refresh',
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setAuth((prevAuth) => {
        return { ...prevAuth, accessToken: response?.data?.access_token };
      });

      const authData = await db.collection('auth_admin').get();

      if (authData.length > 0) {
        await db
          .collection('auth_admin')
          .doc({ email: authData[0].email })
          .update({
            accessToken: response.data.access_token,
          });
      }

      return response.data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  return refresh;
};

export default useAdminRefreshToken;
