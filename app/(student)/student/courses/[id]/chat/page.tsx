"use client";

import { useParams } from "next/navigation";
import CourseChatPage from "@/components/pages/CourseChatPage";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

export default function StudentCourseChatPage() {
  const params = useParams();
  const courseId = params?.id ? parseInt(String(params.id)) : NaN;
  const axiosPrivate = useAxiosPrivate();
  if (!Number.isFinite(courseId)) return null;
  return (
    <CourseChatPage
      axiosPrivate={axiosPrivate}
      role="STUDENT"
      courseId={courseId}
    />
  );
}
