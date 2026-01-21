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
} from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useTutorAuth } from "@/hooks/useTutorAuth";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { useLoadingNavigation } from "@/hooks/useLoadingNavigation";
import db from "@/utils/localBase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { SyncLoader } from "react-spinners";

const TutorSidebar = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const router = useRouter();
  const pathname = usePathname();
  const { auth } = useTutorAuth();
  const { loading: navLoading, navigate } = useLoadingNavigation();
  const [email, setEmail] = useState<string>("");
  const [tutor, setTutor] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchEmail();
        if (email) {
          await fetchTutor();
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
      const data = await db.collection("auth_tutor").get();
      if (data.length > 0) {
        setEmail(data[0].email);
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  const fetchTutor = async () => {
    try {
      // Fetch tutor using /tutors/me endpoint (from JWT)
      const response = await axiosPrivate.get(`tutors/me`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setTutor(response?.data);
      // Cache in localbase
      await db.collection("tutor").doc(email).set(response?.data);
    } catch (error) {
      console.error("Error fetching tutor:", error);
      try {
        const localTutor = await db.collection("tutor").doc(email).get();
        setTutor(localTutor);
      } catch (localError) {
        console.error("Error fetching from localBase:", localError);
        // Use placeholder if all else fails
        setTutor({ email, name: "Tutor" });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axiosPrivate.post(`auth/tutor/signout?email=${email}`, null, {
        withCredentials: true,
      });
      await db.collection("auth_tutor").delete();
      await db.collection("tutor").delete();
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage and redirect
      await db.collection("auth_tutor").delete();
      await db.collection("tutor").delete();
      router.push("/signin");
    }
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
      label: "Sessions",
      icon: FaCalendarAlt,
      href: "/tutor/sessions",
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
    <aside className="fixed left-0 top-0 w-64 h-screen bg-purple-900 text-white flex flex-col shadow-lg z-50 overflow-y-auto">
      {/* Logo/Header */}
      <div className="p-6 border-b border-purple-800">
        <div className="flex items-center gap-3">
          <div className="bg-purple-700 p-2 rounded-lg">
            <FaChalkboardTeacher className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Tutor Portal</h2>
            <p className="text-xs text-purple-300">Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-purple-800">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full bg-purple-700 overflow-hidden">
            {tutor?.imagePath ? (
              <Image
                src={tutor.imagePath}
                alt={tutor.name || "Tutor"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaChalkboardTeacher className="w-6 h-6 text-purple-300" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {tutor?.name || "Tutor"}
            </p>
            <p className="text-xs text-purple-300 truncate">
              {tutor?.email || email}
            </p>
            {tutor && !tutor.approved && (
              <Badge variant="outline" className="mt-1 bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
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
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative",
                    active
                      ? "bg-purple-800 text-white font-semibold"
                      : "text-purple-200 hover:bg-purple-800/50 hover:text-white",
                    navLoading && pathname !== item.href ? "opacity-50 cursor-wait" : ""
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", navLoading && !active ? "opacity-50" : "")} />
                  <span className="flex-1">{item.label}</span>
                  {navLoading && !active && (
                    <SyncLoader size={4} color="#ffffff" className="ml-auto" />
                  )}
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
      <div className="p-4 border-t border-purple-800">
        <Button
          onClick={handleLogout}
          disabled={logoutLoading}
          variant="ghost"
          className="w-full justify-start text-purple-200 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-wait"
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
      {(navLoading || logoutLoading) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
            <SyncLoader size={12} color="#a855f7" />
            <p className="text-gray-700 font-medium">
              {logoutLoading ? "Logging out..." : "Loading..."}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default TutorSidebar;
