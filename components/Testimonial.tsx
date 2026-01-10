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
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="relative">
        {/* Slides */}
        <div className="overflow-hidden rounded-lg">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 block" : "opacity-0 hidden"
              }`}
            >
              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="flex justify-center">
                      <Image
                        src="/images/testimonial/client-img.png"
                        alt={testimonial.name}
                        width={230}
                        height={290}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-bold mb-4">
                        {testimonial.name}
                      </h3>
                      <p className="text-lg mb-4 flex items-center justify-center md:justify-start">
                        <FaQuoteLeft className="mr-2 text-blue-900" />
                        {testimonial.text}
                        <FaQuoteRight className="ml-2 text-blue-900" />
                      </p>
                      <div className="flex items-center justify-center md:justify-start space-x-4">
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
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

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

        {/* Navigation Arrows */}
        <Button
          onClick={goToPrevious}
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
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
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
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
      </div>
    </div>
  );
};

export default Testimonial;
