"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import LatestBlogs from "@/components/LatestBlogs";
import Testimonial from "@/components/Testimonial";
import { motion } from "framer-motion";
import WhyEnrollFeatures from "@/components/WhyEnrollFeatures";
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
                alt="High-Demand Technologies"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
              
            {/* Overlapping card - positioned so half is inside image, half is outside */}
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
                        HIGH-DEMAND TECHNOLOGIES
                      </p>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-gray-800 uppercase leading-tight">
                        EXPAND YOUR SKILLS WITH OUR EXPERT-LED CLASSES
                      </h2>
                      <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                        Enhance your programming skills with our specialized classes
                        in high-demand technologies. Our classes cover the entire web
                        development spectrum, from design to deployment.
                      </p>
                    </div>
                  </CardContent>
                  
                  {/* Button positioned at bottom, extending beyond card */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                    <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-base font-bold shadow-lg">
                      <Link href="/courses">View courses</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
          </div>
        </section>

        {/* Marketing Section 2 */}
        <section className="container mx-auto px-4 py-12">
          <div className="relative w-full flex items-start justify-center">
            {/* Overlapping card - positioned so half is inside image, half is outside */}
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
                        CUTTING-EDGE SOLUTIONS
                      </p>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-gray-800 uppercase leading-tight">
                        TRANSFORM YOUR BUSINESS WITH OUR CUSTOM WEB SOLUTIONS
                      </h2>
                      <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                        Elevate your business with our tailored web & app development
                        services. From concept to launch, we build cutting-edge
                        digital solutions that drive success.
                      </p>
                    </div>
                  </CardContent>
                  
                  {/* Button positioned at bottom, extending beyond card */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                    <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-base font-bold shadow-lg">
                      <Link href="/contact">Contact us</Link>
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
                alt="Cutting-Edge Solutions"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
          </div>
        </section>

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
