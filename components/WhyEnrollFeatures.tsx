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
      title: "Live Online Classes",
      description:
        "Learn in real time with expert tutors—no prerecorded lectures. One-on-one or small-group live sessions over video so you get direct teaching, instant feedback, and real conversation. Distance is never a barrier to quality education.",
      bgImage: "/images/features/feature-1.jpeg",
    },
    {
      id: "why-enroll-2",
      icon: faSuitcase,
      title: "Mentorship & Accountability",
      description:
        "Stay on track with dedicated tutors who guide you and keep you accountable. Get structured feedback, clear goals, and support that turns learning into lasting skills. Human connection makes the difference between browsing content and actually mastering it.",
      bgImage: "/images/features/feature-2.jpeg",
    },
    {
      id: "why-enroll-3",
      icon: faClock,
      title: "Flexible Learning Schedule",
      description:
        "Book sessions when they work for you. Tutors set their availability and you choose the times that fit your life. Learn at your own pace, in your own time zone, with as many or as few sessions per week as you need.",
      bgImage: "/images/features/feature-3.jpeg",
    },
    {
      id: "why-enroll-4",
      icon: faLaptop,
      title: "Real-World Application",
      description:
        "Apply what you learn in live sessions with hands-on practice and real-world scenarios. Tutors focus on skills you can use—not just theory. Build confidence and competence through guided practice and direct feedback.",
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
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/65 to-black/75 group-hover:from-black/75 group-hover:via-black/70 group-hover:to-black/80 transition-all" />
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
