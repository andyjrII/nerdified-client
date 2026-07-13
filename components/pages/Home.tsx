"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaVideo,
  FaUsers,
  FaUserGraduate,
  FaRegCalendarAlt,
  FaChartLine,
  FaShieldAlt,
  FaSearch,
  FaBookOpen,
  FaStar,
  FaArrowRight,
  FaPlay,
  FaCode,
  FaPalette,
  FaBriefcase,
  FaBullhorn,
  FaChartBar,
  FaSeedling,
  FaCheckCircle,
} from "react-icons/fa";

/* ---------- small helpers ---------- */

const Avatar = ({ label, className = "" }: { label: string; className?: string }) => (
  <span
    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${className}`}
  >
    {label}
  </span>
);

const Stars = () => (
  <span className="inline-flex text-amber-400">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar key={i} className="h-3.5 w-3.5" />
    ))}
  </span>
);

/* ---------- data ---------- */

const whyCards = [
  { icon: FaVideo, tint: "bg-blue-100 text-blue-600", title: "Live Interactive Sessions", body: "Learn in real time with expert tutors and ask questions as you go." },
  { icon: FaUsers, tint: "bg-emerald-100 text-emerald-600", title: "One-on-One or Groups", body: "Choose private sessions for personalized help or join small group classes." },
  { icon: FaRegCalendarAlt, tint: "bg-violet-100 text-violet-600", title: "Flexible Scheduling", body: "Book sessions that fit your time zone and your learning pace." },
  { icon: FaChartLine, tint: "bg-amber-100 text-amber-600", title: "Track Your Progress", body: "Monitor your learning, get feedback, and achieve your goals." },
  { icon: FaShieldAlt, tint: "bg-rose-100 text-rose-600", title: "Safe & Secure", body: "Verified tutors, secure payments, and a trusted learning environment." },
];

const stats = [
  { icon: FaUsers, value: "5,000+", label: "Active Learners" },
  { icon: FaUserGraduate, value: "300+", label: "Expert Tutors" },
  { icon: FaBookOpen, value: "1,200+", label: "Courses & Sessions" },
  { icon: FaStar, value: "98%", label: "Satisfaction Rate" },
];

const steps = [
  { icon: FaSearch, tint: "bg-blue-100 text-blue-600", title: "Find a Course", body: "Browse live courses or tutors and choose what you want to learn." },
  { icon: FaRegCalendarAlt, tint: "bg-emerald-100 text-emerald-600", title: "Book a Session", body: "Pick a date and time that works for you and book your slot instantly." },
  { icon: FaVideo, tint: "bg-violet-100 text-violet-600", title: "Join & Learn Live", body: "Join your live session, interact with your tutor, and master real skills." },
];

const categories = [
  { icon: FaCode, tint: "bg-blue-100 text-blue-600", title: "Programming", meta: "120+ Tutors" },
  { icon: FaPalette, tint: "bg-amber-100 text-amber-600", title: "Design", meta: "85+ Tutors" },
  { icon: FaBriefcase, tint: "bg-emerald-100 text-emerald-600", title: "Business", meta: "90+ Tutors" },
  { icon: FaBullhorn, tint: "bg-rose-100 text-rose-600", title: "Marketing", meta: "70+ Tutors" },
  { icon: FaChartBar, tint: "bg-indigo-100 text-indigo-600", title: "Data Science", meta: "60+ Tutors" },
  { icon: FaSeedling, tint: "bg-violet-100 text-violet-600", title: "Personal Dev.", meta: "50+ Tutors" },
];

const heroFeatures = [
  "Live Video Classes",
  "One-on-One & Group Sessions",
  "Hands-on Practice",
  "Mentorship & Support",
];

const testimonials = [
  { name: "Chinoye", role: "Frontend Developer", tint: "bg-blue-500", initials: "CH", quote: "I used to watch recorded videos and still feel stuck. With Nerdified, I can ask questions in real time and actually understand. It changed how I learn." },
  { name: "Fatima", role: "UI/UX Design Student", tint: "bg-violet-500", initials: "FA", quote: "Nerdified gave me the confidence and skills I needed to start my design career. The mentors are amazing and very supportive." },
  { name: "Tunde", role: "Digital Marketing Student", tint: "bg-emerald-500", initials: "TU", quote: "The live classes and hands-on practice made all the difference. I'm now managing social media for real clients!" },
];

/* ---------- page ---------- */

const Home = () => {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <div className="bg-white text-slate-900">
      {/* ===================== HERO ===================== */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
              Live <span className="text-blue-300">•</span> Interactive{" "}
              <span className="text-blue-300">•</span>{" "}
              <span className="text-slate-400">Personalized</span>
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Learn Real Skills.
              <br />
              From Real People.
              <br />
              <span className="relative inline-block text-blue-600">
                Live.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 8C40 3 160 3 198 8"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
              Join live, instructor-led classes with expert tutors — one-on-one
              or in small groups. No prerecorded lectures. Just real teaching,
              real interaction, and real growth.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Explore Live Courses <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <FaPlay className="h-3 w-3 text-blue-600" /> How It Works
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                <Avatar label="A" className="bg-blue-500" />
                <Avatar label="K" className="bg-violet-500" />
                <Avatar label="M" className="bg-emerald-500" />
                <Avatar label="T" className="bg-amber-500" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-800">
                  1,200+ students already learning with Nerdified
                </p>
                <Stars />
              </div>
            </div>
          </div>

          {/* Right — designed live-session stage */}
          <div className="relative">
            <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-6 shadow-2xl sm:p-8">
              <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live &
                Interactive
              </span>

              {/* mock live call */}
              <div className="mt-8 rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" /> LIVE
                    NOW
                  </span>
                  <span className="text-xs text-white/70">Group session</span>
                </div>
                <p className="mt-3 text-lg font-bold text-white">
                  UI/UX Design with Figma
                </p>
                <p className="text-sm text-white/70">
                  Interactive workshop · 8 of 12 joined
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <Avatar label="R" className="bg-rose-400" />
                    <Avatar label="J" className="bg-amber-400" />
                    <Avatar label="S" className="bg-emerald-400" />
                    <Avatar label="N" className="bg-sky-400" />
                  </div>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium text-white">
                    +4
                  </span>
                </div>
              </div>
            </div>

            {/* floating feature card */}
            <div className="absolute -bottom-6 -left-2 w-64 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:-left-6">
              <ul className="space-y-2.5">
                {heroFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <FaCheckCircle className="h-4 w-4 shrink-0 text-blue-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHY CHOOSE ===================== */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Why <span className="text-blue-600">learners</span> choose
              Nerdified
            </h2>
            <p className="mt-3 text-slate-600">
              We make live learning engaging, effective, and flexible.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {whyCards.map(({ icon: Icon, tint, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 rounded-3xl bg-slate-900 px-6 py-10 sm:px-10 lg:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">{value}</p>
                  <p className="text-sm text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-slate-600">Start learning in 3 simple steps.</p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            {steps.map(({ icon: Icon, tint, title, body }, i) => (
              <div key={title} className="relative text-center">
                {i < steps.length - 1 && (
                  <span className="absolute left-[calc(50%+3rem)] top-8 hidden w-[calc(100%-6rem)] border-t-2 border-dashed border-slate-200 md:block" />
                )}
                <div className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${tint}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">
                  {i + 1}. {title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FOR LEARNERS / FOR TUTORS ===================== */}
      <section className="pb-4">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Learners */}
          <div className="relative overflow-hidden rounded-3xl bg-blue-50 p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              For Learners
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Learn skills
              <br /> that matter
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              From tech to business, design to personal development — find the
              right tutor and learn in a way that works for you.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Explore Courses <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <FaCode className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">
                  Python for Beginners
                </p>
                <p className="text-xs text-slate-500">Today · 7:00 PM</p>
              </div>
            </div>
          </div>

          {/* Tutors */}
          <div className="relative overflow-hidden rounded-3xl bg-violet-50 p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
              For Tutors
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Teach what
              <br /> you love
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              Share your knowledge, inspire learners, and build a flexible
              online teaching business with Nerdified.
            </p>
            <Link
              href="/signup/tutor"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              Become a Tutor <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <FaChartLine className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">
                  You earned ₦250,000
                </p>
                <p className="text-xs text-slate-500">This month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CATEGORIES ===================== */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Popular categories
          </h2>
          <p className="mt-2 text-slate-600">
            Explore top subjects and in-demand skills.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map(({ icon: Icon, tint, title, meta }) => (
              <Link
                key={title}
                href="/courses"
                className="group rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{meta}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 rounded-3xl bg-slate-900 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-400">
                What learners say
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Real people.
                <br /> Real results.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                Our learners love the personal attention and real progress they
                get from live learning.
              </p>
            </div>

            <div>
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar label={t.initials} className={`${t.tint} h-11 w-11 text-sm`} />
                    <div>
                      <p className="font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                  <Stars />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="mt-5 flex justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === active ? "w-6 bg-blue-500" : "w-2 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-100 bg-slate-50 px-6 py-8 sm:flex-row sm:px-10">
            <div className="flex items-center gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 sm:flex">
                <FaBookOpen className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  Ready to start your learning journey?
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Join thousands of learners achieving their goals with live,
                  expert-led learning.
                </p>
              </div>
            </div>
            <Link
              href="/courses"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Browse Courses <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
