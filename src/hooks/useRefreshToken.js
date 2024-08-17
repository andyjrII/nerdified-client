import useAdminAuth from './useAdminAuth';
import { axiosPrivate } from '../api/axios';
import db from '../utils/localBase';

const useRefreshToken = () => {
  const { setAuth } = useAdminAuth();

  const refresh = async () => {
    try {
      const response = await axiosPrivate.post(
        'auth/refresh',
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setAuth((prev) => {
        return {
          ...prev,
          accessToken: response.data.access_token,
        };
      });

      const authData = await db.collection('auth_student').get();

      if (authData.length > 0) {
        // Update the accessToken in Localbase
        await db
          .collection('auth_student')
          .doc({ email: authData[0].email })
          .update({
            accessToken: response.data.access_token,
          });
      }

      return response.data.access_token;
    } catch (error) {
      console.error(
        'Failed to refresh token:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
