"use client";

import { useRouter } from "next/navigation";
import { useTutorAuth } from "@/hooks/useTutorAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import { clearAuthTutor, clearTutorProfile } from "@/utils/authStorage";
import axios from "@/lib/api/axios";

export const useTutorLogout = () => {
  const router = useRouter();
  const { setAuth } = useTutorAuth();

  const logout = async () => {
    try {
      await axios.post("auth/signout", {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
    setAuth({ email: null, role: null });
    clearAuthSessionCookie();
    clearAuthTutor();
    clearTutorProfile();
    router.push("/signin");
  };

  return logout;
};
