"use client";

import { useEffect, useState, useRef } from "react";
import { useTutorRefreshToken } from "./useTutorRefreshToken";
import { axiosPrivate } from "@/lib/api/axios";
import { getAuthTutor } from "@/utils/authStorage";
import { useTutorLogout } from "./useTutorLogout";
import { AxiosInstance } from "axios";

export const useTutorAxiosPrivate = (): AxiosInstance => {
  const refresh = useTutorRefreshToken();
  const logout = useTutorLogout();
  const [token, setToken] = useState<string>("");
  const retryCountRef = useRef<number>(0);

  useEffect(() => {
    const data = getAuthTutor();
    if (data?.accessToken) setToken(data.accessToken);
  }, []);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (token && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config as any;
        const maxRetries = 5;
        const requestUrl = String(prevRequest?.url || "");
        const isRefreshRequest = requestUrl.includes("auth/refresh");

        if (
          (error?.response?.status === 401 || error?.response?.status === 403) &&
          !prevRequest?.sent &&
          token &&
          !isRefreshRequest
        ) {
          if (retryCountRef.current < maxRetries) {
            prevRequest.sent = true;
            retryCountRef.current += 1;
            try {
              const newAccessToken = await refresh();
              setToken(newAccessToken);
              prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axiosPrivate(prevRequest);
            } catch (err) {
              console.error("Error refreshing tutor token:", err);
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
