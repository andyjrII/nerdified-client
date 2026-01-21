"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import axios from "@/lib/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaArrowLeft, FaUsers, FaDollarSign, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import Moment from "react-moment";
import { formatCurrency } from "@/utils/formatCurrency";

interface Enrollment {
  id: number;
  status: string;
  paidAmount: number;
  dateEnrolled: string;
  student: {
    id: number;
    name: string;
    email: string;
  };
}

interface Course {
  id: number;
  title: string;
  price: number;
}

const TutorCourseEnrollments = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id ? parseInt(String(params.id)) : null;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchEnrollments();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId) return;
    try {
      const response = await axios.get(`courses/course/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const fetchEnrollments = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      // Use coursePayments endpoint and filter by courseId
      const response = await axiosPrivate.get(`courses/payments/1`, {
        params: {},
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const allEnrollments = Array.isArray(response?.data?.payments)
        ? response.data.payments
        : [];

      // Filter enrollments for this course
      const courseEnrollments = allEnrollments.filter(
        (enrollment: any) =>
          enrollment.courseId === courseId || enrollment.course?.id === courseId
      );

      setEnrollments(
        courseEnrollments.map((enrollment: any) => ({
          id: enrollment.id,
          status: enrollment.status,
          paidAmount: parseFloat(String(enrollment.paidAmount || 0)),
          dateEnrolled: enrollment.dateEnrolled,
          student: enrollment.student || {
            id: enrollment.studentId,
            name: enrollment.student?.name || "Unknown",
            email: enrollment.student?.email || "",
          },
        }))
      );
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      ACTIVE: "bg-green-100 text-green-800",
      COMPLETED: "bg-blue-100 text-blue-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const totalRevenue = enrollments.reduce(
    (sum, enrollment) => sum + enrollment.paidAmount,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading enrollments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/tutor/courses">
            <Button variant="ghost" size="sm">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Enrollments</h1>
            <p className="text-gray-600 mt-1">
              {course?.title || "View students enrolled in this course"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Enrollments</p>
                  <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
                </div>
                <FaUsers className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
                <FaDollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Course Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {course ? formatCurrency(course.price) : "-"}
                  </p>
                </div>
                <FaCalendarAlt className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrollments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Enrolled Students</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Enrollments Yet</h3>
                <p className="text-gray-500">Students will appear here once they enroll in this course.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date Enrolled</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">
                        {enrollment.student.name || "Unknown"}
                      </TableCell>
                      <TableCell>{enrollment.student.email}</TableCell>
                      <TableCell>
                        <Moment format="MMM D, YYYY">{enrollment.dateEnrolled}</Moment>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(enrollment.paidAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorCourseEnrollments;
