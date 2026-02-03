"use client";

import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { clearAuthSessionCookie } from "@/utils/authCookie";
import db from "@/utils/localBase";

export const useLogout = () => {
  const { auth, setAuth } = useAuth();
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post(
        'auth/signout',
        {},
        {
          params: { email: auth.email },
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }

    // Clear auth data
    setAuth({ email: null, accessToken: null });
    clearAuthSessionCookie();

    // Clear local storage and delete data from the database
    if (typeof window !== 'undefined') {
      localStorage.clear();
      await db.collection('auth_student').delete();
      await db.collection('student').delete();
    }

    router.push('/');
  };

  return logout;
};
