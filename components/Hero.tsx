"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const slides = [
    {
      image: "/images/hero/carousel-bg-2.jpg",
      title: "Nerdified Africa",
      subtitle: "Live, instructor-led learning—real skills through real-time teaching and mentorship. No prerecorded lectures; just you, expert tutors, and focused growth.",
      buttonText: "Explore live courses",
      buttonLink: "/courses",
      alignment: "left",
    },
    {
      image: "/images/hero/carousel-bg-3.jpg",
      title: "Nerdified Africa",
      subtitle: "Learn live. Learn better. Join a marketplace where tutors and learners connect in real time—one-on-one or small groups—for accountability and mastery.",
      buttonText: "Start learning",
      buttonLink: "/signup/student",
      alignment: "right",
    },
    {
      image: "/images/hero/carousel-bg-1.jpg",
      title: "Nerdified Africa",
      subtitle: "Interaction over consumption. Whether you're upskilling, switching careers, or building a teaching business—Nerdified is where human connection powers learning.",
      buttonText: "Teach on Nerdified",
      buttonLink: "/signup/tutor",
      alignment: "center",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- slides.length stable for carousel
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[450px] md:h-[500px] overflow-hidden">
      {/* Carousel Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              unoptimized
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
      </div>

      {/* Text Overlays - Positioned inside arrow boundaries */}
      <div className="absolute inset-0 z-10 container mx-auto px-12 md:px-16 lg:px-20 h-full flex items-center pointer-events-none">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 container mx-auto px-12 md:px-16 lg:px-20 h-full flex items-center transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className={`text-white pointer-events-auto ${
                slide.alignment === "center"
                  ? "text-center mx-auto"
                  : slide.alignment === "right"
                  ? "text-right ml-auto"
                  : "text-left"
              } max-w-2xl`}
            >
              {/* Title with "Africa" gradient colors */}
              <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
                <span className="inline-block bg-blue-900/90 backdrop-blur-sm px-5 py-2 rounded-lg shadow-lg">
                  <span className="text-white">Nerdified</span>{" "}
                  <span className="inline-block">
                    <span className="text-green-400">Af</span>
                    <span className="text-yellow-400">ri</span>
                    <span className="text-red-400">ca</span>
                  </span>
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-base md:text-xl mb-6 bg-blue-900/90 backdrop-blur-sm px-5 py-3 rounded-lg shadow-lg leading-relaxed">
                {slide.subtitle}
              </p>
              
              {/* Call to Action Button */}
              <div className={`${slide.alignment === "center" ? "flex justify-center" : slide.alignment === "right" ? "flex justify-end" : "flex justify-start"}`}>
                <Button
                  asChild
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 text-base font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
                >
                  <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 pointer-events-auto">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all cursor-pointer ${
              index === currentSlide ? "w-10 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows - Higher z-index and pointer-events */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all backdrop-blur-sm cursor-pointer pointer-events-auto"
        aria-label="Previous slide"
        type="button"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all backdrop-blur-sm cursor-pointer pointer-events-auto"
        aria-label="Next slide"
        type="button"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Hero;
