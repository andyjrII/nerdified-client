"use client";

import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import db from "@/utils/localBase";
import { FaBookOpen, FaCheckCircle, FaClock } from "react-icons/fa";

const CourseProgress = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState<string>("");
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await db.collection("auth_student").get();
        if (data.length > 0) {
          setEmail(data[0].email);
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (email) {
      fetchEnrollments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  const fetchEnrollments = async () => {
    try {
      const response = await axiosPrivate.get(`students/enrolled/${email}`);
      const data = Array.isArray(response?.data) ? response.data : [];
      setEnrollments(data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setEnrollments([]);
    }
  };

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(
    (e) => e.status === "COMPLETED" || e.completedAt
  ).length;
  const inProgressCourses = totalCourses - completedCourses;
  const completionRate = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaBookOpen className="w-5 h-5 text-blue-600" />
          Course Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Overall Completion
            </span>
            <span className="text-sm font-bold text-blue-600">
              {completionRate.toFixed(0)}%
            </span>
          </div>
          <Progress value={completionRate} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalCourses}</div>
            <div className="text-xs text-gray-600 mt-1">Total Courses</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
              <FaCheckCircle /> {completedCourses}
            </div>
            <div className="text-xs text-gray-600 mt-1">Completed</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
              <FaClock /> {inProgressCourses}
            </div>
            <div className="text-xs text-gray-600 mt-1">In Progress</div>
          </div>
        </div>

        {/* Recent Enrollments */}
        {enrollments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Recent Enrollments
            </h4>
            {enrollments.slice(0, 3).map((enrollment) => {
              const progress =
                enrollment.status === "COMPLETED" || enrollment.completedAt ? 100 : 50;
              return (
                <div key={enrollment.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {enrollment.course?.title || "Course"}
                    </span>
                    <span className="text-xs text-gray-500">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseProgress;
