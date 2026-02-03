"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FaBookOpen,
  FaEdit,
  FaTrash,
  FaUsers,
  FaDollarSign,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { formatCurrency } from "@/utils/formatCurrency";
import Moment from "react-moment";
import Link from "next/link";

interface Course {
  id: number;
  title: string;
  description?: string;
  price: number;
  pricingModel: string;
  courseType: string;
  maxStudents?: number;
  createdAt: string;
  updatedAt: string;
  enrollments?: CourseEnrollment[];
}

interface CourseEnrollment {
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

const TutorCoursesList = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollmentsMap, setEnrollmentsMap] = useState<Record<number, CourseEnrollment[]>>({});

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      fetchAllEnrollments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when courses list changes
  }, [courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Fetch tutor profile which includes courses
      const response = await axiosPrivate.get(`tutors/me`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const tutorCourses = Array.isArray(response?.data?.courses) ? response.data.courses : [];
      setCourses(tutorCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load courses. Please try again.",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEnrollments = async () => {
    const enrollments: Record<number, CourseEnrollment[]> = {};
    
    // Use coursePayments endpoint to get enrollments and filter by course
    try {
      const response = await axiosPrivate.get(`courses/payments/1`, {
        params: {},
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      
      const allEnrollments = Array.isArray(response?.data?.payments) 
        ? response.data.payments 
        : [];
      
      // Group enrollments by courseId
      allEnrollments.forEach((enrollment: any) => {
        const courseId = enrollment.courseId || enrollment.course?.id;
        if (courseId) {
          if (!enrollments[courseId]) {
            enrollments[courseId] = [];
          }
          enrollments[courseId].push({
            id: enrollment.id,
            status: enrollment.status,
            paidAmount: parseFloat(String(enrollment.paidAmount || 0)),
            dateEnrolled: enrollment.dateEnrolled,
            student: enrollment.student || {
              id: enrollment.studentId,
              name: enrollment.student?.name || "Unknown",
              email: enrollment.student?.email || "",
            },
          });
        }
      });
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
    
    setEnrollmentsMap(enrollments);
  };

  const handleDelete = async (courseId: number, courseTitle: string) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Course?",
      text: `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPrivate.delete(`courses/${courseId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Course Deleted",
        text: `${courseTitle} has been deleted successfully.`,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#10b981",
      });

      fetchCourses();
    } catch (error: any) {
      console.error("Error deleting course:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete course. Please try again.";
      
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: errorMessage,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const getCourseTypeBadge = (courseType: string) => {
    if (courseType === "ONE_ON_ONE") {
      return <Badge className="bg-blue-100 text-blue-800">One-on-One</Badge>;
    }
    return <Badge className="bg-purple-100 text-purple-800">Group Class</Badge>;
  };

  const getPricingModelBadge = (pricingModel: string) => {
    if (pricingModel === "PER_COURSE") {
      return <Badge className="bg-green-100 text-green-800">Per Course</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-800">Per Session</Badge>;
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
            <p className="text-gray-600">Manage your courses and track enrollments</p>
          </div>
          <Link href="/tutor/courses/new">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <FaPlus className="w-4 h-4 mr-2" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FaBookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Yet</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "No courses match your search."
                  : "Create your first course to start teaching!"}
              </p>
              {!searchQuery && (
                <Link href="/tutor/courses/new">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <FaPlus className="w-4 h-4 mr-2" />
                    Create Your First Course
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrollments = enrollmentsMap[course.id] || [];
              const totalRevenue = enrollments.reduce(
                (sum, enrollment) => sum + parseFloat(String(enrollment.paidAmount || 0)),
                0
              );

              return (
                <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg font-bold line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <div className="flex gap-2 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/tutor/courses/${course.id}/edit`)}
                          className="h-8 w-8 p-0"
                        >
                          <FaEdit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(course.id, course.title)}
                          className="h-8 w-8 p-0"
                        >
                          <FaTrash className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {getCourseTypeBadge(course.courseType)}
                      {getPricingModelBadge(course.pricingModel)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {course.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(course.price)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <FaUsers className="w-3 h-3" />
                          Enrollments:
                        </span>
                        <span className="font-semibold text-gray-900">{enrollments.length}</span>
                      </div>
                      {totalRevenue > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <FaDollarSign className="w-3 h-3" />
                            Revenue:
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(totalRevenue)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-500">
                          <Moment format="MMM D, YYYY">{course.createdAt}</Moment>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Link href={`/tutor/courses/${course.id}/enrollments`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          <FaUsers className="w-3 h-3 mr-2" />
                          View Enrollments
                        </Button>
                      </Link>
                      <Link href={`/tutor/courses/${course.id}/edit`} className="flex-1">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                          <FaEdit className="w-3 h-3 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorCoursesList;
