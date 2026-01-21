"use client";

import { useTutor as useTutorContext } from "@/context/TutorProvider";

export const useTutor = () => {
  return useTutorContext();
};
