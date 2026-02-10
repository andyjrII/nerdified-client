"use client";

import axios from "@/lib/api/axios";

export const useRefreshToken = () => {
  const refresh = async (): Promise<void> => {
    await axios.post("auth/refresh", {}, { withCredentials: true });
  };
  return refresh;
};
