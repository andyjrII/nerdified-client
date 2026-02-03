"use client";

import { useState, useEffect } from "react";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { useTutorAuth } from "@/hooks/useTutorAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FaBookOpen,
  FaUsers,
  FaDollarSign,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import db from "@/utils/localBase";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TutorDashboard = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const { auth } = useTutorAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [tutor, setTutor] = useState<any>(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    upcomingSessions: 0,
    pendingApproval: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await db.collection("auth_tutor").get();
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
      fetchTutorData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  const fetchTutorData = async () => {
    try {
      setLoading(true);

      // Fetch tutor profile (includes courses)
      const tutorResponse = await axiosPrivate.get(`tutors/me`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setTutor(tutorResponse?.data);

      // Check approval status
      const isPending = !tutorResponse?.data?.approved;

      // Get courses from tutor profile (tutor service includes courses)
      const courses = Array.isArray(tutorResponse?.data?.courses)
        ? tutorResponse.data.courses
        : [];

      // Calculate total students (from enrollments) - TODO: Create backend endpoint for this
      let totalStudents = 0;
      let totalEarnings = 0;
      
      // For now, we'll calculate this from the courses data if available
      // In the future, create a /tutors/stats endpoint
      if (courses.length > 0) {
        // Note: This is a placeholder - we'll need backend endpoints for:
        // - GET /tutors/stats (courses, students, earnings)
        // - GET /tutors/courses (all courses for tutor)
        // For now, just show course count
        totalStudents = 0; // Will be calculated when backend endpoints are ready
        totalEarnings = 0; // Will be calculated when backend endpoints are ready
      }

      // Fetch upcoming sessions
      const sessionsResponse = await axiosPrivate.get(`sessions/tutor`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const sessions = Array.isArray(sessionsResponse?.data) ? sessionsResponse.data : [];
      const now = new Date();
      const upcomingSessions = sessions.filter(
        (session: any) => new Date(session.startTime) > now && session.status !== "CANCELLED"
      ).length;

      setStats({
        totalCourses: courses.length,
        totalStudents,
        totalEarnings,
        upcomingSessions,
        pendingApproval: isPending,
      });
    } catch (error) {
      console.error("Error fetching tutor data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-full space-y-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {tutor?.name || "Tutor"}! Here&apos;s your teaching overview.
              </p>
            </div>
            {stats.pendingApproval && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                <FaExclamationTriangle className="w-3 h-3 mr-1" />
                Pending Approval
              </Badge>
            )}
            {!stats.pendingApproval && tutor?.approved && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                <FaCheckCircle className="w-3 h-3 mr-1" />
                Approved
              </Badge>
            )}
          </div>
        </div>

        {/* Approval Warning */}
        {stats.pendingApproval && (
          <Card className="shadow-lg border-yellow-300 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <FaExclamationTriangle className="w-6 h-6 text-yellow-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Account Pending Approval
                  </h3>
                  <p className="text-yellow-800 text-sm">
                    Your tutor account is pending admin approval. Once approved, you&apos;ll be able to
                    create courses, schedule sessions, and start teaching. You&apos;ll be notified via
                    email once your account is approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FaBookOpen className="w-5 h-5" />
                My Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCourses}</div>
              <Link href="/tutor/courses">
                <Button variant="ghost" className="mt-2 text-white hover:bg-purple-700">
                  View Courses →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FaUsers className="w-5 h-5" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalStudents}</div>
              <Link href="/tutor/students">
                <Button variant="ghost" className="mt-2 text-white hover:bg-blue-700">
                  View Students →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FaDollarSign className="w-5 h-5" />
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
              <Link href="/tutor/earnings">
                <Button variant="ghost" className="mt-2 text-white hover:bg-green-700">
                  View Earnings →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.upcomingSessions}</div>
              <Link href="/tutor/sessions">
                <Button variant="ghost" className="mt-2 text-white hover:bg-orange-700">
                  View Sessions →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/tutor/courses/new">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <FaBookOpen className="w-4 h-4 mr-2" />
                  Create New Course
                </Button>
              </Link>
              <Link href="/tutor/sessions/new">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
              </Link>
              <Link href="/tutor/availability">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <FaChalkboardTeacher className="w-4 h-4 mr-2" />
                  Set Availability
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        {stats.totalCourses === 0 && !stats.pendingApproval && (
          <Card className="shadow-lg border-blue-300 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <FaChalkboardTeacher className="w-6 h-6 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Get Started as a Tutor
                  </h3>
                  <p className="text-blue-800 text-sm mb-4">
                    Create your first course to start teaching! You can create courses, schedule
                    live sessions, and interact with students.
                  </p>
                  <Link href="/tutor/courses/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Create Your First Course
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;
