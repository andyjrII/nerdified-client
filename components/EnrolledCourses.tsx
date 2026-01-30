"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import Moment from "react-moment";
import { FaCalendarAlt, FaVideo, FaBookOpen, FaSearch } from "react-icons/fa";
import db from "@/utils/localBase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EnrollmentDetail {
  id: number;
  courseId: number;
  dateEnrolled: string;
  status: string;
  course: {
    id: number;
    title: string;
    tutor: {
      name: string;
    };
  };
}

const EnrolledCourses = () => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [enrollmentDetails, setEnrollmentDetails] = useState<EnrollmentDetail[]>([]);
  const [sessionsCount, setSessionsCount] = useState<Record<number, number>>({});

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

  useEffect(() => {
    // Fetch session counts for each enrolled course
    const fetchSessionsCounts = async () => {
      const counts: Record<number, number> = {};
      for (const enrollment of enrollmentDetails) {
        try {
          const response = await axiosPrivate.get(
            `sessions/course/${enrollment.courseId}`
          );
          const sessions = Array.isArray(response?.data) ? response.data : [];
          // Filter only upcoming sessions (startTime > now)
          const now = new Date();
          const upcoming = sessions.filter(
            (session: any) => new Date(session.startTime) > now
          );
          counts[enrollment.courseId] = upcoming.length;
        } catch (error) {
          console.error(`Error fetching sessions for course ${enrollment.courseId}:`, error);
          counts[enrollment.courseId] = 0;
        }
      }
      setSessionsCount(counts);
    };

    if (enrollmentDetails.length > 0) {
      fetchSessionsCounts();
    }
  }, [enrollmentDetails, axiosPrivate]);

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
      // Ensure response.data is an array
      const enrollmentsData = Array.isArray(response?.data) ? response.data : [];
      setEnrollmentDetails(enrollmentsData);
    } catch (error) {
      console.error("Error fetching Courses:", error);
      setEnrollmentDetails([]); // Set empty array on error
    }
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

  const viewSessions = async (courseId: number) => {
    router.push(`/student/sessions?courseId=${courseId}`);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      ACTIVE: "bg-green-100 text-green-800",
      COMPLETED: "bg-blue-100 text-blue-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return (
      <Badge
        variant="outline"
        className={statusColors[status] || "bg-gray-100 text-gray-800"}
      >
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  if (!enrollmentDetails || enrollmentDetails.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <FaBookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No enrolled courses yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          You haven&apos;t enrolled in any courses. Browse our catalog to find live, instructor-led courses and get started.
        </p>
        <Link href="/courses">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FaSearch className="w-4 h-4 mr-2" />
            Browse courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <h3 className="font-bold px-3 mb-4">
        <span className="inline-block bg-blue-900 text-white px-4 py-2 rounded-full">
          My Courses
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-3 py-2">
        {enrollmentDetails.map((enrollmentDetail) => {
          const upcomingSessions = sessionsCount[enrollmentDetail.courseId] || 0;
          return (
            <Card
              key={enrollmentDetail.id}
              className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="text-white bg-blue-950/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-xs text-blue-200 mb-1">Enrolled on</p>
                    <Moment format="MMM D, YYYY" className="text-sm font-medium">
                      {enrollmentDetail.dateEnrolled}
                    </Moment>
                  </div>
                  {getStatusBadge(enrollmentDetail.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <h5 className="text-lg font-semibold text-wrap text-white mb-3 min-h-[3rem]">
                  {enrollmentDetail.course.title}
                </h5>

                {/* Course Info */}
                <div className="space-y-2 text-sm mb-4">
                  {enrollmentDetail.course.tutor?.name && (
                    <p className="text-blue-100">
                      Tutor:{" "}
                      <span className="font-medium text-white">
                        {enrollmentDetail.course.tutor.name}
                      </span>
                    </p>
                  )}

                  {/* Upcoming Sessions */}
                  <div className="flex items-center gap-2 text-blue-100">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>
                      {upcomingSessions > 0 ? (
                        <>
                          <span className="font-medium text-white">
                            {upcomingSessions}
                          </span>{" "}
                          {upcomingSessions === 1
                            ? "upcoming session"
                            : "upcoming sessions"}
                        </>
                      ) : (
                        "No upcoming sessions"
                      )}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-4">
                  {upcomingSessions > 0 && (
                    <Button
                      onClick={() => viewSessions(enrollmentDetail.courseId)}
                      className="w-full bg-blue-700 hover:bg-blue-600 text-white"
                    >
                      <FaVideo className="w-4 h-4 mr-2" />
                      View Sessions
                    </Button>
                  )}
                  <Button
                    onClick={() => getCourse(enrollmentDetail.courseId)}
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                  >
                    <FaBookOpen className="w-4 h-4 mr-2" />
                    View Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default EnrolledCourses;
