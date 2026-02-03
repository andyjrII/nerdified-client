"use client";

import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaCalendarAlt, FaClock, FaVideo, FaTimes, FaCheckCircle } from "react-icons/fa";
import Moment from "react-moment";
import db from "@/utils/localBase";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";

interface Session {
  id: number;
  title?: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingUrl?: string;
  maxStudents?: number;
  course: {
    id: number;
    title: string;
    tutor: {
      id: number;
      name: string;
    };
  };
  bookings?: any[];
}

const SessionBookings = () => {
  const axiosPrivate = useAxiosPrivate();
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get("courseId");
  const [email, setEmail] = useState<string>("");
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
    courseIdParam ? parseInt(courseIdParam) : null
  );
  const [sessions, setSessions] = useState<Session[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      fetchEnrolledCourses();
      fetchMyBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when selectedCourseId changes
  }, [selectedCourseId]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axiosPrivate.get(`students/enrolled/${email}`);
      const courses = Array.isArray(response?.data) ? response.data : [];
      setEnrolledCourses(courses);
      
      // Auto-select course if only one
      if (courses.length === 1 && !selectedCourseId) {
        setSelectedCourseId(courses[0].courseId);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      setEnrolledCourses([]);
    }
  };

  const fetchSessions = async () => {
    if (!selectedCourseId) return;
    
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`sessions/course/${selectedCourseId}`);
      const sessionsData = Array.isArray(response?.data) ? response.data : [];
      
      // Sort by start time
      const sortedSessions = sessionsData.sort(
        (a: Session, b: Session) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      
      setSessions(sortedSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await axiosPrivate.get(`sessions/bookings`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const bookings = Array.isArray(response?.data) ? response.data : [];
      setMyBookings(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMyBookings([]);
    }
  };

  const isBooked = (sessionId: number): boolean => {
    return myBookings.some(
      (booking: any) =>
        booking.sessionId === sessionId &&
        booking.status !== "CANCELLED"
    );
  };

  const getBookingForSession = (sessionId: number) => {
    return myBookings.find(
      (booking: any) =>
        booking.sessionId === sessionId &&
        booking.status !== "CANCELLED"
    );
  };

  const canBook = (session: Session): boolean => {
    const now = new Date();
    const startTime = new Date(session.startTime);
    
    // Can't book past sessions or cancelled sessions
    if (startTime < now || session.status === "CANCELLED") {
      return false;
    }

    // Check if already booked
    if (isBooked(session.id)) {
      return false;
    }

    // Check capacity if available
    if (session.maxStudents && session.bookings) {
      const activeBookings = session.bookings.filter(
        (b: any) => b.status !== "CANCELLED"
      ).length;
      if (activeBookings >= session.maxStudents) {
        return false;
      }
    }

    return true;
  };

  const bookSession = async (sessionId: number) => {
    try {
      const response = await axiosPrivate.post(
        `sessions/${sessionId}/book`,
        null,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Session Booked!",
        text: "You have successfully booked this session.",
        confirmButtonText: "OK",
      });

      // Refresh sessions and bookings
      await fetchSessions();
      await fetchMyBookings();
    } catch (error: any) {
      console.error("Error booking session:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to book session. Please try again.";
      
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    }
  };

  const cancelBooking = async (bookingId: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this session booking?",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No, keep it",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPrivate.delete(`sessions/bookings/${bookingId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Booking Cancelled",
        text: "Your session booking has been cancelled.",
        confirmButtonText: "OK",
      });

      // Refresh sessions and bookings
      await fetchSessions();
      await fetchMyBookings();
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to cancel booking. Please try again.";
      
      Swal.fire({
        icon: "error",
        title: "Cancellation Failed",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    }
  };

  const joinSession = (session: Session) => {
    if (session.meetingUrl) {
      window.open(session.meetingUrl, "_blank");
    } else {
      alert("Session meeting link will be available when the session starts.");
    }
  };

  const getStatusBadge = (session: Session) => {
    const now = new Date();
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);

    if (session.status === "CANCELLED") {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
    }

    if (session.status === "COMPLETED" || endTime < now) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Completed</Badge>;
    }

    if (session.status === "IN_PROGRESS" || (startTime <= now && endTime >= now)) {
      return <Badge variant="outline" className="bg-green-100 text-green-800">Live Now</Badge>;
    }

    if (startTime > now) {
      const hoursUntil = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (hoursUntil < 24) {
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Upcoming</Badge>;
      }
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    }

    return <Badge variant="outline">Unknown</Badge>;
  };

  if (enrolledCourses.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Browse Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">You need to enroll in a course first</p>
            <p className="text-sm text-gray-400">
              Enroll in a course to view and book sessions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Selector */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Select Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {enrolledCourses.map((enrollment) => (
              <Button
                key={enrollment.id}
                variant={selectedCourseId === enrollment.courseId ? "default" : "outline"}
                onClick={() => setSelectedCourseId(enrollment.courseId)}
                className="justify-start h-auto py-3"
              >
                <div className="text-left">
                  <div className="font-semibold">{enrollment.course.title}</div>
                  <div className="text-xs opacity-75">
                    {enrollment.course.tutor?.name || "Tutor"}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {selectedCourseId && (
        <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaCalendarAlt className="w-5 h-5 text-blue-600" />
            Available Sessions
          </CardTitle>
          <p className="text-sm text-gray-500 font-normal">
            Times are shown in your local timezone.
          </p>
        </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-pulse text-gray-400">Loading sessions...</div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <FaCalendarAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No sessions available</p>
                <p className="text-sm text-gray-400">
                  Sessions will appear here when the tutor creates them
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => {
                  const booked = isBooked(session.id);
                  const booking = getBookingForSession(session.id);
                  
                  return (
                    <div
                      key={session.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {session.title || session.course?.title || "Session"}
                          </h4>
                          {session.description && (
                            <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaClock className="w-4 h-4" />
                              <span>
                                <Moment format="MMM D, YYYY • h:mm A">{session.startTime}</Moment>
                                {" - "}
                                <Moment format="h:mm A">{session.endTime}</Moment>
                              </span>
                            </div>
                            {session.course?.tutor?.name && (
                              <span>Tutor: {session.course.tutor.name}</span>
                            )}
                            {session.maxStudents && (
                              <span>
                                Capacity: {session.bookings?.length || 0}/{session.maxStudents}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(session)}
                          {booked && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              <FaCheckCircle className="w-3 h-3 mr-1" />
                              Booked
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {booked ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => booking && cancelBooking(booking.id)}
                              className="flex-1"
                            >
                              <FaTimes className="w-4 h-4 mr-2" />
                              Cancel Booking
                            </Button>
                            {session.status === "IN_PROGRESS" && session.meetingUrl && (
                              <Button
                                size="sm"
                                onClick={() => joinSession(session)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <FaVideo className="w-4 h-4 mr-2" />
                                Join Now
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => bookSession(session.id)}
                            disabled={!canBook(session)}
                            className="flex-1"
                          >
                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                            {canBook(session) ? "Book Session" : "Unavailable"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionBookings;
