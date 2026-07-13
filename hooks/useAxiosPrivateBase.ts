"use client";

import { useEffect, useRef } from "react";
import { AxiosInstance } from "axios";
import { axiosPrivate } from "@/lib/api/axios";

const MAX_RETRIES = 5;

/**
 * Shared implementation behind the role-specific private-axios hooks
 * (useAxiosPrivate / useTutorAxiosPrivate / useAdminAxiosPrivate). On a 401/403
 * it refreshes the access token and replays the request; after MAX_RETRIES it
 * logs the user out. Pass the role's refresh + logout functions.
 */
export const useAxiosPrivateBase = (
  refresh: () => Promise<void>,
  logout: () => Promise<void> | void,
  errorLabel = "token",
): AxiosInstance => {
  const retryCountRef = useRef<number>(0);

  useEffect(() => {
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config as any;
        const requestUrl = String(prevRequest?.url || "");
        const isRefreshRequest = requestUrl.includes("auth/refresh");

        if (
          (error?.response?.status === 401 || error?.response?.status === 403) &&
          !prevRequest?.sent &&
          !isRefreshRequest
        ) {
          if (retryCountRef.current < MAX_RETRIES) {
            prevRequest.sent = true;
            retryCountRef.current += 1;
            try {
              await refresh();
              return axiosPrivate(prevRequest);
            } catch (err) {
              console.error(`Error refreshing ${errorLabel}:`, err);
            }
          }

          if (retryCountRef.current >= MAX_RETRIES) {
            await logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, logout, errorLabel]);

  return axiosPrivate;
};
