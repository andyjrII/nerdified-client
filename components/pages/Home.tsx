"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import LatestBlogs from "@/components/LatestBlogs";
import Testimonial from "@/components/Testimonial";
import { motion } from "framer-motion";
import WhyEnrollFeatures from "@/components/WhyEnrollFeatures";
import FeaturedCourses from "@/components/FeaturedCourses";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  useEffect(() => {
    // Add class to body to apply background
    const body = document.body;
    const html = document.documentElement;
    
    body.classList.add('home-page');
    html.classList.add('home-page');
    
    // Also directly set inline style as fallback
    body.style.setProperty('background-image', "url('/images/bg/home-bg.jpg')", 'important');
    body.style.setProperty('background-attachment', 'fixed', 'important');
    body.style.setProperty('background-size', 'cover', 'important');
    body.style.setProperty('background-position', 'center', 'important');
    body.style.setProperty('background-repeat', 'no-repeat', 'important');
    body.style.setProperty('background-color', 'transparent', 'important');
    
    return () => {
      body.classList.remove('home-page');
      html.classList.remove('home-page');
      body.style.removeProperty('background-image');
      body.style.removeProperty('background-attachment');
      body.style.removeProperty('background-size');
      body.style.removeProperty('background-position');
      body.style.removeProperty('background-repeat');
      body.style.removeProperty('background-color');
    };
  }, []);

  return (
    <div className="relative min-h-screen z-10" style={{ backgroundColor: 'transparent' }}>
      {/* Content Container */}
      <div className="relative min-h-screen">
        <Hero />
        <section className="bg-transparent min-h-screen">
        {/* Why Enroll Section */}
        <section className="container mx-auto px-12 md:px-20 lg:px-32 xl:px-40 py-12">
          <h1 className="text-center mb-8">
            <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg text-xl md:text-2xl font-bold">
              Why Enroll in Our Programming Classes?
            </span>
          </h1>
          <WhyEnrollFeatures />
        </section>

        {/* Marketing Section 1 */}
        <section className="container mx-auto px-4 py-12">
          <div className="relative w-full flex items-start justify-center">
            {/* Large background image - reduced to half size */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "tween", duration: 0.5 }}
              className="relative w-3/5 h-[400px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden"
            >
              {/* Dark overlay on image */}
              <div className="absolute inset-0 bg-black/40 z-10" />
              <Image
                src="/images/marketing/marketing-1.jpg"
                alt="Learn live with expert tutors"
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
            </motion.div>
              
            {/* Overlapping card - Student enrollment CTA */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "tween", duration: 0.5, delay: 0.2 }}
              className="relative -ml-[12.5%] md:-ml-[12.5%] w-[85%] md:w-[50%] max-w-2xl z-20 mt-16 md:mt-20"
            >
                <Card className="bg-white shadow-xl">
                  <CardContent className="p-6 md:p-8">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-blue-900 uppercase mb-3 tracking-wide">
                        LEARN LIVE. LEARN BETTER.
                      </p>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-gray-800 uppercase leading-tight">
                        REAL SKILLS FROM REAL TUTORS—NOT RECORDINGS
                      </h2>
                      <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                        Join live video sessions with expert tutors—one-on-one or in small groups—so you get real-time answers, tailored feedback, and structured support. Book sessions that fit your schedule, track your progress, and build skills through practice and mentorship instead of passive videos. Whether you&apos;re upskilling, switching careers, or starting from scratch, your next level starts here.
                      </p>
                    </div>
                  </CardContent>
                  
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                    <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-base font-bold shadow-lg">
                      <Link href="/signup/student">Start learning</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
          </div>
        </section>

        {/* Marketing Section 2 - Tutor CTA */}
        <section className="container mx-auto px-4 py-12">
          <div className="relative w-full flex items-start justify-center">
            {/* Overlapping card - Tutor registration CTA */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "tween", duration: 0.5, delay: 0.2 }}
              className="relative -mr-[12.5%] md:-mr-[12.5%] w-[85%] md:w-[50%] max-w-2xl z-20 order-1 mt-16 md:mt-20"
            >
                <Card className="bg-white shadow-xl">
                  <CardContent className="p-6 md:p-8">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-blue-900 uppercase mb-3 tracking-wide">
                        SHARE YOUR EXPERTISE. EARN AS YOU TEACH.
                      </p>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-gray-800 uppercase leading-tight">
                        TEACH LIVE ON NERDIFIED—BUILD YOUR TEACHING BUSINESS
                      </h2>
                      <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                        Create and publish your own courses, set your availability, and teach live over video to students who are ready to learn. Nerdified handles course discovery, secure payments, session booking, and payouts—so you can focus on teaching and growing your audience. Build a sustainable teaching business on your terms, with full control over what you teach and when.
                      </p>
                    </div>
                  </CardContent>
                  
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                    <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-base font-bold shadow-lg">
                      <Link href="/signup/tutor">Become a tutor</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
              
            {/* Large background image - reduced to half size */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "tween", duration: 0.5 }}
              className="relative w-3/5 h-[400px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden order-2"
            >
              {/* Dark overlay on image */}
              <div className="absolute inset-0 bg-black/40 z-10" />
              <Image
                src="/images/marketing/marketing-2.jpg"
                alt="Teach live on Nerdified"
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
            </motion.div>
          </div>
        </section>

        {/* Featured courses (top-rated) */}
        <FeaturedCourses />

        {/* Latest Posts Section */}
        <section className="container mx-auto px-4 py-12">
          <h1 className="text-center mb-8">
            <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-xl md:text-2xl font-bold">
              Latest Posts
            </span>
          </h1>
          <LatestBlogs />
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-12">
          <h1 className="text-center mb-8">
            <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-xl md:text-2xl font-bold">
              Testimonials
            </span>
          </h1>
          <Testimonial />
        </section>
      </section>
      </div>
    </div>
  );
};

export default Home;
