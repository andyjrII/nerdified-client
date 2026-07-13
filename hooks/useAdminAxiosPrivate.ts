"use client";

import { useAdminRefreshToken } from "./useAdminRefreshToken";
import { useAdminLogout } from "./useAdminLogout";
import { useAxiosPrivateBase } from "./useAxiosPrivateBase";
import { AxiosInstance } from "axios";

export const useAdminAxiosPrivate = (): AxiosInstance =>
  useAxiosPrivateBase(useAdminRefreshToken(), useAdminLogout(), "admin token");
