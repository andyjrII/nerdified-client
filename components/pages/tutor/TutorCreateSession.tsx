"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCalendarAlt, FaArrowLeft, FaClock } from "react-icons/fa";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import Link from "next/link";

interface Course {
  id: number;
  title: string;
}

const TutorCreateSession = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const router = useRouter();
  const errRef = useRef<HTMLParagraphElement>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setFetching(true);
      const response = await axiosPrivate.get(`tutors/me`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const tutorCourses = Array.isArray(response?.data?.courses) ? response.data.courses : [];
      setCourses(tutorCourses);
      if (tutorCourses.length > 0) {
        setCourseId(String(tutorCourses[0].id));
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load courses. Please create a course first.",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
      router.push("/tutor/courses");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!courseId) {
      setErrMsg("Please select a course");
      errRef.current?.focus();
      setLoading(false);
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      setErrMsg("Please fill in all date and time fields");
      errRef.current?.focus();
      setLoading(false);
      return;
    }

    // Combine date and time into ISO strings
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (startDateTime >= endDateTime) {
      setErrMsg("End time must be after start time");
      errRef.current?.focus();
      setLoading(false);
      return;
    }

    if (startDateTime < new Date()) {
      setErrMsg("Start time cannot be in the past");
      errRef.current?.focus();
      setLoading(false);
      return;
    }

    try {
      const sessionData = {
        courseId: parseInt(courseId),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        title: title.trim() || undefined,
        description: description.trim() || undefined,
      };

      const response = await axiosPrivate.post("sessions", sessionData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Session Scheduled",
        text: "Your session has been created successfully!",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#10b981",
      });

      router.push("/tutor/sessions");
    } catch (err: any) {
      console.error("Session creation error:", err);
      let errorMessage = "Session creation failed";

      if (!err?.response) {
        errorMessage = "No Server Response - Check your connection";
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || "Invalid request data";
      } else if (err.response?.status === 404) {
        errorMessage = "Course not found or does not belong to you";
      } else {
        errorMessage = err.response?.data?.message || "Session creation failed";
      }

      setErrMsg(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: errorMessage,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
      errRef.current?.focus();
    }
    setLoading(false);
  };

  // Set default dates (today for start, tomorrow for end)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (!startDate) {
      setStartDate(formatDate(today));
    }
    if (!endDate) {
      setEndDate(formatDate(tomorrow));
    }
    if (!startTime) {
      setStartTime("09:00");
    }
    if (!endTime) {
      setEndTime("10:00");
    }
  }, []);

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading courses...</div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FaCalendarAlt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Available</h3>
              <p className="text-gray-500 mb-6">
                You need to create at least one course before scheduling sessions.
              </p>
              <Link href="/tutor/courses/new">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Create Your First Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/tutor/sessions">
            <Button variant="ghost" size="sm">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Sessions
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule New Session</h1>
            <p className="text-gray-600 mt-1">Create a live session for your course</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaCalendarAlt className="w-5 h-5 text-blue-600" />
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              ref={errRef}
              className={`text-center text-sm text-red-600 mb-4 ${errMsg ? "block" : "hidden"}`}
              aria-live="assertive"
            >
              {errMsg}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Selection */}
              <div className="space-y-2">
                <Label htmlFor="courseId">
                  Course <span className="text-red-500">*</span>
                </Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger id="courseId">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={String(course.id)}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Session Title (Optional)</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Introduction to React Hooks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Leave empty to use course title as session title
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What will be covered in this session?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date & Time */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaClock className="w-4 h-4" />
                    Start Time
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">
                      Start Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* End Date & Time */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaClock className="w-4 h-4" />
                    End Time
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">
                      End Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      min={startDate || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">
                      End Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Link href="/tutor/sessions" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={loading || !courseId}
                >
                  {loading ? <SyncLoader size={8} color="#ffffff" /> : "Schedule Session"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorCreateSession;
