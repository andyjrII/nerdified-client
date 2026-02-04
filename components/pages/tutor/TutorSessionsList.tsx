"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBookOpen,
  FaUsers,
  FaVideo,
  FaClock,
  FaSearch,
  FaArrowLeft,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Moment from "react-moment";
import Link from "next/link";

interface Session {
  id: number;
  title?: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingUrl?: string;
  course: {
    id: number;
    title: string;
  };
  bookings?: Array<{
    id: number;
    status: string;
    student: {
      id: number;
      name: string;
    };
  }>;
}

const TutorSessionsList = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>([]);

  useEffect(() => {
    fetchSessions();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axiosPrivate.get(`tutors/me`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const tutorCourses = Array.isArray(response?.data?.courses) ? response.data.courses : [];
      setCourses(tutorCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`sessions/tutor`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const allSessions = Array.isArray(response?.data) ? response.data : [];
      setSessions(allSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load sessions. Please try again.",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId: number, sessionTitle: string) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Cancel Session?",
      text: `Are you sure you want to cancel "${sessionTitle || "this session"}"? All student bookings for this session will also be cancelled.`,
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPrivate.delete(`sessions/${sessionId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Session Cancelled",
        text: "The session has been cancelled and all student bookings have been notified.",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#10b981",
      });

      // Refresh sessions list
      fetchSessions();
    } catch (error: any) {
      console.error("Error cancelling session:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to cancel session. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Cancellation Failed",
        text: errorMessage,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      SCHEDULED: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-green-100 text-green-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.course?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    const matchesCourse = courseFilter === "all" || String(session.course.id) === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const upcomingSessions = filteredSessions.filter(
    (session) => new Date(session.startTime) > new Date() && session.status !== "CANCELLED"
  );
  const pastSessions = filteredSessions.filter(
    (session) => new Date(session.startTime) <= new Date() || session.status === "CANCELLED"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
            <p className="text-gray-600">Manage your scheduled live sessions</p>
          </div>
          <Link href="/tutor/sessions/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FaPlus className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={String(course.id)}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => {
                const bookingsCount = session.bookings?.filter(
                  (b) => b.status !== "CANCELLED"
                ).length || 0;
                const isStartingSoon =
                  new Date(session.startTime).getTime() - Date.now() < 30 * 60 * 1000 &&
                  new Date(session.startTime).getTime() > Date.now();

                return (
                  <Card
                    key={session.id}
                    className={`shadow-lg ${
                      isStartingSoon ? "border-orange-300 bg-orange-50" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg font-bold line-clamp-2">
                          {session.title || session.course?.title || "Session"}
                        </CardTitle>
                        {getStatusBadge(session.status)}
                      </div>
                      {isStartingSoon && (
                        <Badge className="bg-orange-200 text-orange-800 mt-2">
                          Starting Soon!
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaBookOpen className="w-4 h-4" />
                          <span className="truncate">{session.course?.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaClock className="w-4 h-4" />
                          <span>
                            <Moment format="MMM D, YYYY • h:mm A">{session.startTime}</Moment>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaClock className="w-4 h-4" />
                          <span>
                            <Moment format="h:mm A">{session.endTime}</Moment>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaUsers className="w-4 h-4" />
                          <span>{bookingsCount} student{bookingsCount !== 1 ? "s" : ""} booked</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            className="flex-1"
                            size="sm"
                            onClick={() => router.push(`/tutor/sessions/live/${session.id}`)}
                          >
                            <FaVideo className="w-3 h-3 mr-2" />
                            Join
                          </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(session.id, session.title || "")}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastSessions.map((session) => {
                const bookingsCount = session.bookings?.filter(
                  (b) => b.status !== "CANCELLED"
                ).length || 0;

                return (
                  <Card key={session.id} className="shadow-lg opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg font-bold line-clamp-2">
                          {session.title || session.course?.title || "Session"}
                        </CardTitle>
                        {getStatusBadge(session.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaBookOpen className="w-4 h-4" />
                          <span className="truncate">{session.course?.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaClock className="w-4 h-4" />
                          <span>
                            <Moment format="MMM D, YYYY • h:mm A">{session.startTime}</Moment>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaUsers className="w-4 h-4" />
                          <span>{bookingsCount} attended</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FaCalendarAlt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Sessions Found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== "all" || courseFilter !== "all"
                  ? "No sessions match your filters."
                  : "Schedule your first session to start teaching!"}
              </p>
              {!searchQuery && statusFilter === "all" && courseFilter === "all" && (
                <Link href="/tutor/sessions/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <FaPlus className="w-4 h-4 mr-2" />
                    Schedule Your First Session
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TutorSessionsList;
