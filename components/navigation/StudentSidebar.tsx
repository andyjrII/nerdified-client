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
import db from "@/utils/localBase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { SyncLoader } from "react-spinners";

const StudentSidebar = () => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const pathname = usePathname();
  const { auth } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [student, setStudent] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchEmail();
        if (email) {
          await fetchStudent();
          // TODO: Fetch notification count
          // await fetchNotificationCount();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    initializeData();
  }, [email]);

  const fetchEmail = async () => {
    try {
      const data = await db.collection("auth_student").get();
      if (data.length > 0) {
        setEmail(data[0].email);
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  const fetchStudent = async () => {
    try {
      const response = await axiosPrivate.get(`students/${email}`);
      setStudent(response?.data);
    } catch (error) {
      console.error("Error fetching student:", error);
      try {
        const localStudent = await db.collection("student").doc(email).get();
        setStudent(localStudent);
      } catch (localError) {
        console.error("Error fetching from localBase:", localError);
      }
    }
  };

  const handleLogout = async () => {
    if (logoutLoading) return; // Prevent double clicks
    setLogoutLoading(true);
    try {
      await axiosPrivate.post(
        `auth/signout?email=${email}`,
        null,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      await db.collection("auth_student").delete();
      await db.collection("student").delete();
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage and redirect
      await db.collection("auth_student").delete();
      await db.collection("student").delete();
      router.push("/signin");
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
    <aside className="fixed left-0 top-0 w-64 h-screen bg-blue-900 text-white flex flex-col shadow-lg z-50 overflow-y-auto">
      {/* Logo/Header */}
      <div className="p-6 border-b border-blue-800">
        <Link
          href="/"
          className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
        >
          <div className="bg-blue-700 p-2 rounded-lg">
            <FaUserGraduate className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Student Portal</h2>
            <p className="text-xs text-blue-300">Dashboard</p>
          </div>
        </Link>
        <Link
          href="/"
          className="mt-3 flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors"
        >
          <FaGlobe className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full bg-blue-700 overflow-hidden">
            {student?.imagePath ? (
              <Image
                src={student.imagePath}
                alt={student.name || "Student"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUserGraduate className="w-6 h-6 text-blue-300" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {student?.name || "Student"}
            </p>
            <p className="text-xs text-blue-300 truncate">
              {student?.email || email}
            </p>
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
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    active
                      ? "bg-blue-800 text-white font-semibold"
                      : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
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
      <div className="p-4 border-t border-blue-800">
        <Button
          onClick={handleLogout}
          disabled={logoutLoading}
          variant="ghost"
          className="w-full justify-start text-blue-200 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-wait"
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
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
            <SyncLoader size={12} color="#3b82f6" />
            <p className="text-gray-700 font-medium">Logging out...</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default StudentSidebar;
