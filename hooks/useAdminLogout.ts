"use client";

import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import {
  getAuthAdmin,
  clearAuthAdmin,
  clearAdminProfile,
} from "@/utils/authStorage";

export const useAdminLogout = () => {
  const { admin, setAdmin } = useAdminAuth();
  const router = useRouter();

  const logout = async () => {
    const fromContext = typeof admin.email === "string" ? admin.email.trim() : "";
    const fromStorage = getAuthAdmin()?.email;
    const email = fromContext || (typeof fromStorage === "string" ? fromStorage.trim() : "");
    try {
      if (email) {
        await axios.post("auth/admin/signout", null, {
          params: { email },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }
    } catch (err) {
      console.error("Admin logout API error:", err);
    }
    setAdmin({ email: null, accessToken: null });
    clearAuthSessionCookie();
    clearAuthAdmin();
    clearAdminProfile();
    router.push("/admin/signin");
  };

  return logout;
};
