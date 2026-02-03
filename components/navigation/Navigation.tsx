"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  IoHomeSharp,
  IoBook,
  IoInformationCircle,
  IoCall,
} from "react-icons/io5";
import { FaBlogger, FaLock } from "react-icons/fa";
import { StudentDropdownMenu } from "./DropdownMenu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const { auth, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return null;
  }

  // Navigation links configuration
  const navLinks = [
    { href: "/", label: "HOME", icon: IoHomeSharp },
    { href: "/courses", label: "COURSES", icon: IoBook },
    { href: "/blog", label: "BLOG", icon: FaBlogger },
    { href: "/about", label: "ABOUT US", icon: IoInformationCircle },
    { href: "/contact", label: "CONTACT US", icon: IoCall },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="bg-blue-900 text-white shadow-md relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              alt="<Nerdified />"
              width={50}
              height={50}
              className="rounded-full object-cover aspect-square"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                Nerdified{" "}
                <span className="text-green-500">Afri</span>
                <span className="text-orange-500">ca</span>
              </span>
              <span className="text-xs text-gray-300">
                Educate. Empower. Nerdify.
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center space-x-2 px-2 py-3 transition-colors duration-200 group",
                    active
                      ? "text-orange-500"
                      : "text-white hover:text-orange-500"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      active ? "text-orange-500" : "text-white group-hover:text-orange-500"
                    )}
                  />
                  <span className="text-sm font-medium">{label}</span>
                  {/* Active/Hover Underline */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200",
                      active
                        ? "bg-orange-500"
                        : "bg-transparent group-hover:bg-orange-500"
                    )}
                  />
                </Link>
              );
            })}

            {!auth.email && (
              <Link
                href="/signin"
                className={cn(
                  "relative flex items-center space-x-2 px-2 py-3 transition-colors duration-200 group",
                  pathname === "/signin"
                    ? "text-orange-500"
                    : "text-white hover:text-orange-500"
                )}
              >
                <FaLock
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    pathname === "/signin"
                      ? "text-orange-500"
                      : "text-white group-hover:text-orange-500"
                  )}
                />
                <span className="text-sm font-medium">SIGN IN</span>
                {pathname === "/signin" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white p-2">
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* User Dropdown */}
          {auth.email && (
            <div className="hidden md:block">
              <StudentDropdownMenu />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
