import useAuth from './useAuth';
import axios from '../api/axios';

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refreshToken = localStorage.getItem('REFRESH_TOKEN');

  const refresh = async () => {
    try {
      const response = await axios.post('auth/refresh', null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        withCredentials: true,
      });

      setAuth((prevAuth) => ({
        ...prevAuth,
        accessToken: response?.data?.access_token,
      }));
      localStorage.setItem('ACCESS_TOKEN', response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      //throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
