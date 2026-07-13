"use client";

import NotificationsPage from "@/components/pages/NotificationsPage";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";

export default function TutorNotificationsPage() {
  const axiosPrivate = useTutorAxiosPrivate();
  return <NotificationsPage axiosPrivate={axiosPrivate} />;
}
