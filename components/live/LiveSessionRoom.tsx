"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles/prefabs";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaArrowLeft, FaRedo } from "react-icons/fa";

type ParticipantRole = "student" | "tutor";

interface LiveSessionPayload {
  token: string;
  url: string;
  roomName: string;
  participant: {
    role: ParticipantRole;
    name?: string | null;
  };
  session: {
    id: number;
    title?: string | null;
    startTime: string;
    endTime: string;
    status: string;
  };
}

interface LiveSessionRoomProps {
  sessionId: number;
  audienceHint?: ParticipantRole;
}

export default function LiveSessionRoom({
  sessionId,
  audienceHint = "student",
}: LiveSessionRoomProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hintFromQuery = searchParams?.get("audience") as ParticipantRole | null;
  const effectiveAudience = hintFromQuery ?? audienceHint;

  const studentAxios = useAxiosPrivate();
  const tutorAxios = useTutorAxiosPrivate();
  const axios = useMemo(
    () => (effectiveAudience === "tutor" ? tutorAxios : studentAxios),
    [effectiveAudience, tutorAxios, studentAxios]
  );

  const [state, setState] = useState<{
    loading: boolean;
    error?: string;
    payload?: LiveSessionPayload;
  }>({ loading: true });

  useEffect(() => {
    let cancelled = false;
    const fetchToken = async () => {
      setState({ loading: true });
      try {
        const response = await axios.post<LiveSessionPayload>(
          `/sessions/${sessionId}/livekit-token`,
          null,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (!cancelled) {
          setState({ loading: false, payload: response.data });
        }
      } catch (error: any) {
        console.error("Failed to request LiveKit token", error);
        if (!cancelled) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Unable to join the session.";
          setState({ loading: false, error: message });
        }
      }
    };

    fetchToken();
    return () => {
      cancelled = true;
    };
  }, [axios, sessionId]);

  const goBack = () => {
    if (effectiveAudience === "tutor") {
      router.push("/tutor/sessions");
    } else {
      router.push("/student/sessions");
    }
  };

  if (state.loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse text-lg text-gray-400">
          Connecting to your classroom...
        </div>
      </div>
    );
  }

  if (state.error || !state.payload) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 px-4">
        <Card className="max-w-md text-center">
          <CardContent className="space-y-4 p-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Unable to Join Session
            </h2>
            <p className="text-gray-600">{state.error}</p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.refresh()}>
                <FaRedo className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={goBack}>
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back to Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { token, url, session } = state.payload;
  const sessionTitle =
    session.title || `Session #${session.id.toString().padStart(4, "0")}`;

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Nerdified Live Classroom
          </p>
          <h1 className="text-lg font-semibold">{sessionTitle}</h1>
          <p className="text-xs text-slate-400">
            {effectiveAudience === "tutor" ? "Tutor" : "Student"} view
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={goBack}>
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Leave Session
        </Button>
      </header>

      <div className="relative flex-1">
        <LiveKitRoom
          token={token}
          serverUrl={url}
          data-lk-theme="default"
          onDisconnected={goBack}
          style={{ height: "100%", width: "100%" }}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  );
}

