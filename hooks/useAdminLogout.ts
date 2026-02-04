"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import {
  getAuthAdmin,
  clearAuthAdmin,
  clearAdminProfile,
} from "@/utils/authStorage";
import axios from "@/lib/api/axios";

export const useAdminLogout = () => {
  const { setAdmin } = useAdminAuth();
  const router = useRouter();

  const logout = async () => {
    const raw = getAuthAdmin()?.accessToken;
    const token = typeof raw === "string" ? raw.trim() : "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      await axios.post("auth/signout", {}, {
        headers,
        withCredentials: true,
      });
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
