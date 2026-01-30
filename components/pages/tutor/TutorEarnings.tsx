"use client";

import { useState, useEffect } from "react";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FaDollarSign,
  FaUsers,
  FaBookOpen,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";
import Moment from "react-moment";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";

interface ByCourse {
  courseId: number;
  title: string;
  count: number;
  revenue: number;
}

interface RecentEnrollment {
  id: number;
  paidAmount: number;
  dateEnrolled: string;
  status: string;
  course: { id: number; title: string };
  student: { id: number; name: string; email: string };
}

interface EarningsData {
  totalEarnings: number;
  totalEnrollments: number;
  byCourse: ByCourse[];
  recentEnrollments: RecentEnrollment[];
}

const TutorEarnings = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("tutors/me/earnings", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setData(response?.data ?? null);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      STARTED: "bg-green-100 text-green-800",
      FINISHED: "bg-blue-100 text-blue-800",
      DROPPED: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading earnings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
          <p className="text-gray-600">Overview of your course revenue and enrollments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <FaDollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data ? formatCurrency(data.totalEarnings) : formatCurrency(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FaUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.totalEnrollments ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <FaBookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Courses with revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.byCourse?.length ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {data?.byCourse && data.byCourse.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaChartLine className="w-5 h-5 text-purple-600" />
                Revenue by Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.byCourse.map((row) => (
                  <div
                    key={row.courseId}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/tutor/courses/${row.courseId}/enrollments`}
                        className="font-medium text-purple-600 hover:underline truncate block"
                      >
                        {row.title}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {row.count} enrollment{row.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 ml-4">
                      {formatCurrency(row.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-purple-600" />
                Recent Enrollments
              </CardTitle>
              <Link href="/tutor/courses">
                <span className="text-sm text-purple-600 hover:underline">
                  View all courses
                </span>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data?.recentEnrollments && data.recentEnrollments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentEnrollments.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{e.student?.name ?? "—"}</p>
                          <p className="text-xs text-gray-500">{e.student?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/tutor/courses/${e.course?.id}/enrollments`}
                          className="text-purple-600 hover:underline"
                        >
                          {e.course?.title ?? "—"}
                        </Link>
                      </TableCell>
                      <TableCell>{formatCurrency(e.paidAmount)}</TableCell>
                      <TableCell>
                        <Moment format="MMM D, YYYY">{e.dateEnrolled}</Moment>
                      </TableCell>
                      <TableCell>{getStatusBadge(e.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FaCalendarAlt className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No enrollments yet. Revenue will appear here when students enroll.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorEarnings;
