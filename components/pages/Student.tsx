"use client";

import CourseTotals from "@/components/CourseTotals";
import StudentInfo from "@/components/StudentInfo";
import EnrollmentChart from "@/components/dashboard/EnrollmentChart";
import SpendingChart from "@/components/dashboard/SpendingChart";
import CourseProgress from "@/components/dashboard/CourseProgress";
import UpcomingSessionsWidget from "@/components/dashboard/UpcomingSessionsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaChartBar, FaDollarSign, FaBookOpen, FaCalendarAlt } from "react-icons/fa";

const Student = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-full space-y-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s your learning overview and statistics.
          </p>
        </div>

        {/* Student Info */}
        <StudentInfo />

        {/* Statistics Cards */}
        <CourseTotals />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaChartBar className="w-5 h-5 text-blue-600" />
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
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaDollarSign className="w-5 h-5 text-green-600" />
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
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaBookOpen className="w-5 h-5 text-purple-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Active Courses
                </span>
                <span className="text-2xl font-bold text-blue-600">-</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Sessions This Week
                </span>
                <span className="text-2xl font-bold text-green-600">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Study Streak
                </span>
                <span className="text-2xl font-bold text-yellow-600">0 days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Certificates Earned
                </span>
                <span className="text-2xl font-bold text-purple-600">0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Student;
