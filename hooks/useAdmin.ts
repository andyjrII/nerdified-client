"use client";

import { useAdmin as useAdminContext } from "@/context/AdminProvider";

export const useAdmin = () => {
  return useAdminContext();
};
