"use client";

import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import db from "@/utils/localBase";

export const useAdminLogout = () => {
  const { admin, setAdmin } = useAdminAuth();
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post(
        "auth/admin/signout",
        {},
        {
          params: {
            email: admin.email,
          },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }

    setAdmin({ email: null, accessToken: null });
    clearAuthSessionCookie();

    if (typeof window !== "undefined") {
      localStorage.clear();
      await db.collection("auth_admin").delete();
      await db.collection("admin").delete();
    }

    router.push("/admin/signin");
  };

  return logout;
};
