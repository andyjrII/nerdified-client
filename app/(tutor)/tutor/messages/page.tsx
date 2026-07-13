"use client";

import { Suspense } from "react";
import DirectMessagesPage from "@/components/pages/DirectMessagesPage";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";

function TutorMessages() {
  const axiosPrivate = useTutorAxiosPrivate();
  return <DirectMessagesPage axiosPrivate={axiosPrivate} role="TUTOR" />;
}

export default function TutorMessagesPage() {
  return (
    <Suspense>
      <TutorMessages />
    </Suspense>
  );
}
