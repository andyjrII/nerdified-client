"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import Moment from "react-moment";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  title: string;
  price: string | number;
  updatedAt: string;
}

const MostEnrolled = () => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const getTopCourses = async () => {
      try {
        const response = await axiosPrivate.get("courses/top-enrolled/4", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        // Ensure response.data is an array
        const coursesData = Array.isArray(response?.data) ? response.data : [];
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching Top Enrolled Courses:", error);
        setCourses([]); // Set empty array on error
      }
    };

    getTopCourses();
  }, [axiosPrivate]);

  const getCourse = async (id: number) => {
    try {
      const response = await axiosPrivate.get(`courses/course/${id}`, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("NERDVILLE_COURSE", JSON.stringify(response?.data));
      }
      router.push(`/courses/${id}`);
    } catch (error) {
      console.error("Error fetching Course");
    }
  };

  return (
    <>
      <h3 className="font-bold px-3 mb-4">
        <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full">
          Top Courses
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-3 py-2">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Card key={course.id} className="bg-red-600 text-white border-0">
              <CardHeader className="text-white bg-red-700">
                Last Updated on{" "}
                <Moment format="MMMM D, YYYY">{course.updatedAt}</Moment>
              </CardHeader>
              <CardContent>
                <h5 className="text-lg font-semibold text-wrap text-white mb-2">
                  {course.title}
                </h5>
                <p className="text-white mb-4">Price: {course.price}</p>
                <Button
                  onClick={() => getCourse(course.id)}
                  className="w-full bg-red-700 hover:bg-red-800 text-white"
                >
                  View
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            No courses available yet.
          </div>
        )}
      </div>
    </>
  );
};

export default MostEnrolled;
