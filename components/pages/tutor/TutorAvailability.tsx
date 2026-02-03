"use client";

import { useState, useEffect } from "react";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  FaTrash,
  FaClock,
  FaCheck,
  FaTimes,
  FaGlobe,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import Moment from "react-moment";

interface Availability {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface TutorSession {
  id: number;
  title?: string;
  startTime: string;
  endTime: string;
  status: string;
  course: { id: number; title: string };
}

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

const COMMON_TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "Africa/Lagos", label: "Africa (Lagos)" },
  { value: "Africa/Cairo", label: "Africa (Cairo)" },
  { value: "Africa/Johannesburg", label: "Africa (Johannesburg)" },
  { value: "America/New_York", label: "America (New York)" },
  { value: "America/Los_Angeles", label: "America (Los Angeles)" },
  { value: "America/Chicago", label: "America (Chicago)" },
  { value: "Europe/London", label: "Europe (London)" },
  { value: "Europe/Paris", label: "Europe (Paris)" },
  { value: "Asia/Dubai", label: "Asia (Dubai)" },
  { value: "Asia/Kolkata", label: "Asia (Kolkata)" },
  { value: "Asia/Tokyo", label: "Asia (Tokyo)" },
];

const TutorAvailability = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [timezone, setTimezone] = useState<string>("UTC");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timezoneSaving, setTimezoneSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  useEffect(() => {
    fetchAvailability();
    fetchTutorAndSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const fetchTutorAndSessions = async () => {
    try {
      const [tutorRes, sessionsRes] = await Promise.all([
        axiosPrivate.get("tutors/me", { withCredentials: true }),
        axiosPrivate.get("sessions/tutor", { withCredentials: true }),
      ]);
      if (tutorRes?.data?.timezone) setTimezone(tutorRes.data.timezone);
      const sess = Array.isArray(sessionsRes?.data) ? sessionsRes.data : [];
      setSessions(sess);
    } catch (e) {
      console.error("Error fetching tutor/sessions:", e);
    }
  };

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`sessions/availability`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = Array.isArray(response?.data) ? response.data : [];
      setAvailabilities(data);
    } catch (error) {
      console.error("Error fetching availability:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load availability. Please try again.",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTimezoneChange = async (newTz: string) => {
    setTimezone(newTz);
    try {
      setTimezoneSaving(true);
      await axiosPrivate.patch(
        "tutors/me",
        { timezone: newTz },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      Swal.fire({
        icon: "success",
        title: "Timezone updated",
        text: "Your timezone is used for scheduling and availability.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error updating timezone:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update timezone.",
        confirmButtonText: "OK",
      });
    } finally {
      setTimezoneSaving(false);
    }
  };

  const handleAddAvailability = async () => {
    if (!selectedDay) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select a day of the week",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (startTime >= endTime) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Time",
        text: "End time must be after start time",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    // Check if availability already exists for this day
    const existing = availabilities.find((avail) => avail.dayOfWeek === selectedDay);
    if (existing) {
      Swal.fire({
        icon: "warning",
        title: "Already Exists",
        text: `You already have availability set for ${DAYS_OF_WEEK.find((d) => d.value === selectedDay)?.label}. Please delete it first or update the existing one.`,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setSubmitting(true);
      await axiosPrivate.post(
        `sessions/availability`,
        {
          dayOfWeek: selectedDay,
          startTime,
          endTime,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Availability Added",
        text: `Availability for ${DAYS_OF_WEEK.find((d) => d.value === selectedDay)?.label} has been added.`,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#10b981",
      });

      setShowForm(false);
      setSelectedDay("");
      setStartTime("09:00");
      setEndTime("17:00");
      fetchAvailability();
    } catch (error: any) {
      console.error("Error adding availability:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add availability. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, day: string) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Availability?",
      text: `Are you sure you want to remove availability for ${DAYS_OF_WEEK.find((d) => d.value === day)?.label}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPrivate.delete(`sessions/availability/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Availability Removed",
        text: `Availability for ${DAYS_OF_WEEK.find((d) => d.value === day)?.label} has been removed.`,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#10b981",
      });

      // Refresh availability list
      fetchAvailability();
    } catch (error: any) {
      console.error("Error deleting availability:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete availability. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: errorMessage,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const getDayLabel = (day: string) => {
    return DAYS_OF_WEEK.find((d) => d.value === day)?.label || day;
  };

  const getDayColor = (day: string) => {
    const colors: Record<string, string> = {
      MONDAY: "bg-blue-100 text-blue-800",
      TUESDAY: "bg-green-100 text-green-800",
      WEDNESDAY: "bg-yellow-100 text-yellow-800",
      THURSDAY: "bg-purple-100 text-purple-800",
      FRIDAY: "bg-pink-100 text-pink-800",
      SATURDAY: "bg-orange-100 text-orange-800",
      SUNDAY: "bg-red-100 text-red-800",
    };
    return colors[day] || "bg-gray-100 text-gray-800";
  };

  // Get days that already have availability
  const daysWithAvailability = availabilities.map((avail) => avail.dayOfWeek);
  const availableDays = DAYS_OF_WEEK.filter(
    (day) => !daysWithAvailability.includes(day.value)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading availability...</div>
      </div>
    );
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
  const sessionsByDay = weekDays.map((day) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    return sessions.filter((s) => {
      const t = new Date(s.startTime);
      return t >= dayStart && t <= dayEnd && s.status !== "CANCELLED";
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Availability</h1>
          <p className="text-gray-600">
            Set your weekly availability so students know when you&apos;re available for sessions
          </p>
        </div>

        {/* Timezone */}
        <Card className="border-blue-100">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <FaGlobe className="w-5 h-5 text-blue-600" />
                <Label htmlFor="timezone" className="font-medium">Your timezone</Label>
              </div>
              <Select
                value={timezone || "UTC"}
                onValueChange={handleTimezoneChange}
                disabled={timezoneSaving}
              >
                <SelectTrigger id="timezone" className="w-[280px]">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {timezoneSaving && <SyncLoader size={14} color="#2563eb" />}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Session times and availability are shown in this timezone.
            </p>
          </CardContent>
        </Card>

        {/* This week schedule */}
        {sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-green-600" />
                This week&apos;s schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                {weekDays.map((day, i) => (
                  <div key={i} className="border rounded-lg p-3 bg-gray-50">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      <Moment format="ddd M/D">{day}</Moment>
                    </div>
                    <div className="space-y-2">
                      {sessionsByDay[i].length === 0 ? (
                        <p className="text-xs text-gray-400">No sessions</p>
                      ) : (
                        sessionsByDay[i].map((s) => (
                          <div
                            key={s.id}
                            className="text-xs p-2 rounded bg-blue-50 border border-blue-100"
                          >
                            <div className="font-medium text-gray-800 truncate">
                              {s.title || s.course?.title || "Session"}
                            </div>
                            <div className="text-gray-600">
                              <Moment format="h:mm A">{s.startTime}</Moment>
                              {" – "}
                              <Moment format="h:mm A">{s.endTime}</Moment>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Availability */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-green-600" />
                Current Availability
              </CardTitle>
              <Button
                onClick={() => setShowForm(!showForm)}
                variant="outline"
                size="sm"
                disabled={availableDays.length === 0}
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Availability
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Availability Form */}
            {showForm && availableDays.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4">Add New Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day">Day of Week</Label>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDays.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      onClick={handleAddAvailability}
                      disabled={submitting || !selectedDay}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {submitting ? (
                        <SyncLoader size={6} color="#ffffff" />
                      ) : (
                        <>
                          <FaCheck className="w-4 h-4 mr-2" />
                          Add
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowForm(false);
                        setSelectedDay("");
                      }}
                    >
                      <FaTimes className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showForm && availableDays.length === 0 && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  You have set availability for all days of the week. To modify, delete an existing
                  availability first.
                </p>
              </div>
            )}

            {/* Availability List */}
            {availabilities.length === 0 ? (
              <div className="text-center py-12">
                <FaCalendarAlt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Availability Set
                </h3>
                <p className="text-gray-500 mb-6">
                  Set your weekly availability to let students know when you&apos;re available.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Set Availability
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {availabilities.map((availability) => (
                  <div
                    key={availability.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <Badge className={getDayColor(availability.dayOfWeek)}>
                        {getDayLabel(availability.dayOfWeek)}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock className="w-4 h-4" />
                        <span>
                          {availability.startTime} - {availability.endTime}
                        </span>
                      </div>
                      {availability.isAvailable && (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(availability.id, availability.dayOfWeek)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <FaCalendarAlt className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">About Availability</h3>
                <p className="text-sm text-blue-800">
                  Setting your availability helps students know when you&apos;re available for live
                  sessions. You can schedule sessions outside of these hours, but these are your
                  preferred teaching times.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorAvailability;
