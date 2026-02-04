"use client";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useRouter } from "next/navigation";

interface LiveRoomViewProps {
  token: string;
  serverUrl: string;
  sessionTitle?: string;
  backHref: string;
}

export function LiveRoomView({
  token,
  serverUrl,
  sessionTitle,
  backHref,
}: LiveRoomViewProps) {
  const router = useRouter();

  return (
    <div className="h-screen w-full bg-gray-900">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        audio={true}
        video={true}
        onDisconnected={() => router.push(backHref)}
        className="h-full"
      >
        <div className="flex flex-col h-full">
          {sessionTitle && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white shrink-0">
              <a
                href={backHref}
                className="text-sm text-gray-300 hover:text-white"
              >
                ← Leave
              </a>
              <span className="text-sm truncate">{sessionTitle}</span>
            </div>
          )}
          <div className="flex-1 min-h-0">
            <VideoConference />
          </div>
        </div>
      </LiveKitRoom>
    </div>
  );
}
