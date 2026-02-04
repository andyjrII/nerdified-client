"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const timelineItems = [
    {
      image: "/images/navpages/about-vision.jpeg",
      title: "Our Vision",
      description:
        "Empowering Africa's tech potential for a sustainable and prosperous future.",
      inverted: false,
    },
    {
      image: "/images/navpages/about-mission.jpeg",
      title: "Our Mission",
      description:
        "Building a nerd culture in Africa by unlocking Africa's potential through technology and education, to drive digital transformation, economic growth & sustainable development.",
      inverted: true,
    },
    {
      image: "/images/navpages/about-service.jpeg",
      title: "Our Services",
      description: null,
      services: [
        "Offline & online Coding classes",
        "Mentorship for beginners",
        "Internship programs for our students",
        "Web applications for business & individuals",
        "Mobile app development for business & individuals",
      ],
      inverted: false,
    },
  ];

  return (
    <main>
      <header className="py-6 border-b bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-2xl font-bold">
              About Us
            </h1>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200 hidden md:block" />

          <div className="space-y-12">
            {timelineItems.map((item, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  item.inverted ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="rounded-full object-cover border-4 border-blue-900"
                  />
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 md:bottom-auto md:left-auto md:transform-none md:-right-8 md:top-1/2 md:-translate-y-1/2 w-6 h-6 bg-blue-900 rounded-full border-4 border-white z-10" />
                </div>

                {/* Content */}
                <Card className={`flex-1 ${item.inverted ? "md:mr-auto md:max-w-md" : "md:ml-auto md:max-w-md"}`}>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-4 text-blue-900">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="text-gray-700">{item.description}</p>
                    ) : (
                      <ul className="space-y-2">
                        {item.services?.map((service, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 text-blue-900">•</span>
                            <span className="text-gray-700">{service}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Final item */}
            <div className="relative flex justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                <Image
                  src="/images/features/feature-1.jpeg"
                  alt="Logo"
                  fill
                  className="rounded-full object-cover border-4 border-blue-900"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
