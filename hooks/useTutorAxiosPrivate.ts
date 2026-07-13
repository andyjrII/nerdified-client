"use client";

import { useTutorRefreshToken } from "./useTutorRefreshToken";
import { useTutorLogout } from "./useTutorLogout";
import { useAxiosPrivateBase } from "./useAxiosPrivateBase";
import { AxiosInstance } from "axios";

export const useTutorAxiosPrivate = (): AxiosInstance =>
  useAxiosPrivateBase(useTutorRefreshToken(), useTutorLogout(), "tutor token");
