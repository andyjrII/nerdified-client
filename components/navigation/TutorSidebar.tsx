"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaBookOpen,
  FaCalendarAlt,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaDollarSign,
  FaUserFriends,
  FaBell,
  FaGlobe,
} from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useTutorAuth } from "@/hooks/useTutorAuth";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { useNotifications } from "@/hooks/useNotifications";
import { useTutorLogout } from "@/hooks/useTutorLogout";
import { getTutorProfile, setTutorProfile } from "@/utils/authStorage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { SyncLoader } from "react-spinners";
import { ThemeToggle } from "@/components/ThemeToggle";

const TutorSidebar = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const router = useRouter();
  const pathname = usePathname();
  const { auth } = useTutorAuth();
  const logout = useTutorLogout();
  const email = auth.email ?? "";
  const [tutor, setTutor] = useState<any>(null);
  const { unread: notificationCount } = useNotifications(axiosPrivate);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [navLoading, setNavLoading] = useState(false);

  useEffect(() => {
    if (email) {
      fetchTutor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  const fetchTutor = async () => {
    try {
      const response = await axiosPrivate.get(`tutors/me`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = response?.data;
      setTutor(data);
      if (data) setTutorProfile(data as Record<string, unknown>);
    } catch (error) {
      console.error("Error fetching tutor:", error);
      const cached = getTutorProfile();
      if (cached) setTutor(cached);
      else setTutor({ email, name: "Tutor" });
    }
  };

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      await logout();
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (pathname === href || navLoading) return;
    setNavLoading(true);
    router.push(href);
    setNavLoading(false);
  };

  const isActive = (path: string) => {
    if (path === "/tutor") {
      return pathname === "/tutor";
    }
    return pathname?.startsWith(path);
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: FaHome,
      href: "/tutor",
      exact: true,
    },
    {
      label: "My Courses",
      icon: FaBookOpen,
      href: "/tutor/courses",
    },
    {
      label: "Availability",
      icon: FaCalendarAlt,
      href: "/tutor/availability",
    },
    {
      label: "Messages",
      icon: FaComments,
      href: "/tutor/messages",
    },
    {
      label: "Notifications",
      icon: FaBell,
      href: "/tutor/notifications",
      badge: notificationCount > 0 ? notificationCount : undefined,
    },
    {
      label: "Students",
      icon: FaUserFriends,
      href: "/tutor/students",
    },
    {
      label: "Earnings",
      icon: FaDollarSign,
      href: "/tutor/earnings",
    },
    {
      label: "Settings",
      icon: FaCog,
      href: "/tutor/settings",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-purple-900 dark:bg-slate-900 text-white flex flex-col shadow-lg z-50 overflow-y-auto">
      {/* Logo/Header */}
      <div className="p-6 border-b border-purple-800 dark:border-slate-700">
        <Link
          href="/"
          className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
        >
          <div className="bg-purple-700 dark:bg-slate-700 p-2 rounded-lg">
            <FaChalkboardTeacher className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Tutor Portal</h2>
            <p className="text-xs text-purple-300 dark:text-slate-400">Dashboard</p>
          </div>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-purple-200 dark:text-slate-400 hover:text-white dark:hover:text-slate-100 transition-colors"
          >
            <FaGlobe className="w-4 h-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-purple-800 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full bg-purple-700 dark:bg-slate-700 overflow-hidden">
            {tutor?.imagePath ? (
              <Image
                src={tutor.imagePath}
                alt={tutor.name || "Tutor"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaChalkboardTeacher className="w-6 h-6 text-purple-300 dark:text-slate-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {tutor?.name || "Tutor"}
            </p>
            <p className="text-xs text-purple-300 dark:text-slate-400 truncate">
              {tutor?.email || email}
            </p>
            {tutor && !tutor.approved && (
              <Badge variant="outline" className="mt-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700 text-xs">
                Pending Approval
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative",
                    active
                      ? "bg-purple-800 dark:bg-slate-700 text-white font-semibold"
                      : "text-purple-200 dark:text-slate-400 hover:bg-purple-800/50 dark:hover:bg-slate-700/50 hover:text-white dark:hover:text-slate-100"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="ml-auto bg-red-500 text-white"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-purple-800 dark:border-slate-700">
        <Button
          onClick={handleLogout}
          disabled={logoutLoading}
          variant="ghost"
          className="w-full justify-start text-purple-200 dark:text-slate-400 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-wait"
        >
          {logoutLoading ? (
            <>
              <SyncLoader size={6} color="#ffffff" className="mr-3" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              Logout
            </>
          )}
        </Button>
      </div>

      {/* Global Loading Overlay */}
      {logoutLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-background border border-border rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
            <SyncLoader size={12} color="hsl(var(--primary))" />
            <p className="text-foreground font-medium">Logging out...</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default TutorSidebar;
