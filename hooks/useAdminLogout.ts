"use client";

import { useLogout } from "./useLogout";

/** Admin preset of the unified {@link useLogout} hook (redirects to /admin/signin). */
export const useAdminLogout = () => useLogout("admin");
