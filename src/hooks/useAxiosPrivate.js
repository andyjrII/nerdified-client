import { useEffect, useState, useRef } from 'react';
import useRefreshToken from './useRefreshToken';
import { axiosPrivate } from '../api/axios';
import db from '../utils/localBase';
import useLogout from '../hooks/useLogout';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const logout = useLogout();
  const [token, setToken] = useState('');
  const retryCountRef = useRef(0); // Use a ref to persist retry count across renders

  useEffect(() => {
    const fetchToken = async () => {
      const data = await db.collection('auth_student').get();
      if (data.length > 0) {
        setToken(data[0].accessToken);
      }
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
        const maxRetries = 5;

        if (error?.response?.status === (403 || 401) && !prevRequest?.sent) {
          if (retryCountRef.current < maxRetries) {
            prevRequest.sent = true;
            retryCountRef.current += 1;
            try {
              const newAccessToken = await refresh();
              prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axiosPrivate(prevRequest);
            } catch (err) {
              console.error('Error refreshing token:', err);
            }
          }

          if (retryCountRef.current >= maxRetries) {
            await logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [token, refresh, logout]);

  return axiosPrivate;
};

export default useAxiosPrivate;
