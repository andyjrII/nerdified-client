"use client";

import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaCalendarAlt, FaClock, FaVideo, FaExclamationCircle } from "react-icons/fa";
import Moment from "react-moment";
import { getAuthStudent } from "@/utils/authStorage";
import { useRouter } from "next/navigation";

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
    tutor: {
      name: string;
    };
  };
}

const UpcomingSessionsWidget = () => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getAuthStudent();
    if (data?.email) setEmail(data.email);
  }, []);

  useEffect(() => {
    if (email) {
      fetchUpcomingSessions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`sessions/bookings`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const bookings = Array.isArray(response?.data) ? response.data : [];
      
      // Extract sessions from bookings and filter upcoming ones
      const sessions = bookings
        .map((booking: any) => booking.session)
        .filter((session: any) => {
          if (!session) return false;
          const startTime = new Date(session.startTime);
          const now = new Date();
          return startTime > now && session.status !== "CANCELLED";
        })
        .sort((a: any, b: any) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        )
        .slice(0, 3); // Show only next 3

      setUpcomingSessions(sessions);
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
      setUpcomingSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const joinSession = (session: Session) => {
    router.push(`/student/sessions/live/${session.id}`);
  };

  const viewAllSessions = () => {
    router.push("/student/sessions");
  };

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaCalendarAlt className="w-5 h-5 text-blue-600" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (upcomingSessions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaCalendarAlt className="w-5 h-5 text-blue-600" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FaCalendarAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No upcoming sessions</p>
            <p className="text-sm text-gray-400 mb-4">
              Sessions will appear here when you book them
            </p>
            <Button
              variant="outline"
              onClick={viewAllSessions}
              className="mt-2"
            >
              Browse Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FaCalendarAlt className="w-5 h-5 text-blue-600" />
            Upcoming Sessions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={viewAllSessions}
            className="text-xs"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingSessions.map((session) => {
            const startTime = new Date(session.startTime);
            const endTime = new Date(session.endTime);
            const isStartingSoon = 
              startTime.getTime() - Date.now() < 30 * 60 * 1000 && // Within 30 minutes
              startTime.getTime() > Date.now();

            return (
              <div
                key={session.id}
                className={`p-4 border rounded-lg transition-colors ${
                  isStartingSoon
                    ? "border-orange-300 bg-orange-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {session.title || session.course?.title || "Session"}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {session.course?.title || "Course"}
                    </p>
                  </div>
                  {isStartingSoon && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-orange-100 text-orange-800 border-orange-300"
                    >
                      <FaExclamationCircle className="w-3 h-3 mr-1" />
                      Soon
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <FaClock className="w-3 h-3" />
                    <span>
                      <Moment format="MMM D, YYYY • h:mm A">{session.startTime}</Moment>
                      {" - "}
                      <Moment format="h:mm A">{session.endTime}</Moment>
                    </span>
                  </div>
                  {session.course?.tutor?.name && (
                    <p className="text-xs text-gray-500">
                      Tutor: {session.course.tutor.name}
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    isStartingSoon
                      ? joinSession(session)
                      : router.push("/student/sessions")
                  }
                >
                  <FaVideo className="w-3 h-3 mr-2" />
                  {isStartingSoon ? "Join Session" : "View Details"}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionsWidget;
