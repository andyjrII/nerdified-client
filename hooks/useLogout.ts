"use client";

import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import {
  getAuthStudent,
  clearAuthStudent,
  clearStudentProfile,
} from "@/utils/authStorage";

export const useLogout = () => {
  const { auth, setAuth } = useAuth();
  const router = useRouter();

  const logout = async () => {
    const fromContext = typeof auth.email === "string" ? auth.email.trim() : "";
    const fromStorage = getAuthStudent()?.email;
    const email = fromContext || (typeof fromStorage === "string" ? fromStorage.trim() : "");
    try {
      if (email) {
        await axios.post("auth/signout", null, {
          params: { email },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }
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
