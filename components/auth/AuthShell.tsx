"use client";

import Link from "next/link";
import Image from "next/image";
import { FaVideo, FaUsers, FaShieldAlt, FaChartLine } from "react-icons/fa";

const features = [
  { icon: FaVideo, tint: "bg-indigo-100 text-indigo-600", title: "Live, Interactive Learning" },
  { icon: FaUsers, tint: "bg-emerald-100 text-emerald-600", title: "1-on-1 or Group Classes" },
  { icon: FaShieldAlt, tint: "bg-amber-100 text-amber-600", title: "Safe & Secure" },
  { icon: FaChartLine, tint: "bg-blue-100 text-blue-600", title: "Track Your Progress" },
];

interface AuthShellProps {
  children: React.ReactNode;
  /** Cross-link shown top-right of the form (e.g. "Don't have an account?"). */
  altText: string;
  altLabel: string;
  altHref: string;
  /** Widen the form column for multi-field signup forms. */
  wide?: boolean;
  /**
   * Lock the page to exactly one viewport height (100dvh) with no scroll.
   * Use for short forms (sign in); leave off for tall forms that may need to
   * scroll on very short screens.
   */
  fitViewport?: boolean;
}

export function AuthShell({ children, altText, altLabel, altHref, wide, fitViewport }: AuthShellProps) {
  return (
    <div
      className={`flex flex-col justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-100 px-4 py-4 sm:px-6 sm:py-6 ${
        fitViewport ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
      style={fitViewport ? { height: "100dvh" } : undefined}
    >
      <div className={wide ? "mx-auto w-full max-w-6xl" : "mx-auto w-full max-w-5xl"}>
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          {/* Brand / decorative column */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-8 text-white lg:flex">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-white/10" />

            <Link href="/" className="relative flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="Nerdified"
                width={40}
                height={40}
                className="rounded-full bg-white/90 p-1"
                unoptimized
              />
              <span className="flex flex-col leading-none">
                <span className="text-lg font-extrabold">Nerdified</span>
                <span className="mt-0.5 text-[11px] text-indigo-200">
                  Live Learning. Real Growth.
                </span>
              </span>
            </Link>

            <div className="relative space-y-1.5 py-6">
              {["Learn.", "Connect.", "Grow."].map((w, i) => (
                <p
                  key={w}
                  className="font-serif text-4xl font-light italic tracking-tight text-white/95"
                  style={{ marginLeft: `${i * 1.5}rem` }}
                >
                  {w}
                </p>
              ))}
            </div>

            <p className="relative text-sm italic text-indigo-100">
              Start your learning journey today!
            </p>
          </div>

          {/* Form column */}
          <div className="p-5 sm:p-8">
            <p className="mb-4 text-right text-sm text-slate-500">
              {altText}{" "}
              <Link href={altHref} className="font-semibold text-indigo-600 hover:text-indigo-700">
                {altLabel}
              </Link>
            </p>
            {children}
          </div>
        </div>

        {/* Features strip */}
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 backdrop-blur sm:grid-cols-4">
          {features.map(({ icon: Icon, tint, title }) => (
            <div key={title} className="flex items-center gap-2.5">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tint}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">{title}</p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          © 2026 Nerdified. All rights reserved.
        </p>
      </div>
    </div>
  );
}
