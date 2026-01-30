"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faSuitcase,
  faClock,
  faLaptop,
} from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent } from "@/components/ui/card";

const WhyEnrollFeatures = () => {
  const features = [
    {
      id: "why-enroll-1",
      icon: faGlobe,
      title: "On-site & Online Classes",
      description:
        "Whether you prefer in-person learning or flexibility of online classes, we have you covered. Our on-site classes offer a collaborative environment, while our online classes ensure that distance is never a barrier to gaining quality education.",
      bgImage: "/images/features/feature-1.jpeg",
    },
    {
      id: "why-enroll-2",
      icon: faSuitcase,
      title: "Internship Opportunities",
      description:
        "After completing your coursework, we provide an internship program that allows you to apply what you've learned in real-world scenarios. This hands-on experience is invaluable for building your resume & gaining practical skills that employers seek.",
      bgImage: "/images/features/feature-2.jpeg",
    },
    {
      id: "why-enroll-3",
      icon: faClock,
      title: "Flexible Learning Schedule",
      description:
        "We understand that everyone has different schedules & commitments. That's why we offer flexible learning options that allow you to choose your preferred class times and the number of sessions per week. Learn at your own pace & on your own terms.",
      bgImage: "/images/features/feature-3.jpeg",
    },
    {
      id: "why-enroll-4",
      icon: faLaptop,
      title: "Real-World Projects",
      description:
        "Our curriculum is designed around real-world projects to ensure that you not only learn theoretical concepts but also apply them in practical situations. By working on actual projects, you'll gain the confidence & skills needed to tackle real-world challenges.",
      bgImage: "/images/features/feature-4.jpeg",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
      {features.map((feature) => (
        <Card
          key={feature.id}
          className="relative overflow-hidden rounded-lg shadow-lg group aspect-[4/5] border border-white/20"
        >
          <Image
            src={feature.bgImage}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/35 to-black/40 group-hover:from-black/50 group-hover:via-black/45 group-hover:to-black/50 transition-all" />
          <CardContent className="relative z-10 h-full flex flex-col p-5 md:p-6 text-white">
            <p className="leading-relaxed text-base md:text-lg flex-1 mb-4 text-left">
              {feature.description}
            </p>
            
            {/* Separator line */}
            <div className="border-t border-white/30 mb-4" />
            
            {/* Icon and label - centered */}
            <div className="flex items-center justify-center">
              <FontAwesomeIcon
                icon={feature.icon}
                className="mr-2 h-4 w-4 text-white"
              />
              <small className="text-sm font-semibold text-white">{feature.title}</small>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WhyEnrollFeatures;
