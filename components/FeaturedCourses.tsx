"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import StarRating from "@/components/StarRating";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Moment from "react-moment";

interface FeaturedCourse {
  id: number;
  title: string;
  description: string | null;
  price: string;
  updatedAt: string;
  averageRating: number;
  reviewCount: number;
}

const FeaturedCourses = () => {
  const [courses, setCourses] = useState<FeaturedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchFeatured = async (retry = false) => {
      try {
        const { data } = await axios.get<FeaturedCourse[]>("/courses/featured");
        if (!cancelled) setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!retry) {
          // Retry once after a short delay (helps when server is cold or first request fails)
          setTimeout(() => fetchFeatured(true), 800);
          return;
        }
        console.error("Error fetching featured courses:", error);
        if (!cancelled) setCourses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchFeatured();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-center mb-8">
          <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-xl md:text-2xl font-bold">
            Featured courses
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-full shadow-lg animate-pulse">
              <CardHeader className="bg-blue-900/80 h-24 rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-center mb-8">
        <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-xl md:text-2xl font-bold">
          Featured courses
        </span>
      </h2>
      {courses.length === 0 ? (
        <div className="text-center max-w-xl mx-auto mb-8">
          <p className="text-white text-lg md:text-xl">
            Top-rated courses will appear here once students leave reviews.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="h-full shadow-lg hover:shadow-xl transition-shadow flex flex-col"
              >
                <CardHeader className="bg-blue-900 text-white py-3">
                  <h3 className="text-lg font-semibold my-0 text-center line-clamp-2">
                    {course.title}
                  </h3>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <ul className="list-none space-y-2 mb-4 text-center">
                    <li className="text-sm text-gray-600">
                      Updated:{" "}
                      <Moment format="MMMM D, YYYY">{course.updatedAt}</Moment>
                    </li>
                    <li className="flex justify-center items-center gap-2">
                      <StarRating rating={course.averageRating} />
                      {course.reviewCount > 0 && (
                        <span className="text-sm text-gray-500">
                          ({course.reviewCount} review{course.reviewCount !== 1 ? "s" : ""})
                        </span>
                      )}
                    </li>
                    <li className="text-xl font-bold text-blue-900">{course.price}</li>
                  </ul>
                  <Button asChild className="w-full mt-auto bg-blue-900 hover:bg-blue-800">
                    <Link href={`/courses/${course.id}`}>View course</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedCourses;
