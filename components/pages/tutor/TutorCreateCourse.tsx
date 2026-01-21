"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
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

const TutorCreateCourse = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const router = useRouter();
  const errRef = useRef<HTMLParagraphElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [pricingModel, setPricingModel] = useState<"PER_COURSE" | "PER_SESSION">("PER_COURSE");
  const [courseType, setCourseType] = useState<"ONE_ON_ONE" | "GROUP_CLASS">("ONE_ON_ONE");
  const [maxStudents, setMaxStudents] = useState<string>("");
  const [curriculum, setCurriculum] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!title.trim()) {
      setErrMsg("Course title is required");
      errRef.current?.focus();
      setLoading(false);
      return;
    }

    try {
      const courseData = {
        title: title.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price) || 0,
        pricingModel,
        courseType,
        maxStudents: courseType === "GROUP_CLASS" && maxStudents ? parseInt(maxStudents) : undefined,
        curriculum: curriculum.trim() || undefined,
        outcomes: outcomes.trim() || undefined,
      };

      const response = await axiosPrivate.post("courses/create", courseData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Course Created",
        text: `${title} has been created successfully!`,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#10b981",
      });

      router.push("/tutor/courses");
    } catch (err: any) {
      console.error("Course creation error:", err);
      let errorMessage = "Course creation failed";

      if (!err?.response) {
        errorMessage = "No Server Response - Check your connection";
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || "Invalid request data";
      } else if (err.response?.status === 409) {
        errorMessage = "A course with this title already exists";
      } else {
        errorMessage = err.response?.data?.message || "Course creation failed";
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/tutor/courses">
            <Button variant="ghost" size="sm">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
            <p className="text-gray-600 mt-1">Fill in the details to create your course</p>
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
                  <Label htmlFor="title">
                    Course Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Introduction to Web Development"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price (₦) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
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
                    onValueChange={(value) => setCourseType(value as "ONE_ON_ONE" | "GROUP_CLASS")}
                  >
                    <SelectTrigger id="courseType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_ON_ONE">One-on-One</SelectItem>
                      <SelectItem value="GROUP_CLASS">Group Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Students - only show for group classes */}
                {courseType === "GROUP_CLASS" && (
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
                <Label htmlFor="description">Description (Optional)</Label>
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
                <Label htmlFor="curriculum">Curriculum (Optional)</Label>
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
                <Label htmlFor="outcomes">Learning Outcomes (Optional)</Label>
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
                  disabled={loading || !title.trim()}
                >
                  {loading ? (
                    <SyncLoader size={8} color="#ffffff" />
                  ) : (
                    "Create Course"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorCreateCourse;
