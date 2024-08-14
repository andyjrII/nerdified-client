import { useEffect, useState } from 'react';
import useRefreshToken from './useRefreshToken';
import { axiosPrivate } from '../api/axios';
import db from '../utils/localBase';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const [token, setToken] = useState();

  useEffect(() => {
    const fetchToken = async () => {
      const data = await db.collection('auth_student').get();
      setToken(data[0].accessToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [token, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
