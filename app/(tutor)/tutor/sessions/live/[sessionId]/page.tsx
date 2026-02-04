"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { LiveRoomView } from "@/components/live/LiveRoomView";

export default function TutorLiveSessionPage() {
  const params = useParams();
  const router = useRouter();
  const axiosPrivate = useTutorAxiosPrivate();
  const sessionId = params?.sessionId ? String(params.sessionId) : null;
  const [data, setData] = useState<{
    token: string;
    url: string;
    roomName: string;
    session?: { title?: string };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await axiosPrivate.post(
          `sessions/${sessionId}/livekit-token`,
          null,
          { withCredentials: true }
        );
        if (cancelled) return;
        setData(res.data);
      } catch (err: any) {
        if (cancelled) return;
        setError(
          err.response?.data?.message || "Failed to start session. Please try again."
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, axiosPrivate]);

  if (!sessionId) {
    router.replace("/tutor/sessions");
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/tutor/sessions"
            className="text-blue-600 hover:underline"
          >
            Back to Sessions
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Connecting to session...</div>
      </div>
    );
  }

  return (
    <LiveRoomView
      token={data.token}
      serverUrl={data.url}
      sessionTitle={data.session?.title}
      backHref="/tutor/sessions"
    />
  );
}
