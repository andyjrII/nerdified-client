"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaRegClock,
  FaPaperPlane,
  FaUser,
  FaTag,
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

const contactCards = [
  {
    icon: FaEnvelope,
    tint: "bg-blue-100 text-blue-600",
    title: "Email us",
    value: "nerdified.get@gmail.com",
    href: "mailto:nerdified.get@gmail.com",
  },
  {
    icon: FaPhoneAlt,
    tint: "bg-emerald-100 text-emerald-600",
    title: "Call us",
    value: "+234 906 336 8647",
    href: "tel:+2349063368647",
  },
  {
    icon: FaRegClock,
    tint: "bg-violet-100 text-violet-600",
    title: "Support hours",
    value: "Mon–Fri, 9am–6pm (WAT)",
    href: null,
  },
];

const inputBase =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission handled by browser mailto action
  };

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
            Get in touch
          </motion.span>

          <motion.h1
            className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
          >
            We&apos;d love to{" "}
            <span className="relative inline-block text-blue-600">
              hear from you
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
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          >
            Questions, feedback, or partnership ideas? Reach out and our team
            will get back to you as soon as we can.
          </motion.p>
        </div>
      </section>

      {/* ===================== CONTACT INFO CARDS ===================== */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {contactCards.map(({ icon: Icon, tint, title, value, href }, i) => {
            const body = (
              <div className="flex h-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {title}
                  </p>
                  <p className="mt-0.5 break-words text-sm font-semibold text-slate-800">
                    {value}
                  </p>
                </div>
              </div>
            );
            return (
              <motion.div key={title} variants={fadeUp} custom={i} {...inView}>
                {href ? (
                  <a href={href} className="block h-full">
                    {body}
                  </a>
                ) : (
                  body
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== FORM ===================== */}
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <motion.div
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
          variants={fadeUp}
          {...inView}
        >
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the form and we&apos;ll get back to you shortly.
            </p>

            <form
              action="mailto:nerdified.get@gmail.com"
              method="post"
              encType="text/plain"
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <div className="relative">
                  <FaUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <div className="relative">
                    <FaPhoneAlt className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="phone"
                      type="tel"
                      name="phone-number"
                      placeholder="+234 900 000 0000"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-sm font-medium text-slate-700">
                  Subject
                </label>
                <div className="relative">
                  <FaTag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Write your message…"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <FaPaperPlane className="h-3.5 w-3.5" /> Send Message
              </button>
            </form>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
