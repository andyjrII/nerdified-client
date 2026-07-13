"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const quickLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/signup/tutor", label: "For Tutors" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

const supportLinks = [
  { href: "/contact", label: "Help Center" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/community", label: "Community Guidelines" },
];

const socials = [
  { href: "https://www.facebook.com/get-nerdifiedIT", Icon: FaFacebookF, label: "Facebook" },
  { href: "https://twitter.com", Icon: FaTwitter, label: "Twitter" },
  { href: "https://instagram.com", Icon: FaInstagram, label: "Instagram" },
  { href: "https://linkedin.com", Icon: FaLinkedinIn, label: "LinkedIn" },
  { href: "https://www.youtube.com/channel/UC6X7jQL8km-8ILVVlOq_xjg", Icon: FaYoutube, label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="Nerdified"
                width={36}
                height={36}
                className="aspect-square rounded-full object-cover"
                unoptimized
              />
              <span className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight text-white">
                  Nerdified
                </span>
                <span className="mt-0.5 text-[10px] font-medium text-slate-500">
                  Live Learning. Real Growth.
                </span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Nerdified connects learners with expert tutors for live,
              interactive sessions that drive real results.
            </p>
            <div className="flex gap-2">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-colors hover:bg-blue-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h6 className="mb-4 text-sm font-semibold text-white">Quick Links</h6>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-slate-400 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h6 className="mb-4 text-sm font-semibold text-white">Support</h6>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-slate-400 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h6 className="mb-4 text-sm font-semibold text-white">Contact Us</h6>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <FaEnvelope className="h-4 w-4 shrink-0 text-slate-500" />
                <a href="mailto:hello@nerdified.com" className="hover:text-white">
                  hello@nerdified.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FaPhoneAlt className="h-4 w-4 shrink-0 text-slate-500" />
                <a href="tel:+2349063368647" className="hover:text-white">
                  +234 906 336 8647
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FaMapMarkerAlt className="h-4 w-4 shrink-0 text-slate-500" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="pt-1 text-slate-500">We&apos;re here to help!</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © 2026 Nerdified. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
