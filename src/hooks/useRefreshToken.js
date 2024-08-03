import useAuth from './useAuth';
import { axiosPrivate } from '../api/axios';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axiosPrivate.post('auth/refresh');
      setAuth((prev) => {
        return {
          ...prev,
          accessToken: response.data.access_token,
        };
      });
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
