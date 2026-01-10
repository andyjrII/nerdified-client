"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaYoutube,
  FaWhatsapp,
  FaCopyright,
  FaBlogger,
} from "react-icons/fa";
import {
  IoInformationCircle,
  IoMail,
  IoCall,
  IoBook,
  IoHome,
  IoLocation,
} from "react-icons/io5";
// Logo will use /images/logo.png path

export const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white border-t border-blue-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Copyright */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <Image
                src="/images/logo.png"
                alt="<Nerdified />"
                width={120}
                height={40}
                className="mb-4"
              />
            </Link>
            <p className="text-sm text-gray-300 flex items-center space-x-2">
              <FaCopyright className="h-4 w-4" />
              <span>2024 Nerdified Africa</span>
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h6 className="font-semibold mb-4">JOIN US ON SOCIAL MEDIA</h6>
            <div className="space-y-3">
              <Link
                href="https://www.facebook.com/get-nerdifiedIT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 flex items-center space-x-2 text-sm"
              >
                <FaFacebook className="h-4 w-4" />
                <span>Get Nerdified</span>
              </Link>
              <Link
                href="https://www.youtube.com/channel/UC6X7jQL8km-8ILVVlOq_xjg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 flex items-center space-x-2 text-sm"
              >
                <FaYoutube className="h-4 w-4" />
                <span>GetNerdified</span>
              </Link>
              <Link
                href="https://wa.me/2349063368647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 flex items-center space-x-2 text-sm"
              >
                <FaWhatsapp className="h-4 w-4" />
                <span>+2349063368647</span>
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h6 className="font-semibold mb-4">CONTACT US</h6>
            <div className="space-y-3">
              <div className="text-white flex items-center space-x-2 text-sm">
                <IoLocation className="h-4 w-4" />
                <span>Efab Estate, Lokogoma, Abuja</span>
              </div>
              <Link
                href="mailto:nerdified.get@gmail.com"
                className="text-white hover:text-blue-300 flex items-center space-x-2 text-sm"
              >
                <IoMail className="h-4 w-4" />
                <span>nerdified.get@gmail.com</span>
              </Link>
              <div className="text-white flex items-center space-x-2 text-sm">
                <IoCall className="h-4 w-4" />
                <span>+2349063368647</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="font-semibold mb-4">QUICK LINKS</h6>
            <div className="space-y-3">
              <Link
                href="/"
                className="text-white hover:text-blue-300 flex items-center space-x-2 text-sm"
              >
                <IoHome className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/courses"
                className="text-white hover:text-blue-300 flex items-center space-x-2 text-sm"
              >
                <IoBook className="h-4 w-4" />
                <span>Courses</span>
              </Link>
              <Link
                href="/blog"
                className="text-white hover:text-blue-300 flex items-center space-x-2 text-sm"
              >
                <FaBlogger className="h-4 w-4" />
                <span>Blog</span>
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-blue-300 flex items-center space-x-2 text-sm"
              >
                <IoInformationCircle className="h-4 w-4" />
                <span>About Us</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
