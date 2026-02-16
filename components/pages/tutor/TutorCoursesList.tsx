"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaBookOpen, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import Link from "next/link";
import {
  TutorCoursesFilters,
  TutorCourseRow,
  TutorCourseDetailPanel,
  type Course,
  type CourseEnrollment,
  type StatusFilter,
} from "./courses";

const TutorCoursesList = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null | undefined>(undefined);
  const [enrollmentsMap, setEnrollmentsMap] = useState<Record<number, CourseEnrollment[]>>({});
  const [duplicatingId, setDuplicatingId] = useState<number | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [axiosPrivate]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      fetchAllEnrollments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when courses list changes
  }, [courses]);

  const fetchAllEnrollments = async () => {
    const enrollments: Record<number, CourseEnrollment[]> = {};
    try {
      const response = await axiosPrivate.get(`courses/payments/1`, {
        params: {},
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const allEnrollments = Array.isArray(response?.data?.payments) ? response.data.payments : [];
      allEnrollments.forEach((enrollment: any) => {
        const courseId = enrollment.courseId || enrollment.course?.id;
        if (courseId) {
          if (!enrollments[courseId]) enrollments[courseId] = [];
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

  useEffect(() => {
    if (selectedCourseId == null) {
      setSelectedCourseDetail(undefined);
      return;
    }
    let cancelled = false;
    setSelectedCourseDetail(undefined);
    (async () => {
      try {
        const response = await axiosPrivate.get(`courses/course/${selectedCourseId}/tutor`, {
          withCredentials: true,
        });
        if (!cancelled && response?.data) setSelectedCourseDetail(response.data);
      } catch {
        if (!cancelled) setSelectedCourseDetail(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCourseId, axiosPrivate]);

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
      if (selectedCourseId === courseId) setSelectedCourseId(null);
      fetchCourses();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete course. Please try again.";
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

  const handleDuplicateCourse = async (courseId: number) => {
    setDuplicatingId(courseId);
    try {
      const response = await axiosPrivate.post(`courses/duplicate/${courseId}`, {}, { withCredentials: true });
      const newCourse = response?.data;
      const newId = newCourse?.id;
      if (newId) {
        Swal.fire({
          icon: "success",
          title: "Course duplicated",
          text: "Opening the copy for editing.",
          confirmButtonColor: "#10b981",
        });
        router.push(`/tutor/courses/${newId}/edit`);
      } else {
        Swal.fire({ icon: "error", title: "Failed", text: "Could not duplicate course.", confirmButtonColor: "#ef4444" });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Could not duplicate course.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setDuplicatingId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "draft" && course.status === "DRAFT") ||
      (statusFilter === "published" && course.status === "PUBLISHED");
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (filteredCourses.length > 0) {
      const selectionInList = selectedCourseId != null && filteredCourses.some((c) => c.id === selectedCourseId);
      if (!selectionInList) {
        setSelectedCourseId(filteredCourses[0].id);
      }
    } else {
      setSelectedCourseId(null);
    }
  }, [filteredCourses, selectedCourseId]);

  const filterCounts = {
    all: courses.length,
    draft: courses.filter((c) => c.status === "DRAFT").length,
    published: courses.filter((c) => c.status === "PUBLISHED").length,
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-4 lg:px-6 py-6">
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
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

        <Card>
          <CardContent className="pt-6">
            <TutorCoursesFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              counts={filterCounts}
              onClearAll={clearFilters}
            />
          </CardContent>
        </Card>

        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FaBookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Yet</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "No courses match your filters."
                  : "Create your first course to start teaching!"}
              </p>
              {!searchQuery && statusFilter === "all" && (
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
          <div
            className={
              selectedCourseId != null
                ? "lg:flex lg:gap-6 lg:items-start"
                : ""
            }
          >
            <div
              className={
                selectedCourseId != null
                  ? "lg:min-w-0 lg:max-w-md lg:flex-shrink-0"
                  : ""
              }
            >
              <Card className="overflow-hidden">
                <div className="divide-y divide-slate-200">
                  {filteredCourses.map((course) => {
                    const enrollments = enrollmentsMap[course.id] || [];
                    const totalRevenue = enrollments.reduce(
                      (sum, e) => sum + parseFloat(String(e.paidAmount || 0)),
                      0
                    );
                    return (
                    <TutorCourseRow
                      key={course.id}
                      course={course}
                      enrollmentsCount={enrollments.length}
                      totalRevenue={totalRevenue}
                      isSelected={selectedCourseId === course.id}
                      onSelect={() => setSelectedCourseId(course.id)}
                    />
                    );
                  })}
                </div>
              </Card>
            </div>

            {selectedCourseId != null && (() => {
              const course = courses.find((c) => c.id === selectedCourseId);
              if (!course) return null;
              return (
                <div className="mt-6 lg:mt-0 lg:flex-1 lg:min-w-0">
                <TutorCourseDetailPanel
                  course={course}
                  courseDetail={selectedCourseDetail}
                  enrollments={enrollmentsMap[selectedCourseId] ?? []}
                  onClose={() => setSelectedCourseId(null)}
                  onDuplicate={() => handleDuplicateCourse(course.id)}
                  onDelete={() => handleDelete(course.id, course.title)}
                  duplicating={duplicatingId === course.id}
                />
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorCoursesList;
