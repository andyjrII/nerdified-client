"use client";

import { useEffect, useState, useRef } from "react";
import { useAdminRefreshToken } from "./useAdminRefreshToken";
import { axiosPrivate } from "@/lib/api/axios";
import db from "@/utils/localBase";
import { useAdminLogout } from "./useAdminLogout";
import { AxiosInstance } from "axios";

export const useAdminAxiosPrivate = (): AxiosInstance => {
  const refresh = useAdminRefreshToken();
  const logout = useAdminLogout();
  const [token, setToken] = useState<string>("");
  const retryCountRef = useRef<number>(0);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const data = await db.collection("auth_admin").get();
        if (data.length > 0) {
          setToken(data[0].accessToken);
        }
      } catch (error) {
        console.error("Error fetching admin token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
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

        if (
          (error?.response?.status === 401 || error?.response?.status === 403) &&
          !prevRequest?.sent
        ) {
          if (retryCountRef.current < maxRetries) {
            prevRequest.sent = true;
            retryCountRef.current += 1;
            try {
              const newAccessToken = await refresh();
              prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axiosPrivate(prevRequest);
            } catch (err) {
              console.error("Error refreshing admin token:", err);
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
