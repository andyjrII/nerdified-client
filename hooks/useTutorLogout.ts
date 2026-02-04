"use client";

import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { useTutorAuth } from "@/hooks/useTutorAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import {
  getAuthTutor,
  clearAuthTutor,
  clearTutorProfile,
} from "@/utils/authStorage";

export const useTutorLogout = () => {
  const router = useRouter();
  const { setAuth } = useTutorAuth();

  const logout = async () => {
    const stored = getAuthTutor();
    const email = typeof stored?.email === "string" ? stored.email.trim() : "";
    try {
      if (email) {
        await axios.post("auth/tutor/signout", null, {
          params: { email },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }
    } catch {
      // Proceed with local logout; API may 400 if email missing
    }
    setAuth({ email: null, accessToken: null });
    clearAuthSessionCookie();
    clearAuthTutor();
    clearTutorProfile();
    router.push("/signin");
  };

  return logout;
};
