"use client";

import { Suspense } from "react";
import DirectMessagesPage from "@/components/pages/DirectMessagesPage";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

function StudentMessages() {
  const axiosPrivate = useAxiosPrivate();
  return <DirectMessagesPage axiosPrivate={axiosPrivate} role="STUDENT" />;
}

export default function StudentMessagesPage() {
  return (
    <Suspense>
      <StudentMessages />
    </Suspense>
  );
}
