"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import Moment from "react-moment";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import db from "@/utils/localBase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EnrollmentDetail {
  id: number;
  courseId: number;
  dateEnrolled: string;
  classDays: string[];
  preferredTime: string;
  mode: string;
  status: string;
  course: {
    title: string;
  };
}

const EnrolledCourses = () => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [enrollmentDetails, setEnrollmentDetails] = useState<EnrollmentDetail[]>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail();
        if (email) {
          await getEnrolledCourses();
        }
      } catch (error) {
        console.log("Error during initialization:", error);
      }
    };

    initialize();
  }, [email]);

  const fetchEmail = async () => {
    try {
      const data = await db.collection("auth_student").get();
      if (data.length > 0) {
        setEmail(data[0].email);
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  const getEnrolledCourses = async () => {
    try {
      const response = await axiosPrivate.get(`students/enrolled/${email}`);
      setEnrollmentDetails(response?.data);
    } catch (error) {
      console.error("Error fetching Courses");
    }
  };

  const separatedDays = (days: string[] | string): string => {
    if (Array.isArray(days)) {
      days = days.join("");
    }
    const daysOfWeek = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];
    const regex = new RegExp(daysOfWeek.join("|"), "g");
    const matchedDays = String(days).match(regex);
    if (matchedDays) {
      return matchedDays
        .map((day) => day.charAt(0) + day.slice(1).toLowerCase())
        .join(", ");
    }
    return "";
  };

  const getCourse = async (id: number) => {
    try {
      const response = await axiosPrivate.get(`courses/course/${id}`);
      if (typeof window !== "undefined") {
        localStorage.setItem("NERDVILLE_COURSE", JSON.stringify(response?.data));
      }
      router.push(`/courses/${id}`);
    } catch (error) {
      console.error("Error fetching Course");
    }
  };

  if (!enrollmentDetails || enrollmentDetails.length === 0) {
    return null;
  }

  return (
    <>
      <h3 className="font-bold px-3 mb-4">
        <span className="inline-block bg-blue-900 text-white px-4 py-2 rounded-full">
          My Courses
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-3 py-2">
        {enrollmentDetails.map((enrollmentDetail) => (
          <Card key={enrollmentDetail.id} className="bg-blue-900 text-white border-0">
            <CardHeader className="text-white bg-blue-800">
              Enrolled on{" "}
              <Moment format="MMMM D, YYYY">
                {enrollmentDetail.dateEnrolled}
              </Moment>
            </CardHeader>
            <CardContent>
              <h5 className="text-lg font-semibold text-wrap text-white mb-3">
                {enrollmentDetail.course.title}
              </h5>
              <div className="space-y-2 text-sm mb-4">
                <p className="text-white">
                  Class Days:{" "}
                  <span className="text-yellow-400">
                    {separatedDays(enrollmentDetail.classDays)}
                  </span>
                </p>
                <p className="text-white">
                  Time:{" "}
                  <span className="text-yellow-400">
                    {enrollmentDetail.preferredTime.charAt(0) +
                      enrollmentDetail.preferredTime.slice(1).toLowerCase()}
                  </span>
                </p>
                <p className="text-white">
                  Mode:{" "}
                  <span className="text-yellow-400">
                    {enrollmentDetail.mode.charAt(0) +
                      enrollmentDetail.mode.slice(1).toLowerCase()}
                  </span>
                </p>
                <p className="text-white">
                  Status:{" "}
                  <span className="text-yellow-400">
                    {enrollmentDetail.status.charAt(0) +
                      enrollmentDetail.status.slice(1).toLowerCase()}
                  </span>
                </p>
              </div>
              <Button
                onClick={() => getCourse(enrollmentDetail.courseId)}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
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

export default EnrolledCourses;
