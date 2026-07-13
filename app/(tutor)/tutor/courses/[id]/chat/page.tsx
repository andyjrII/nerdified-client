"use client";

import { useParams } from "next/navigation";
import CourseChatPage from "@/components/pages/CourseChatPage";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";

export default function TutorCourseChatPage() {
  const params = useParams();
  const courseId = params?.id ? parseInt(String(params.id)) : NaN;
  const axiosPrivate = useTutorAxiosPrivate();
  if (!Number.isFinite(courseId)) return null;
  return (
    <CourseChatPage
      axiosPrivate={axiosPrivate}
      role="TUTOR"
      courseId={courseId}
    />
  );
}
