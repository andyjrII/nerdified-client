"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface TestimonialData {
  name: string;
  text: string;
  socialLinks: string[];
}

const testimonials: TestimonialData[] = [
  {
    name: "Chineye",
    text: "I honestly love how I was taught!",
    socialLinks: ["facebook", "twitter", "tiktok"],
  },
  {
    name: "Michael Owen",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    socialLinks: ["facebook", "instagram", "tiktok"],
  },
  {
    name: "John Smith",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    socialLinks: ["facebook", "twitter", "linkedin"],
  },
  {
    name: "Ismael Bennacer",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    socialLinks: ["facebook", "instagram", "linkedin", "twitter", "tiktok"],
  },
  {
    name: "Christian Pulisic",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    socialLinks: ["linkedin", "facebook", "twitter", "tiktok"],
  },
];

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case "facebook":
      return <FaFacebook className="h-5 w-5" />;
    case "twitter":
      return <FaTwitter className="h-5 w-5" />;
    case "instagram":
      return <FaInstagram className="h-5 w-5" />;
    case "tiktok":
      return <FaTiktok className="h-5 w-5" />;
    case "linkedin":
      return <FaLinkedin className="h-5 w-5" />;
    default:
      return null;
  }
};

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative max-w-3xl mx-auto">
        {/* Slides */}
        <div className="overflow-hidden rounded-lg">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 block" : "opacity-0 hidden"
              }`}
            >
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 items-stretch">
                  {/* Image - no background, centered */}
                  <div className="flex justify-center items-center">
                    <div className="relative w-[230px] h-[290px] rounded-t-lg md:rounded-t-none md:rounded-l-lg overflow-hidden flex items-center justify-center">
                      <Image
                        src="/images/testimonial/client-img.png"
                        alt={testimonial.name}
                        width={230}
                        height={290}
                        className="rounded-t-lg md:rounded-t-none md:rounded-l-lg object-cover"
                        unoptimized={true}
                        priority={index === 0}
                      />
                    </div>
                  </div>
                  {/* Quote / what was said - white background, slightly wider, content centered */}
                  <div className="md:col-span-2 flex flex-col justify-center items-center w-full md:pr-4">
                    <div className="bg-white rounded-2xl md:rounded-l-none md:rounded-r-2xl rounded-b-2xl md:rounded-b-2xl p-6 max-w-lg w-full flex flex-col justify-center text-center">
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-lg mb-4 flex items-center justify-center text-gray-800 text-left">
                        <FaQuoteLeft className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>{testimonial.text}</span>
                        <FaQuoteRight className="ml-2 text-blue-900 flex-shrink-0" />
                      </p>
                      <div className="flex items-center justify-center space-x-4">
                    {testimonial.socialLinks.map((platform, idx) => (
                      <button
                        key={idx}
                        className="text-blue-900 hover:text-blue-700 transition-colors"
                        aria-label={platform}
                      >
                        {getSocialIcon(platform)}
                      </button>
                    ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - positioned at edges of the max-w-3xl card */}
        <Button
          onClick={goToPrevious}
          variant="ghost"
          size="icon"
          className="absolute -left-14 md:-left-16 top-1/2 transform -translate-y-1/2 text-white hover:text-white/90 z-10"
          aria-label="Previous testimonial"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <Button
          onClick={goToNext}
          variant="ghost"
          size="icon"
          className="absolute -right-14 md:-right-16 top-1/2 transform -translate-y-1/2 text-white hover:text-white/90 z-10"
          aria-label="Next testimonial"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </Button>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-blue-900"
                  : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
