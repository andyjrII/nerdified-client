"use client";

import { useState, useEffect } from "react";
import { useAuth as useAuthContext } from "@/context/AuthProvider";
import axios from "@/lib/api/axios";

export const useAuth = () => {
  const { auth, setAuth } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("auth/me", { withCredentials: true });
        const { email, role } = res.data ?? {};
        const isStudentOrTutor =
          role === "STUDENT" || role === "TUTOR";
        if (email && isStudentOrTutor) {
          setAuth({ email, role });
        } else {
          setAuth({ email: null, role: null });
        }
      } catch {
        setAuth({ email: null, role: null });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [setAuth]);

  return { auth, setAuth, loading };
};
