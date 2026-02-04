"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import axios from "@/lib/api/axios";
import { getAuthAdmin, setAuthAdmin } from "@/utils/authStorage";

export const useAdminRefreshToken = () => {
  const { setAdmin } = useAdminAuth();

  const refresh = async (): Promise<string> => {
    try {
      const response = await axios.post(
        "auth/admin/refresh",
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const newToken = response.data.access_token;
      setAdmin({ email: null, accessToken: newToken });

      const existing = getAuthAdmin();
      if (existing) {
        setAuthAdmin({ ...existing, accessToken: newToken });
      }

      return newToken;
    } catch (error: any) {
      console.error(
        "Failed to refresh admin token:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  return refresh;
};
