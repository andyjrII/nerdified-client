"use client";

import { useRouter } from "next/navigation";
import { useAuth as useAuthContext } from "@/context/AuthProvider";
import { useAdmin as useAdminContext } from "@/context/AdminProvider";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import {
  clearAuthStudent,
  clearStudentProfile,
  clearAuthTutor,
  clearTutorProfile,
  clearAuthAdmin,
  clearAdminProfile,
} from "@/utils/authStorage";
import axios from "@/lib/api/axios";

export type LogoutRole = "student" | "tutor" | "admin";

/**
 * Single logout hook for all roles. Calls the unified `POST /auth/signout`
 * endpoint, clears every piece of local auth state (student/tutor share one
 * context; admin is separate), and redirects based on `role`:
 * admin → /admin/signin, everyone else → /signin.
 *
 * `useTutorLogout` / `useAdminLogout` are thin presets over this hook.
 */
export const useLogout = (role?: LogoutRole) => {
  const router = useRouter();
  const { setAuth } = useAuthContext();
  const { setAdmin } = useAdminContext();

  const logout = async () => {
    try {
      await axios.post("auth/signout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Reset in-memory auth contexts.
    setAuth({ email: null, role: null });
    setAdmin({});

    // Clear all persisted auth — safe to clear every role's storage.
    clearAuthSessionCookie();
    clearAuthStudent();
    clearStudentProfile();
    clearAuthTutor();
    clearTutorProfile();
    clearAuthAdmin();
    clearAdminProfile();

    router.push(role === "admin" ? "/admin/signin" : "/signin");
  };

  return logout;
};
