"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import { clearAuthAdmin, clearAdminProfile } from "@/utils/authStorage";
import axios from "@/lib/api/axios";

export const useAdminLogout = () => {
  const { setAdmin } = useAdminAuth();
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post("auth/signout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Admin logout API error:", err);
    }
    setAdmin({});
    clearAuthSessionCookie();
    clearAuthAdmin();
    clearAdminProfile();
    router.push("/admin/signin");
  };

  return logout;
};
