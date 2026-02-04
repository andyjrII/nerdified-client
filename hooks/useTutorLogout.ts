"use client";

import { useRouter } from "next/navigation";
import { useTutorAuth } from "@/hooks/useTutorAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import {
  getAuthTutor,
  clearAuthTutor,
  clearTutorProfile,
} from "@/utils/authStorage";
import axios from "@/lib/api/axios";

export const useTutorLogout = () => {
  const router = useRouter();
  const { setAuth } = useTutorAuth();

  const logout = async () => {
    const raw = getAuthTutor()?.accessToken;
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
      console.error(err);
    }
    setAuth({ email: null, accessToken: null });
    clearAuthSessionCookie();
    clearAuthTutor();
    clearTutorProfile();
    router.push("/signin");
  };

  return logout;
};
