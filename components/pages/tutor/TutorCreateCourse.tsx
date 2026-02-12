"use client";

import { useRef, useState, startTransition } from "react";
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
import { FaBookOpen, FaArrowLeft, FaCalendarAlt, FaPlus, FaTrash } from "react-icons/fa";
import Link from "next/link";

interface SessionRow {
  start: string;
  end: string;
  title: string;
}

const TutorCreateCourse = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const router = useRouter();
  const errRef = useRef<HTMLParagraphElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [courseType, setCourseType] = useState<"ONE_ON_ONE" | "GROUP" | "BOTH">("ONE_ON_ONE");
  const [maxStudents, setMaxStudents] = useState<string>("");
  const [priceOneOnOne, setPriceOneOnOne] = useState<string>("");
  const [maxOneOnOneStudents, setMaxOneOnOneStudents] = useState<string>("");
  const [curriculum, setCurriculum] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const addSessionRow = () => setSessions((prev) => [...prev, { start: "", end: "", title: "" }]);
  const removeSessionRow = (i: number) => setSessions((prev) => prev.filter((_, idx) => idx !== i));
  const updateSessionRow = (i: number, field: keyof SessionRow, value: string) =>
    setSessions((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

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
      const courseData: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price) || 0,
        courseType,
        maxStudents: (courseType === "GROUP" || courseType === "BOTH") && maxStudents ? parseInt(maxStudents) : undefined,
        curriculum: curriculum.trim() || undefined,
        outcomes: outcomes.trim() || undefined,
      };
      if (courseType === "BOTH") {
        if (!priceOneOnOne || parseFloat(priceOneOnOne) <= 0) {
          setErrMsg("1:1 price is required when offering both group and 1:1");
          setLoading(false);
          return;
        }
        courseData.priceOneOnOne = parseFloat(priceOneOnOne);
        if (maxOneOnOneStudents) courseData.maxOneOnOneStudents = parseInt(maxOneOnOneStudents);
      }

      const response = await axiosPrivate.post("courses/create", courseData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const newCourseId = response?.data?.id;
      if (!newCourseId) throw new Error("Course created but no id returned");

      for (const row of sessions) {
        if (!row.start || !row.end) continue;
        const startDate = new Date(row.start);
        const endDate = new Date(row.end);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) continue;
        await axiosPrivate.post(
          "sessions",
          {
            courseId: newCourseId,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            title: row.title.trim() || undefined,
          },
          { withCredentials: true }
        );
      }

      Swal.fire({
        icon: "success",
        title: "Course Created",
        text: sessions.length > 0
          ? `${title} has been created with ${sessions.length} session(s). You can add more sessions when editing.`
          : `${title} has been created. Add sessions on the next page to publish.`,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#10b981",
      });

      startTransition(() => router.push(newCourseId ? `/tutor/courses/${newCourseId}/edit` : "/tutor/courses"));
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

                {/* Course Type */}
                <div className="space-y-2">
                  <Label htmlFor="courseType">Course Type</Label>
                  <Select
                    value={courseType}
                    onValueChange={(value) => setCourseType(value as "ONE_ON_ONE" | "GROUP" | "BOTH")}
                  >
                    <SelectTrigger id="courseType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_ON_ONE">One-on-One</SelectItem>
                      <SelectItem value="GROUP">Group Class</SelectItem>
                      <SelectItem value="BOTH">Both (Group &amp; 1:1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Students - for group and both */}
                {(courseType === "GROUP" || courseType === "BOTH") && (
                  <div className="space-y-2">
                    <Label htmlFor="maxStudents">Group: Max Students</Label>
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

                {/* 1:1 price & cap - only for BOTH */}
                {courseType === "BOTH" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="priceOneOnOne">1:1 Price (₦) <span className="text-red-500">*</span></Label>
                      <Input
                        id="priceOneOnOne"
                        type="number"
                        placeholder="Higher than group price"
                        value={priceOneOnOne}
                        onChange={(e) => setPriceOneOnOne(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxOneOnOneStudents">1:1: Max Students</Label>
                      <Input
                        id="maxOneOnOneStudents"
                        type="number"
                        placeholder="e.g., 3"
                        value={maxOneOnOneStudents}
                        onChange={(e) => setMaxOneOnOneStudents(e.target.value)}
                        min="1"
                      />
                    </div>
                  </>
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

              {/* Sessions (optional) */}
              <div className="space-y-3 border-t pt-6">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <FaCalendarAlt className="w-4 h-4 text-purple-600" />
                    Sessions (optional)
                  </Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSessionRow}>
                    <FaPlus className="w-3 h-3 mr-1" />
                    Add session
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Add sessions now or later from the course edit page. You need at least one session to publish.
                </p>
                {sessions.map((row, i) => (
                  <div key={i} className="flex flex-wrap items-end gap-3 p-3 bg-gray-50 rounded-lg border">
                    <div className="flex-1 min-w-[140px] space-y-1">
                      <Label className="text-xs">Start</Label>
                      <Input
                        type="datetime-local"
                        value={row.start}
                        onChange={(e) => updateSessionRow(i, "start", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 min-w-[140px] space-y-1">
                      <Label className="text-xs">End</Label>
                      <Input
                        type="datetime-local"
                        value={row.end}
                        onChange={(e) => updateSessionRow(i, "end", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 min-w-[120px] space-y-1">
                      <Label className="text-xs">Title (optional)</Label>
                      <Input
                        placeholder="e.g. Week 1"
                        value={row.title}
                        onChange={(e) => updateSessionRow(i, "title", e.target.value)}
                      />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSessionRow(i)} aria-label="Remove session">
                      <FaTrash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
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
