import useAuth from './useAuth';
import { axiosPrivate } from '../api/axios';

const useAdminRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axiosPrivate.post('auth/admin/refresh');
      setAuth((prevAuth) => {
        return { ...prevAuth, accessToken: response?.data?.access_token };
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  return refresh;
};

export default useAdminRefreshToken;
