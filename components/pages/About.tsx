"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
  FaArrowRight,
  FaBullseye,
  FaRegEye,
  FaVideo,
  FaUsers,
  FaUserGraduate,
  FaRegCalendarAlt,
  FaChartLine,
  FaShieldAlt,
  FaBookOpen,
  FaGlobeAfrica,
} from "react-icons/fa";

/* ---------- motion helpers (shared with the landing page) ---------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const inView = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, amount: 0.2 },
};

/* ---------- data ---------- */

const stats = [
  { icon: FaUsers, value: "5,000+", label: "Active Learners" },
  { icon: FaUserGraduate, value: "300+", label: "Expert Tutors" },
  { icon: FaBookOpen, value: "1,200+", label: "Courses & Sessions" },
  { icon: FaGlobeAfrica, value: "98%", label: "Satisfaction Rate" },
];

const values = [
  { icon: FaVideo, tint: "bg-blue-100 text-blue-600", title: "Live, Interactive Sessions", body: "Real-time classes with expert tutors — ask questions and learn as you go." },
  { icon: FaUsers, tint: "bg-emerald-100 text-emerald-600", title: "One-on-One or Groups", body: "Choose private sessions for personal help or join small, focused groups." },
  { icon: FaUserGraduate, tint: "bg-violet-100 text-violet-600", title: "Expert, Verified Tutors", body: "Learn from vetted professionals who teach real, in-demand skills." },
  { icon: FaRegCalendarAlt, tint: "bg-amber-100 text-amber-600", title: "Flexible Scheduling", body: "Book sessions that fit your time zone and your own pace." },
  { icon: FaChartLine, tint: "bg-rose-100 text-rose-600", title: "Mentorship & Progress", body: "Get guidance, feedback, and track your growth toward your goals." },
  { icon: FaShieldAlt, tint: "bg-indigo-100 text-indigo-600", title: "Safe & Secure", body: "Secure payments and a trusted, moderated learning environment." },
];

const About = () => {
  return (
    <div className="bg-white text-slate-900">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 ring-1 ring-blue-100"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            About Nerdified
          </motion.span>

          <motion.h1
            className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
          >
            Building a nerd culture across{" "}
            <span className="relative inline-block text-blue-600">
              Africa
              <svg className="absolute -bottom-1.5 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden>
                <motion.path
                  d="M2 8C40 3 160 3 198 8"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.9, ease: "easeInOut" }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          >
            Nerdified connects learners with expert tutors for live, interactive
            sessions — unlocking Africa&apos;s potential through technology and
            education, one class at a time.
          </motion.p>
        </div>
      </section>

      {/* ===================== MISSION & VISION ===================== */}
      <section className="mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mission */}
          <motion.div
            className="overflow-hidden rounded-3xl bg-blue-50 p-8 sm:p-10"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <FaBullseye className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
              Our Mission
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Building a nerd culture in Africa by unlocking the continent&apos;s
              potential through technology and education — driving digital
              transformation, economic growth, and sustainable development.
            </p>
            <div className="relative mt-6 overflow-hidden rounded-2xl">
              <Image
                src="/images/navpages/about-mission.jpeg"
                alt="Our mission"
                width={800}
                height={500}
                className="h-48 w-full object-cover sm:h-56"
              />
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            className="overflow-hidden rounded-3xl bg-violet-50 p-8 sm:p-10"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white">
              <FaRegEye className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
              Our Vision
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Empowering Africa&apos;s tech potential for a sustainable and
              prosperous future — where anyone, anywhere can learn real skills
              from real people and grow without limits.
            </p>
            <div className="relative mt-6 overflow-hidden rounded-2xl">
              <Image
                src="/images/navpages/about-vision.jpeg"
                alt="Our vision"
                width={800}
                height={500}
                className="h-48 w-full object-cover sm:h-56"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== WHAT WE OFFER ===================== */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-2xl text-center" variants={fadeUp} {...inView}>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              What makes Nerdified <span className="text-blue-600">different</span>
            </h2>
            <p className="mt-3 text-slate-600">
              Live learning that&apos;s engaging, effective, and built around you.
            </p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon: Icon, tint, title, body }, i) => (
              <motion.div key={title} variants={fadeUp} custom={i} {...inView}>
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 gap-6 rounded-3xl bg-slate-900 px-6 py-10 sm:px-10 lg:grid-cols-4"
            variants={fadeUp}
            {...inView}
          >
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
          </motion.div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-100 bg-slate-50 px-6 py-8 sm:flex-row sm:px-10"
            variants={fadeUp}
            {...inView}
          >
            <div className="flex items-center gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 sm:flex">
                <FaBookOpen className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  Ready to learn with Nerdified?
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Join thousands of learners growing their skills through live,
                  expert-led sessions.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Browse Courses <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/signup/tutor"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Become a Tutor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
