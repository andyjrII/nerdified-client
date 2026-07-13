"use client";

import { useRefreshToken } from "./useRefreshToken";
import { useLogout } from "./useLogout";
import { useAxiosPrivateBase } from "./useAxiosPrivateBase";
import { AxiosInstance } from "axios";

export const useAxiosPrivate = (): AxiosInstance =>
  useAxiosPrivateBase(useRefreshToken(), useLogout(), "token");
