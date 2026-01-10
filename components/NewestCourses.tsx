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

const NewestCourses = () => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [latestCourses, setLatestCourses] = useState<Course[]>([]);

  useEffect(() => {
    const getLatestCourses = async () => {
      try {
        const response = await axiosPrivate.get("courses/latest/4", {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setLatestCourses(response?.data);
      } catch (error) {
        console.error("Error fetching Latest Courses");
      }
    };

    getLatestCourses();
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
        <span className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-full">
          Latest Courses
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-3 py-2">
        {latestCourses.map((course) => (
          <Card key={course.id} className="bg-yellow-500 text-white border-0">
            <CardHeader className="text-white bg-yellow-600">
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
                className="w-full bg-yellow-700 hover:bg-yellow-800 text-white"
              >
                View
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default NewestCourses;
