"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { getAuthAdmin } from "@/utils/authStorage";

export const useAdminAuth = () => {
  const { admin, setAdmin } = useAdmin();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = getAuthAdmin();
    if (stored) setAdmin(stored);
    setLoading(false);
  }, [setAdmin]);

  return { admin, setAdmin, loading };
};
