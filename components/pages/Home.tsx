"use client";

import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import LatestBlogs from "@/components/LatestBlogs";
import Testimonial from "@/components/Testimonial";
import { motion } from "framer-motion";
import WhyEnrollFeatures from "@/components/WhyEnrollFeatures";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  return (
    <main>
      <Hero />
      <section className="bg-gray-50">
        {/* Why Enroll Section */}
        <section className="container mx-auto px-4 py-12">
          <h1 className="text-center mb-8">
            <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-xl md:text-2xl font-bold">
              Why Enroll in Our Programming Classes?
            </span>
          </h1>
          <WhyEnrollFeatures />
        </section>

        {/* Marketing Section 1 */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "tween", duration: 0.5 }}
              className="relative w-full h-96 rounded-lg overflow-hidden"
            >
              <Image
                src="/images/marketing/marketing-1.jpg"
                alt="High-Demand Technologies"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "tween", duration: 0.5 }}
            >
              <Card className="bg-gray-100">
                <CardContent className="p-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    <span className="block text-blue-900 mb-2">
                      High-Demand Technologies
                    </span>
                    <span className="block text-blue-700">
                      Expand Your Skills with Our Expert-Led Classes
                    </span>
                  </h2>
                  <p className="mb-6 text-gray-700">
                    Enhance your programming skills with our specialized classes
                    in high-demand technologies. Our classes cover the entire web
                    development spectrum, from design to deployment.
                  </p>
                  <Button asChild size="lg" className="bg-blue-900 hover:bg-blue-800">
                    <Link href="/courses">View courses</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Marketing Section 2 */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "tween", duration: 0.5 }}
              className="order-2 md:order-1"
            >
              <Card className="bg-gray-100">
                <CardContent className="p-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    <span className="block text-blue-900 mb-2">
                      Cutting-Edge Solutions
                    </span>
                    <span className="block text-blue-700">
                      Transform Your Business with Our Custom Web Solutions
                    </span>
                  </h2>
                  <p className="mb-6 text-gray-700">
                    Elevate your business with our tailored web & app development
                    services. From concept to launch, we build cutting-edge
                    digital solutions that drive success.
                  </p>
                  <Button asChild size="lg" className="bg-blue-900 hover:bg-blue-800">
                    <Link href="/contact">Contact us</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "tween", duration: 0.5 }}
              className="relative w-full h-96 rounded-lg overflow-hidden order-1 md:order-2"
            >
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
    </main>
  );
};

export default Home;
