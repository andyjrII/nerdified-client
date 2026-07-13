"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const API_BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3100/api";
// Socket.io connects to the server root, not the /api HTTP prefix.
const SOCKET_URL = API_BASE.replace(/\/api\/?$/, "");

export interface ChatDirectMessage {
  id: number;
  senderType: "STUDENT" | "TUTOR";
  studentSenderId: number | null;
  tutorSenderId: number | null;
  studentReceiverId: number | null;
  tutorReceiverId: number | null;
  message: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface ConversationPartner {
  id: number;
  type: "STUDENT" | "TUTOR";
  name: string | null;
  email: string;
  imagePath: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

/**
 * Authenticated socket.io connection for real-time messaging. Auth rides on
 * the same access_token cookie the REST API uses (withCredentials). The
 * socket auto-reconnects; `connected` reflects live status.
 */
export const useChatSocket = (enabled = true) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const s = io(SOCKET_URL, { withCredentials: true });
    setSocket(s);
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    return () => {
      s.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [enabled]);

  return { socket, connected };
};
