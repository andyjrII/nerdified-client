"use client";

import { useState, useEffect } from "react";
import { useAuth as useAuthContext } from "@/context/AuthProvider";
import db from "@/utils/localBase";

export const useAuth = () => {
  const { auth, setAuth } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAuth = await db.collection("auth_student").get();
        if (storedAuth.length > 0) {
          setAuth(storedAuth[0]);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setAuth]);

  return { auth, setAuth, loading };
};
