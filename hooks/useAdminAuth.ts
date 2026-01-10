"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import db from "@/utils/localBase";

export const useAdminAuth = () => {
  const { admin, setAdmin } = useAdmin();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAuth = await db.collection("auth_admin").get();
        if (storedAuth.length > 0) {
          setAdmin(storedAuth[0]);
        }
      } catch (error) {
        console.error("Error initializing admin auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setAdmin]);

  return { admin, setAdmin, loading };
};
