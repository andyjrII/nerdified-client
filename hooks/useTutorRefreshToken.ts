"use client";

import { useTutorAuth } from "@/hooks/useTutorAuth";
import axios from "@/lib/api/axios";
import { getAuthTutor, setAuthTutor } from "@/utils/authStorage";

export const useTutorRefreshToken = () => {
  const { setAuth } = useTutorAuth();

  const refresh = async (): Promise<string> => {
    try {
      const response = await axios.post(
        "auth/tutor/refresh",
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const newToken = response.data.access_token;
      setAuth({ email: null, accessToken: newToken });

      const existing = getAuthTutor();
      if (existing) {
        setAuthTutor({ ...existing, accessToken: newToken });
      }

      return newToken;
    } catch (error: any) {
      console.error(
        "Failed to refresh tutor token:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  return refresh;
};
