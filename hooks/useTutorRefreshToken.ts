"use client";

import { useTutorAuth } from "@/hooks/useTutorAuth";
import axios from "@/lib/api/axios";
import db from "@/utils/localBase";

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

      setAuth({
        email: null,
        accessToken: response.data.access_token,
      });

      const authData = await db.collection("auth_tutor").get();

      if (authData.length > 0) {
        // Update the accessToken in Localbase
        await db
          .collection("auth_tutor")
          .doc({ email: authData[0].email })
          .update({
            accessToken: response.data.access_token,
          });
      }

      return response.data.access_token;
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
