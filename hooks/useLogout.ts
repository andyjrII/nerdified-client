"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import { clearAuthStudent, clearStudentProfile } from "@/utils/authStorage";
import axios from "@/lib/api/axios";

export const useLogout = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post("auth/signout", {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
    setAuth({ email: null, role: null });
    clearAuthSessionCookie();
    clearAuthStudent();
    clearStudentProfile();
    router.push("/signin");
  };

  return logout;
};
