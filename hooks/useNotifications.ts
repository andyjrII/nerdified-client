"use client";

import { useCallback, useEffect, useState } from "react";
import { AxiosInstance } from "axios";

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
}

interface NotificationsListResponse {
  items: AppNotification[];
  total: number;
  unread: number;
  page: number;
  pageSize: number;
}

const POLL_INTERVAL_MS = 30_000;

/**
 * Shared notifications client. Pass the role-specific axios instance
 * (useAxiosPrivate / useTutorAxiosPrivate). Polls the unread count so the
 * sidebar badge stays current; the list is fetched on demand.
 */
export const useNotifications = (
  axiosPrivate: AxiosInstance,
  enabled = true,
) => {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = await axiosPrivate.get("notifications/unread-count");
      setUnread(res?.data?.count ?? 0);
    } catch {
      // Non-fatal: leave the previous count in place.
    }
  }, [axiosPrivate, enabled]);

  const fetchList = useCallback(
    async (page = 1) => {
      if (!enabled) return;
      setLoading(true);
      try {
        const res = await axiosPrivate.get(`notifications?page=${page}`);
        const data = res?.data as NotificationsListResponse;
        setItems(data?.items ?? []);
        setUnread(data?.unread ?? 0);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [axiosPrivate, enabled],
  );

  const markRead = useCallback(
    async (id: number) => {
      try {
        await axiosPrivate.patch(`notifications/${id}/read`);
        setItems((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        setUnread((u) => Math.max(0, u - 1));
      } catch {
        // ignore
      }
    },
    [axiosPrivate],
  );

  const markAllRead = useCallback(async () => {
    try {
      await axiosPrivate.patch("notifications/read-all");
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch {
      // ignore
    }
  }, [axiosPrivate]);

  useEffect(() => {
    if (!enabled) return;
    fetchUnreadCount();
    const id = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled, fetchUnreadCount]);

  return { items, unread, loading, fetchList, fetchUnreadCount, markRead, markAllRead };
};
