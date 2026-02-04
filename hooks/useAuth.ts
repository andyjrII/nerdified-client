"use client";

import { useState, useEffect } from "react";
import { useAuth as useAuthContext } from "@/context/AuthProvider";
import { getAuthStudent } from "@/utils/authStorage";

export const useAuth = () => {
  const { auth, setAuth } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = getAuthStudent();
    if (stored) setAuth(stored);
    setLoading(false);
  }, [setAuth]);

  return { auth, setAuth, loading };
};
