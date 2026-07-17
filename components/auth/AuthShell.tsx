"use client";

import Link from "next/link";
import Image from "next/image";
import { FaVideo, FaUsers, FaShieldAlt, FaChartLine } from "react-icons/fa";

const features = [
  { icon: FaVideo, tint: "bg-indigo-100 text-indigo-600", title: "Live, Interactive Learning", body: "Engage in real-time sessions with expert tutors." },
  { icon: FaUsers, tint: "bg-emerald-100 text-emerald-600", title: "1-on-1 or Group Classes", body: "Choose the format that fits your learning style." },
  { icon: FaShieldAlt, tint: "bg-amber-100 text-amber-600", title: "Safe & Secure", body: "Your data and payments are always protected." },
  { icon: FaChartLine, tint: "bg-blue-100 text-blue-600", title: "Track Your Progress", body: "Monitor your growth and achieve your goals." },
];

interface AuthShellProps {
  children: React.ReactNode;
  /** Cross-link shown top-right of the form (e.g. "Don't have an account?"). */
  altText: string;
  altLabel: string;
  altHref: string;
  /** Widen the form column for multi-field signup forms. */
  wide?: boolean;
}

export function AuthShell({ children, altText, altLabel, altHref, wide }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-100 px-4 py-8 sm:px-6 lg:py-12">
      <div className={wide ? "mx-auto max-w-6xl" : "mx-auto max-w-5xl"}>
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          {/* Brand / decorative column */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-10 text-white lg:flex">
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

            <div className="relative space-y-2 py-10">
              {["Learn.", "Connect.", "Grow."].map((w, i) => (
                <p
                  key={w}
                  className="font-serif text-5xl font-light italic tracking-tight text-white/95"
                  style={{ marginLeft: `${i * 1.75}rem` }}
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
          <div className="p-6 sm:p-10">
            <p className="mb-6 text-right text-sm text-slate-500">
              {altText}{" "}
              <Link href={altHref} className="font-semibold text-indigo-600 hover:text-indigo-700">
                {altLabel}
              </Link>
            </p>
            {children}
          </div>
        </div>

        {/* Features strip */}
        <div className="mt-6 grid grid-cols-1 gap-6 rounded-2xl border border-slate-100 bg-white/70 p-6 backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, tint, title, body }) => (
            <div key={title} className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tint}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <p className="text-xs leading-snug text-slate-500">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 Nerdified. All rights reserved.
        </p>
      </div>
    </div>
  );
}
