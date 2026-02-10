"use client";

import { useEffect, useState } from "react";
import CourseTotals from "@/components/CourseTotals";
import EnrollmentChart from "@/components/dashboard/EnrollmentChart";
import SpendingChart from "@/components/dashboard/SpendingChart";
import CourseProgress from "@/components/dashboard/CourseProgress";
import UpcomingSessionsWidget from "@/components/dashboard/UpcomingSessionsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaChartBar, FaDollarSign, FaBookOpen, FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { getStudentProfile } from "@/utils/authStorage";

const Student = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const email = auth.email ?? "";
  const [studentName, setStudentName] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    const cached = getStudentProfile() as { name?: string } | null;
    if (cached?.name) {
      setStudentName(cached.name);
      return;
    }
    axiosPrivate.get(`students/${email}`).then((res) => {
      const name = res?.data?.name;
      if (name) setStudentName(name);
    }).catch(() => {});
  }, [email, axiosPrivate]);

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="w-full space-y-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            {studentName ? `Welcome back, ${studentName}! Here's your learning overview and statistics.` : "Welcome back! Here's your learning overview and statistics."}
          </p>
        </div>

        {/* Statistics Cards */}
        <CourseTotals />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Chart */}
          <Card className="shadow-lg bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FaChartBar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Enrollment Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <EnrollmentChart />
              </div>
            </CardContent>
          </Card>

          {/* Spending Chart */}
          <Card className="shadow-lg bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FaDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                Spending Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <SpendingChart />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Progress */}
          <CourseProgress />

          {/* Upcoming Sessions */}
          <UpcomingSessionsWidget />

          {/* Quick Stats */}
          <Card className="shadow-lg bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FaBookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <span className="text-sm font-medium text-foreground">
                  Active Courses
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">-</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <span className="text-sm font-medium text-foreground">
                  Sessions This Week
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <span className="text-sm font-medium text-foreground">
                  Study Streak
                </span>
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">0 days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <span className="text-sm font-medium text-foreground">
                  Certificates Earned
                </span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Student;
