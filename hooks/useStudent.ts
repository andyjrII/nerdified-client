"use client";

import { useStudent as useStudentContext } from "@/context/StudentProvider";

export const useStudent = () => {
  return useStudentContext();
};
