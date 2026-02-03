"use client";

import { useRef, useState, useEffect, startTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import axios from "@/lib/api/axios";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
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
import { FaBookOpen, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface Course {
  id: number;
  title: string;
  description?: string;
  price: number;
  pricingModel: string;
  courseType: string;
  maxStudents?: number;
  curriculum?: string;
  outcomes?: string;
}

const TutorEditCourse = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id ? parseInt(String(params.id)) : null;
  const errRef = useRef<HTMLParagraphElement>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [pricingModel, setPricingModel] = useState<"PER_COURSE" | "PER_SESSION">("PER_COURSE");
  const [courseType, setCourseType] = useState<"ONE_ON_ONE" | "GROUP">("ONE_ON_ONE");
  const [maxStudents, setMaxStudents] = useState<string>("");
  const [curriculum, setCurriculum] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when courseId changes
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId) return;
    try {
      setFetching(true);
      const response = await axios.get(`courses/course/${courseId}`);
      if (!response.data) {
        Swal.fire({
          icon: "error",
          title: "Course Not Found",
          text: "This course does not exist.",
          confirmButtonText: "OK",
          showConfirmButton: true,
          confirmButtonColor: "#ef4444",
        });
        router.push("/tutor/courses");
        return;
      }
      const courseData = response.data;
      setCourse(courseData);
      setTitle(courseData.title || "");
      setDescription(courseData.description || "");
      setPrice(String(courseData.price || 0));
      setPricingModel(courseData.pricingModel || "PER_COURSE");
      setCourseType(courseData.courseType || "ONE_ON_ONE");
      setMaxStudents(courseData.maxStudents ? String(courseData.maxStudents) : "");
      setCurriculum(courseData.curriculum || "");
      setOutcomes(courseData.outcomes || "");
    } catch (err) {
      console.error("Error fetching course:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load course. Please try again.",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
      startTransition(() => router.push("/tutor/courses"));
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!courseId) {
      setErrMsg("Course ID not found");
      setLoading(false);
      return;
    }

    try {
      const courseData: any = {};
      if (title.trim()) courseData.title = title.trim();
      if (description.trim()) courseData.description = description.trim();
      if (price) courseData.price = parseFloat(price);
      if (pricingModel) courseData.pricingModel = pricingModel;
      if (courseType) courseData.courseType = courseType;
      if (courseType === "GROUP" && maxStudents) {
        courseData.maxStudents = parseInt(maxStudents);
      } else if (courseType === "ONE_ON_ONE") {
        courseData.maxStudents = undefined;
      }
      if (curriculum.trim()) courseData.curriculum = curriculum.trim();
      if (outcomes.trim()) courseData.outcomes = outcomes.trim();

      const response = await axiosPrivate.patch(`courses/update/${courseId}`, courseData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Course Updated",
        text: `${title || course?.title} has been updated successfully!`,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#10b981",
      });

      startTransition(() => router.push("/tutor/courses"));
    } catch (err: any) {
      console.error("Course update error:", err);
      let errorMessage = "Course update failed";

      if (!err?.response) {
        errorMessage = "No Server Response - Check your connection";
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || "Invalid request data";
      } else if (err.response?.status === 404) {
        errorMessage = "Course not found";
      } else {
        errorMessage = err.response?.data?.message || "Course update failed";
      }

      setErrMsg(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
      errRef.current?.focus();
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/tutor/courses">
            <Button variant="ghost" size="sm">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-600 mt-1">Update your course information</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaBookOpen className="w-5 h-5 text-purple-600" />
              Course Information
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Introduction to Web Development"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Pricing Model */}
                <div className="space-y-2">
                  <Label htmlFor="pricingModel">Pricing Model</Label>
                  <Select
                    value={pricingModel}
                    onValueChange={(value) => setPricingModel(value as "PER_COURSE" | "PER_SESSION")}
                  >
                    <SelectTrigger id="pricingModel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PER_COURSE">Per Course</SelectItem>
                      <SelectItem value="PER_SESSION">Per Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Course Type */}
                <div className="space-y-2">
                  <Label htmlFor="courseType">Course Type</Label>
                  <Select
                    value={courseType}
                    onValueChange={(value) => setCourseType(value as "ONE_ON_ONE" | "GROUP")}
                  >
                    <SelectTrigger id="courseType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_ON_ONE">One-on-One</SelectItem>
                      <SelectItem value="GROUP">Group Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Students - only show for group classes */}
                {courseType === "GROUP" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxStudents">Maximum Students</Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      placeholder="e.g., 10"
                      value={maxStudents}
                      onChange={(e) => setMaxStudents(e.target.value)}
                      min="1"
                    />
                    <p className="text-xs text-gray-500">Leave empty for unlimited</p>
                  </div>
                )}
              </div>

              {/* Description - Full Width */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this course..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Curriculum - Full Width */}
              <div className="space-y-2">
                <Label htmlFor="curriculum">Curriculum</Label>
                <Textarea
                  id="curriculum"
                  placeholder="Outline the course curriculum, topics, and modules..."
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>

              {/* Learning Outcomes - Full Width */}
              <div className="space-y-2">
                <Label htmlFor="outcomes">Learning Outcomes</Label>
                <Textarea
                  id="outcomes"
                  placeholder="What will students be able to do after completing this course?"
                  value={outcomes}
                  onChange={(e) => setOutcomes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Link href="/tutor/courses" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? <SyncLoader size={8} color="#ffffff" /> : "Update Course"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorEditCourse;
