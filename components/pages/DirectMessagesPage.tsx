"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { AxiosInstance } from "axios";
import Moment from "react-moment";
import {
  FaArrowLeft,
  FaCheck,
  FaCheckDouble,
  FaComments,
  FaPaperPlane,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import {
  useChatSocket,
  ChatDirectMessage,
  ConversationPartner,
} from "@/hooks/useChatSocket";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DirectMessagesPageProps {
  axiosPrivate: AxiosInstance;
  role: "STUDENT" | "TUTOR";
}

const DirectMessagesPage = ({ axiosPrivate, role }: DirectMessagesPageProps) => {
  const searchParams = useSearchParams();
  const partnerType = role === "STUDENT" ? "TUTOR" : "STUDENT";
  const { socket, connected } = useChatSocket();

  const [partners, setPartners] = useState<ConversationPartner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [selected, setSelected] = useState<ConversationPartner | null>(null);
  const [messages, setMessages] = useState<ChatDirectMessage[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const selectedRef = useRef<ConversationPartner | null>(null);
  selectedRef.current = selected;

  /** A message in my feed was sent by me iff its senderType is my role. */
  const sentByMe = useCallback(
    (m: ChatDirectMessage) => m.senderType === role,
    [role],
  );

  /** The other party of a message in my feed. */
  const partnerIdOf = useCallback(
    (m: ChatDirectMessage) => {
      if (role === "STUDENT")
        return sentByMe(m) ? m.tutorReceiverId : m.tutorSenderId;
      return sentByMe(m) ? m.studentReceiverId : m.studentSenderId;
    },
    [role, sentByMe],
  );

  const fetchPartners = useCallback(async () => {
    try {
      const res = await axiosPrivate.get(
        `messages/direct/partners?userType=${role}`,
      );
      setPartners(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching conversation partners:", error);
    } finally {
      setPartnersLoading(false);
    }
  }, [axiosPrivate, role]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Preselect ?partner=<id> once partners have loaded.
  const preselectId = searchParams.get("partner");
  useEffect(() => {
    if (!preselectId || selectedRef.current || !partners.length) return;
    const match = partners.find((p) => String(p.id) === preselectId);
    if (match) setSelected(match);
  }, [preselectId, partners]);

  const markThreadRead = useCallback(
    async (thread: ChatDirectMessage[], partnerId: number) => {
      const unread = thread.filter((m) => !sentByMe(m) && !m.read);
      if (!unread.length) return;
      setPartners((prev) =>
        prev.map((p) => (p.id === partnerId ? { ...p, unreadCount: 0 } : p)),
      );
      await Promise.all(
        unread.map((m) =>
          axiosPrivate
            .patch(`messages/direct/${m.id}/read?userType=${role}`)
            .catch(() => undefined),
        ),
      );
    },
    [axiosPrivate, role, sentByMe],
  );

  // Load the thread when a partner is selected.
  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    (async () => {
      setThreadLoading(true);
      try {
        const res = await axiosPrivate.get(
          `messages/direct/conversation?userType=${role}&otherUserId=${selected.id}&otherUserType=${partnerType}`,
        );
        if (cancelled) return;
        const thread: ChatDirectMessage[] = Array.isArray(res?.data)
          ? res.data
          : [];
        setMessages(thread);
        void markThreadRead(thread, selected.id);
      } catch (error) {
        console.error("Error fetching conversation:", error);
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setThreadLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [axiosPrivate, role, partnerType, selected, markThreadRead]);

  // Live updates over the socket.
  useEffect(() => {
    if (!socket) return;

    const onNew = (m: ChatDirectMessage) => {
      const partnerId = partnerIdOf(m);
      if (!partnerId) return;
      const current = selectedRef.current;

      if (current && partnerId === current.id) {
        setMessages((prev) =>
          prev.some((x) => x.id === m.id) ? prev : [...prev, m],
        );
        if (!sentByMe(m)) {
          void axiosPrivate
            .patch(`messages/direct/${m.id}/read?userType=${role}`)
            .catch(() => undefined);
        }
      }

      setPartners((prev) => {
        const known = prev.find((p) => p.id === partnerId);
        if (!known) {
          // First-ever message from someone new: refresh the list.
          void fetchPartners();
          return prev;
        }
        return prev.map((p) =>
          p.id === partnerId
            ? {
                ...p,
                lastMessage: m.message,
                lastMessageAt: m.createdAt,
                unreadCount:
                  !sentByMe(m) && (!current || current.id !== partnerId)
                    ? p.unreadCount + 1
                    : p.unreadCount,
              }
            : p,
        );
      });
    };

    const onRead = (payload: { id: number; readAt: string | null }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === payload.id ? { ...m, read: true, readAt: payload.readAt } : m,
        ),
      );
    };

    socket.on("direct:new", onNew);
    socket.on("direct:read", onRead);
    return () => {
      socket.off("direct:new", onNew);
      socket.off("direct:read", onRead);
    };
  }, [socket, axiosPrivate, role, partnerIdOf, sentByMe, fetchPartners]);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !selected || sending) return;
    setSending(true);
    try {
      const res = await axiosPrivate.post(
        `messages/direct?senderType=${role}`,
        {
          receiverId: selected.id,
          receiverType: partnerType,
          message: text,
        },
      );
      const created: ChatDirectMessage = res?.data;
      setDraft("");
      // The socket echoes our own message back; dedupe by id.
      if (created?.id) {
        setMessages((prev) =>
          prev.some((x) => x.id === created.id) ? prev : [...prev, created],
        );
        setPartners((prev) =>
          prev.map((p) =>
            p.id === selected.id
              ? { ...p, lastMessage: created.message, lastMessageAt: created.createdAt }
              : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const filteredPartners = useMemo(
    () =>
      partners.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.email?.toLowerCase().includes(search.toLowerCase()),
      ),
    [partners, search],
  );

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FaComments className="text-blue-900 dark:text-blue-400" />
            Messages
          </h1>
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full",
              connected
                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
            )}
          >
            {connected ? "● Live" : "○ Connecting…"}
          </span>
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[320px,1fr] h-[calc(100vh-14rem)] min-h-[420px]">
            {/* Partners list */}
            <div
              className={cn(
                "border-r border-border flex-col min-h-0",
                selected ? "hidden md:flex" : "flex",
              )}
            >
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                  <Input
                    placeholder={`Search ${partnerType.toLowerCase()}s…`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {partnersLoading ? (
                  <p className="text-center text-muted-foreground py-10 text-sm">
                    Loading conversations…
                  </p>
                ) : filteredPartners.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10 px-4 text-sm">
                    {role === "STUDENT"
                      ? "Enroll in a course to message its tutor."
                      : "Students who enroll in your courses will appear here."}
                  </p>
                ) : (
                  filteredPartners.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className={cn(
                        "w-full text-left px-4 py-3 border-b border-border/60 hover:bg-accent transition-colors flex items-center gap-3",
                        selected?.id === p.id && "bg-accent",
                      )}
                    >
                      <FaUserCircle className="w-9 h-9 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">
                            {p.name || p.email}
                          </p>
                          {p.lastMessageAt && (
                            <span className="text-[11px] text-muted-foreground shrink-0">
                              <Moment fromNow ago>
                                {p.lastMessageAt}
                              </Moment>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm text-muted-foreground truncate">
                            {p.lastMessage ?? "Start a conversation"}
                          </p>
                          {p.unreadCount > 0 && (
                            <span className="bg-blue-700 text-white text-[11px] rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center shrink-0">
                              {p.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Thread */}
            <div
              className={cn(
                "flex-col min-h-0",
                selected ? "flex" : "hidden md:flex",
              )}
            >
              {!selected ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FaComments className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>Select a conversation to start messaging.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                    <button
                      className="md:hidden text-muted-foreground"
                      onClick={() => setSelected(null)}
                      aria-label="Back to conversations"
                    >
                      <FaArrowLeft />
                    </button>
                    <FaUserCircle className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <p className="font-semibold leading-tight">
                        {selected.name || selected.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {partnerType === "TUTOR" ? "Tutor" : "Student"}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                    {threadLoading ? (
                      <p className="text-center text-muted-foreground py-10 text-sm">
                        Loading messages…
                      </p>
                    ) : messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-10 text-sm">
                        No messages yet. Say hello!
                      </p>
                    ) : (
                      messages.map((m) => {
                        const mine = sentByMe(m);
                        return (
                          <div
                            key={m.id}
                            className={cn(
                              "flex",
                              mine ? "justify-end" : "justify-start",
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                                mine
                                  ? "bg-blue-700 text-white rounded-br-sm"
                                  : "bg-accent text-foreground rounded-bl-sm",
                              )}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {m.message}
                              </p>
                              <div
                                className={cn(
                                  "flex items-center gap-1 mt-1 text-[10px]",
                                  mine
                                    ? "text-blue-200 justify-end"
                                    : "text-muted-foreground",
                                )}
                              >
                                <Moment format="HH:mm">{m.createdAt}</Moment>
                                {mine &&
                                  (m.read ? (
                                    <FaCheckDouble className="w-3 h-3" />
                                  ) : (
                                    <FaCheck className="w-3 h-3" />
                                  ))}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={bottomRef} />
                  </div>

                  <div className="p-3 border-t border-border flex items-center gap-2">
                    <Input
                      placeholder="Type a message…"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      disabled={sending}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={sending || !draft.trim()}
                      className="bg-blue-700 hover:bg-blue-800 shrink-0"
                      aria-label="Send message"
                    >
                      <FaPaperPlane className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DirectMessagesPage;
