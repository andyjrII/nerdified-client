"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { axiosPrivate } from "@/lib/api/axios";
import db from "@/utils/localBase";

export const useAdminRefreshToken = () => {
  const { setAdmin } = useAdminAuth();

  const refresh = async (): Promise<string> => {
    try {
      const response = await axiosPrivate.post(
        "auth/admin/refresh",
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setAdmin({
        email: null,
        accessToken: response.data.access_token,
      });

      const authData = await db.collection("auth_admin").get();

      if (authData.length > 0) {
        await db
          .collection("auth_admin")
          .doc({ email: authData[0].email })
          .update({
            accessToken: response.data.access_token,
          });
      }

      return response.data.access_token;
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
