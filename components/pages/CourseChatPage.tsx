"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosInstance } from "axios";
import Moment from "react-moment";
import {
  FaArrowLeft,
  FaBullhorn,
  FaComments,
  FaPaperPlane,
} from "react-icons/fa";
import { useChatSocket } from "@/hooks/useChatSocket";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CourseChatMessage {
  id: number;
  courseId: number;
  senderId: number;
  senderType: "STUDENT" | "TUTOR";
  senderName: string | null;
  message: string;
  isAnnouncement: boolean;
  createdAt: string;
}

interface CourseChatPageProps {
  axiosPrivate: AxiosInstance;
  role: "STUDENT" | "TUTOR";
  courseId: number;
}

const CourseChatPage = ({ axiosPrivate, role, courseId }: CourseChatPageProps) => {
  const router = useRouter();
  const { socket, connected } = useChatSocket();

  const [courseTitle, setCourseTitle] = useState<string>("");
  const [myId, setMyId] = useState<number | null>(null);
  const [messages, setMessages] = useState<CourseChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState(false);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isMine = useCallback(
    (m: CourseChatMessage) =>
      m.senderType === role && myId !== null && m.senderId === myId,
    [role, myId],
  );

  // Who am I (numeric id), what course is this, and its message history.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [me, course, history] = await Promise.all([
          axiosPrivate.get("auth/me"),
          axiosPrivate.get(`courses/course/${courseId}`),
          axiosPrivate.get(`messages/course/${courseId}?userType=${role}`),
        ]);
        if (cancelled) return;
        setMyId(typeof me?.data?.id === "number" ? me.data.id : null);
        setCourseTitle(course?.data?.title ?? `Course #${courseId}`);
        setMessages(Array.isArray(history?.data) ? history.data : []);
      } catch (error: any) {
        if (cancelled) return;
        if (error?.response?.status === 403) setForbidden(true);
        console.error("Error loading course chat:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [axiosPrivate, courseId, role]);

  // Join the course room and receive messages live.
  useEffect(() => {
    if (!socket || !connected) return;
    socket.emit("course:join", { courseId });
    const onNew = (m: CourseChatMessage) => {
      if (m.courseId !== courseId) return;
      setMessages((prev) =>
        prev.some((x) => x.id === m.id) ? prev : [...prev, m],
      );
    };
    socket.on("course:new", onNew);
    return () => {
      socket.off("course:new", onNew);
      socket.emit("course:leave", { courseId });
    };
  }, [socket, connected, courseId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const res = await axiosPrivate.post(
        `messages/course?senderType=${role}`,
        {
          courseId,
          message: text,
          isAnnouncement: role === "TUTOR" ? announcement : false,
        },
      );
      setDraft("");
      setAnnouncement(false);
      const created: CourseChatMessage = res?.data;
      // The socket echoes it to the room; dedupe by id.
      if (created?.id) {
        setMessages((prev) =>
          prev.some((x) => x.id === created.id) ? prev : [...prev, created],
        );
      }
    } catch (error) {
      console.error("Error sending course chat message:", error);
    } finally {
      setSending(false);
    }
  };

  if (forbidden) {
    return (
      <div className="min-h-screen bg-background px-4 py-6 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <FaComments className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>You don&apos;t have access to this course&apos;s chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              aria-label="Back"
            >
              <FaArrowLeft className="w-3.5 h-3.5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground truncate flex items-center gap-2">
              <FaComments className="text-blue-900 dark:text-blue-400 shrink-0" />
              <span className="truncate">
                {loading ? "Course chat" : courseTitle}
              </span>
            </h1>
          </div>
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full shrink-0",
              connected
                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
            )}
          >
            {connected ? "● Live" : "○ Connecting…"}
          </span>
        </div>

        <Card className="overflow-hidden">
          <div className="flex flex-col h-[calc(100vh-13rem)] min-h-[420px]">
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {loading ? (
                <p className="text-center text-muted-foreground py-10 text-sm">
                  Loading messages…
                </p>
              ) : messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-10 text-sm">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((m) => {
                  const mine = isMine(m);
                  if (m.isAnnouncement) {
                    return (
                      <div key={m.id} className="flex justify-center py-1">
                        <div className="max-w-[90%] w-full rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 px-4 py-2.5">
                          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-1">
                            <FaBullhorn className="w-3 h-3" />
                            Announcement — {m.senderName ?? "Tutor"}
                            <span className="ml-auto font-normal">
                              <Moment format="MMM D, HH:mm">{m.createdAt}</Moment>
                            </span>
                          </div>
                          <p className="text-sm text-amber-900 dark:text-amber-100 whitespace-pre-wrap break-words">
                            {m.message}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={m.id}
                      className={cn("flex", mine ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                          mine
                            ? "bg-blue-700 text-white rounded-br-sm"
                            : "bg-accent text-foreground rounded-bl-sm",
                        )}
                      >
                        {!mine && (
                          <p
                            className={cn(
                              "text-[11px] font-semibold mb-0.5",
                              m.senderType === "TUTOR"
                                ? "text-purple-700 dark:text-purple-400"
                                : "text-blue-800 dark:text-blue-400",
                            )}
                          >
                            {m.senderName ?? `${m.senderType.toLowerCase()} #${m.senderId}`}
                            {m.senderType === "TUTOR" && " (Tutor)"}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap break-words">{m.message}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            mine ? "text-blue-200 text-right" : "text-muted-foreground",
                          )}
                        >
                          <Moment format="HH:mm">{m.createdAt}</Moment>
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-border space-y-2">
              {role === "TUTOR" && (
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={announcement}
                    onChange={(e) => setAnnouncement(e.target.checked)}
                    className="accent-amber-600"
                  />
                  <FaBullhorn className="w-3 h-3 text-amber-600" />
                  Send as announcement
                </label>
              )}
              <div className="flex items-center gap-2">
                <Input
                  placeholder={
                    announcement ? "Write an announcement…" : "Message the class…"
                  }
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={sending || loading}
                />
                <Button
                  onClick={handleSend}
                  disabled={sending || loading || !draft.trim()}
                  className={cn(
                    "shrink-0",
                    announcement
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-blue-700 hover:bg-blue-800",
                  )}
                  aria-label="Send message"
                >
                  <FaPaperPlane className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CourseChatPage;
