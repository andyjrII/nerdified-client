"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import {
  getAuthStudent,
  clearAuthStudent,
  clearStudentProfile,
} from "@/utils/authStorage";
import axios from "@/lib/api/axios";

export const useLogout = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  const logout = async () => {
    const raw = getAuthStudent()?.accessToken;
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
    clearAuthStudent();
    clearStudentProfile();
    router.push("/signin");
  };

  return logout;
};
