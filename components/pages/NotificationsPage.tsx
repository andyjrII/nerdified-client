"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AxiosInstance } from "axios";
import { FaBell, FaCheckDouble, FaRegBell } from "react-icons/fa";
import Moment from "react-moment";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NotificationsPageProps {
  axiosPrivate: AxiosInstance;
}

const NotificationsPage = ({ axiosPrivate }: NotificationsPageProps) => {
  const router = useRouter();
  const { items, unread, loading, fetchList, markRead, markAllRead } =
    useNotifications(axiosPrivate);

  useEffect(() => {
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once on mount
  }, []);

  const handleClick = async (id: number, read: boolean, link?: string | null) => {
    if (!read) await markRead(id);
    if (link) router.push(link);
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaBell className="text-blue-900 dark:text-blue-400" />
          Notifications
          {unread > 0 && (
            <span className="ml-1 text-sm bg-red-600 text-white rounded-full px-2 py-0.5">
              {unread}
            </span>
          )}
        </h1>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <FaCheckDouble className="mr-2 h-3 w-3" />
            Mark all read
          </Button>
        )}
      </div>

      {loading && items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Loading…</p>
      ) : items.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          <FaRegBell className="mx-auto mb-3 h-8 w-8 opacity-40" />
          <p>You&apos;re all caught up. No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <Card
              key={n.id}
              role="button"
              tabIndex={0}
              onClick={() => handleClick(n.id, n.read, n.link)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClick(n.id, n.read, n.link);
              }}
              className={cn(
                "p-4 cursor-pointer transition-colors hover:bg-accent",
                !n.read && "border-l-4 border-l-blue-700 bg-blue-50/50 dark:bg-blue-950/30",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={cn("font-medium", !n.read && "font-semibold")}>
                    {n.title}
                  </p>
                  <p className="text-sm text-muted-foreground break-words">
                    {n.message}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  <Moment fromNow>{n.createdAt}</Moment>
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
