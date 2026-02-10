"use client";

import { useEffect, useRef } from "react";
import { useTutorRefreshToken } from "./useTutorRefreshToken";
import { axiosPrivate } from "@/lib/api/axios";
import { useTutorLogout } from "./useTutorLogout";
import { AxiosInstance } from "axios";

export const useTutorAxiosPrivate = (): AxiosInstance => {
  const refresh = useTutorRefreshToken();
  const logout = useTutorLogout();
  const retryCountRef = useRef<number>(0);

  useEffect(() => {
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
          !isRefreshRequest
        ) {
          if (retryCountRef.current < maxRetries) {
            prevRequest.sent = true;
            retryCountRef.current += 1;
            try {
              await refresh();
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
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, logout]);

  return axiosPrivate;
};
