"use client";

import axios from "@/lib/api/axios";

export const useTutorRefreshToken = () => {
  const refresh = async (): Promise<void> => {
    await axios.post("auth/refresh", {}, { withCredentials: true });
  };
  return refresh;
};
