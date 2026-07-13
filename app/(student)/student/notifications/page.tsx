"use client";

import NotificationsPage from "@/components/pages/NotificationsPage";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

export default function StudentNotificationsPage() {
  const axiosPrivate = useAxiosPrivate();
  return <NotificationsPage axiosPrivate={axiosPrivate} />;
}
