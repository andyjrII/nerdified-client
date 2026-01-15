"use client";

import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaCalendarAlt, FaClock, FaVideo } from "react-icons/fa";
import Moment from "react-moment";
import db from "@/utils/localBase";

const UpcomingSessionsWidget = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState<string>("");
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);

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
      fetchUpcomingSessions();
    }
  }, [email]);

  const fetchUpcomingSessions = async () => {
    try {
      // TODO: Replace with actual sessions booking endpoint
      // const response = await axiosPrivate.get(`sessions/bookings`);
      // const sessions = Array.isArray(response?.data) ? response.data : [];
      // Filter upcoming sessions (startTime > now)
      // setUpcomingSessions(sessions.filter(s => new Date(s.startTime) > new Date()));
      setUpcomingSessions([]);
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
      setUpcomingSessions([]);
    }
  };

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
            <p className="text-sm text-gray-400">
              Sessions will appear here when you book them
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaCalendarAlt className="w-5 h-5 text-blue-600" />
          Upcoming Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingSessions.slice(0, 3).map((session) => (
            <div
              key={session.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {session.title || session.course?.title || "Session"}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <FaClock className="w-3 h-3" />
                    <Moment format="MMM D, YYYY • h:mm A">
                      {session.startTime}
                    </Moment>
                  </div>
                </div>
                <Badge variant="outline" className="ml-2">
                  Upcoming
                </Badge>
              </div>
              <Button size="sm" className="w-full mt-2">
                <FaVideo className="w-3 h-3 mr-2" />
                Join Session
              </Button>
            </div>
          ))}
          {upcomingSessions.length > 3 && (
            <Button variant="outline" className="w-full">
              View All ({upcomingSessions.length})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionsWidget;
