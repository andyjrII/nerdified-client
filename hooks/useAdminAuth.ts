"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import axios from "@/lib/api/axios";

export const useAdminAuth = () => {
  const { admin, setAdmin } = useAdmin();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("auth/me", { withCredentials: true });
        const { email, role } = res.data ?? {};
        const isAdmin = role === "SUPER_ADMIN" || role === "SUB_ADMIN";
        if (email && isAdmin) {
          setAdmin({ email, role });
        } else {
          setAdmin({});
        }
      } catch {
        setAdmin({});
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [setAdmin]);

  return { admin, setAdmin, loading };
};
