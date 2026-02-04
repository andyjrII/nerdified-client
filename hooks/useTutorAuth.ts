"use client";

import { useState, useEffect } from "react";
import { useAuth as useAuthContext } from "@/context/AuthProvider";
import { getAuthTutor } from "@/utils/authStorage";

export const useTutorAuth = () => {
  const { auth, setAuth } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = getAuthTutor();
    if (stored) setAuth(stored);
    setLoading(false);
  }, [setAuth]);

  return { auth, setAuth, loading };
};
