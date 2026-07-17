"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaBookOpen,
  FaCalendarAlt,
  FaComments,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaUserGraduate,
  FaBell,
  FaGlobe,
} from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useNotifications } from "@/hooks/useNotifications";
import { useLogout } from "@/hooks/useLogout";
import { getStudentProfile, setStudentProfile } from "@/utils/authStorage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { SyncLoader } from "react-spinners";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaClock, FaPhone } from "react-icons/fa";
import Moment from "react-moment";

const StudentSidebar = () => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const pathname = usePathname();
  const { auth } = useAuth();
  const logout = useLogout();
  const email = auth.email ?? "";
  const [student, setStudent] = useState<any>(null);
  const { unread: notificationCount } = useNotifications(axiosPrivate);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  useEffect(() => {
    if (email) {
      fetchStudent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  // Reset image error when student image path changes
  useEffect(() => {
    setProfileImageError(false);
  }, [student?.imagePath]);

  const fetchStudent = async () => {
    try {
      const response = await axiosPrivate.get(`students/${email}`);
      const data = response?.data;
      setStudent(data);
      if (data) setStudentProfile(data as Record<string, unknown>);
    } catch (error) {
      console.error("Error fetching student:", error);
      const cached = getStudentProfile();
      if (cached) setStudent(cached);
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

  const isActive = (path: string) => {
    if (path === "/student") {
      return pathname === "/student";
    }
    return pathname?.startsWith(path);
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: FaHome,
      href: "/student",
      exact: true,
    },
    {
      label: "My Courses",
      icon: FaBookOpen,
      href: "/student/courses",
    },
    {
      label: "Upcoming Sessions",
      icon: FaCalendarAlt,
      href: "/student/sessions",
    },
    {
      label: "Messages",
      icon: FaComments,
      href: "/student/messages",
    },
    {
      label: "Notifications",
      icon: FaBell,
      href: "/student/notifications",
      badge: notificationCount > 0 ? notificationCount : undefined,
    },
    {
      label: "Wishlist",
      icon: FaHeart,
      href: "/student/wishlist",
    },
    {
      label: "Settings",
      icon: FaCog,
      href: "/student/settings",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-blue-900 dark:bg-slate-900 text-white flex flex-col shadow-lg z-50 overflow-y-auto">
      {/* Logo/Header */}
      <div className="p-6 border-b border-blue-800 dark:border-slate-700">
        <Link
          href="/"
          className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
        >
          <div className="bg-blue-700 dark:bg-slate-700 p-2 rounded-lg">
            <FaUserGraduate className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Student Portal</h2>
            <p className="text-xs text-blue-300 dark:text-slate-400">Dashboard</p>
          </div>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-blue-200 dark:text-slate-400 hover:text-white dark:hover:text-slate-100 transition-colors"
          >
            <FaGlobe className="w-4 h-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* User Profile - click image for details */}
      <div className="p-4 border-b border-blue-800 dark:border-slate-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 w-full text-left rounded-lg hover:bg-blue-800/50 dark:hover:bg-slate-700/50 p-1 -m-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Open profile details"
            >
              <div className="relative w-12 h-12 rounded-full bg-blue-700 dark:bg-slate-700 overflow-hidden shrink-0">
                {student?.imagePath && !profileImageError ? (
                  <Image
                    src={student.imagePath}
                    alt={student.name || "Student"}
                    fill
                    className="object-cover"
                    onError={() => setProfileImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUserGraduate className="w-6 h-6 text-blue-300 dark:text-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-white">
                  {student?.name || "Student"}
                </p>
                <p className="text-xs text-blue-300 dark:text-slate-400 truncate">
                  {student?.email || email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={8}
            className="w-64 p-3 bg-popover text-popover-foreground"
          >
            <p className="font-semibold text-sm mb-1">{student?.name || "Student"}</p>
            <p className="text-xs text-muted-foreground mb-3 truncate">{student?.email || email}</p>
            <div className="space-y-2 pt-2 border-t border-border">
              {student?.phoneNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <FaPhone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>{student.phoneNumber}</span>
                </div>
              )}
              {student?.createdAt && (
                <div className="flex items-center gap-2 text-sm">
                  <FaClock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>Member since <Moment format="MMM YYYY">{student.createdAt}</Moment></span>
                </div>
              )}
              {!student?.phoneNumber && !student?.createdAt && (
                <p className="text-xs text-muted-foreground">No extra details yet.</p>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
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
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    active
                      ? "bg-blue-800 dark:bg-slate-700 text-white font-semibold"
                      : "text-blue-200 dark:text-slate-400 hover:bg-blue-800/50 dark:hover:bg-slate-700/50 hover:text-white dark:hover:text-slate-100"
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
      <div className="p-4 border-t border-blue-800 dark:border-slate-700">
        <Button
          onClick={handleLogout}
          disabled={logoutLoading}
          variant="ghost"
          className="w-full justify-start text-blue-200 dark:text-slate-400 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-wait"
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

export default StudentSidebar;
