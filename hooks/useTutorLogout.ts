"use client";

import { useRouter } from "next/navigation";
import { useTutorAuth } from "@/hooks/useTutorAuth";
import { axiosPrivate } from "@/lib/api/axios";
import db from "@/utils/localBase";

export const useTutorLogout = () => {
  const router = useRouter();
  const { setAuth } = useTutorAuth();

  const logout = async () => {
    try {
      // Get email from local storage
      const authData = await db.collection("auth_tutor").get();
      if (authData.length > 0) {
        const email = authData[0].email;

        // Call logout endpoint
        await axiosPrivate.post(`auth/tutor/signout?email=${email}`, null, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        // Clear local storage
        await db.collection("auth_tutor").delete();
        await db.collection("tutor").delete();
      }

      // Clear auth context
      setAuth({ email: null, accessToken: null });

      // Redirect to signin
      router.push("/signin");
    } catch (error) {
      console.error("Error during tutor logout:", error);
      // Clear local storage even if API call fails
      await db.collection("auth_tutor").delete();
      await db.collection("tutor").delete();
      setAuth({ email: null, accessToken: null });
      router.push("/signin");
    }
  };

  return logout;
};
