"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { StudentDropdownMenu, TutorDropdownMenu } from "./DropdownMenu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export const Navigation = () => {
  const { auth, loading } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const showSignedIn = !loading && !!auth.email;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="Nerdified"
            width={40}
            height={40}
            className="aspect-square rounded-full object-cover"
            unoptimized
          />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Nerdified <span className="text-emerald-600">Africa</span>
            </span>
            <span className="mt-0.5 text-[10px] font-medium text-slate-400">
              Educate. Empower. Nerdify.
            </span>
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                {label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
          {showSignedIn ? (
            auth.role === "TUTOR" ? (
              <TutorDropdownMenu />
            ) : (
              <StudentDropdownMenu />
            )
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium",
                  isActive(href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {label}
              </Link>
            ))}
            {!showSignedIn && (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
