"use client";

import { useAuth } from "@/hooks/useAuth";
import axios from "@/lib/api/axios";
import { getAuthStudent, setAuthStudent } from "@/utils/authStorage";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    try {
      const response = await axios.post(
        "auth/refresh",
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const newToken = response.data.access_token;
      setAuth({ email: null, accessToken: newToken });

      const existing = getAuthStudent();
      if (existing) {
        setAuthStudent({ ...existing, accessToken: newToken });
      }

      return newToken;
    } catch (error: any) {
      console.error(
        "Failed to refresh token:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  return refresh;
};
