"use client";

import { useRef, useState, useEffect, startTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
import { FaBookOpen, FaArrowLeft, FaCalendarAlt, FaPlus, FaEdit, FaCopy, FaImage } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_COURSE_IMAGE } from "./TutorCreateCourse";
import { Badge } from "@/components/ui/badge";

/** Current local date-time in YYYY-MM-DDTHH:mm for datetime-local min (no past dates). */
function getMinDatetimeLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Moment from "react-moment";

interface SessionStub {
  id: number;
  title: string | null;
  startTime: string;
  endTime: string;
  status: string;
}

interface Course {
  id: number;
  title: string;
  description?: string;
  imagePath?: string | null;
  price: number;
  priceOneOnOne?: number;
  courseType: string;
  maxStudents?: number;
  maxOneOnOneStudents?: number;
  curriculum?: string;
  outcomes?: string;
  status?: "DRAFT" | "PUBLISHED";
  sessions?: SessionStub[];
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
  const [courseType, setCourseType] = useState<"ONE_ON_ONE" | "GROUP" | "BOTH">("ONE_ON_ONE");
  const [maxStudents, setMaxStudents] = useState<string>("");
  const [priceOneOnOne, setPriceOneOnOne] = useState<string>("");
  const [maxOneOnOneStudents, setMaxOneOnOneStudents] = useState<string>("");
  const [curriculum, setCurriculum] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [rescheduleModal, setRescheduleModal] = useState<{ sessionId: number; title: string } | null>(null);
  const [addSessionModal, setAddSessionModal] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rescheduleStart, setRescheduleStart] = useState("");
  const [rescheduleEnd, setRescheduleEnd] = useState("");
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);
  const [addSessionTitle, setAddSessionTitle] = useState("");
  const [addSessionDesc, setAddSessionDesc] = useState("");
  const [addSessionStart, setAddSessionStart] = useState("");
  const [addSessionEnd, setAddSessionEnd] = useState("");
  const [addSessionReason, setAddSessionReason] = useState("");
  const [addSessionSubmitting, setAddSessionSubmitting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
      const response = await axiosPrivate.get(`courses/course/${courseId}/tutor`, {
        withCredentials: true,
      });
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
      // Pricing is always per course (per-session option removed)
      setCourseType(courseData.courseType || "ONE_ON_ONE");
      setMaxStudents(courseData.maxStudents ? String(courseData.maxStudents) : "");
      setPriceOneOnOne(courseData.priceOneOnOne != null ? String(courseData.priceOneOnOne) : "");
      setMaxOneOnOneStudents(courseData.maxOneOnOneStudents != null ? String(courseData.maxOneOnOneStudents) : "");
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
    if (courseType === "BOTH" && (!priceOneOnOne || parseFloat(priceOneOnOne) <= 0)) {
      setErrMsg("1:1 price is required when offering both group and 1:1");
      setLoading(false);
      return;
    }

    try {
      const courseData: any = {};
      if (title.trim()) courseData.title = title.trim();
      if (description.trim()) courseData.description = description.trim();
      if (price) courseData.price = parseFloat(price);
      if (courseType) courseData.courseType = courseType;
      if ((courseType === "GROUP" || courseType === "BOTH") && maxStudents) {
        courseData.maxStudents = parseInt(maxStudents);
      } else if (courseType === "ONE_ON_ONE") {
        courseData.maxStudents = undefined;
      }
      if (courseType === "BOTH" && priceOneOnOne) {
        courseData.priceOneOnOne = parseFloat(priceOneOnOne);
      }
      if (courseType === "BOTH" && maxOneOnOneStudents) {
        courseData.maxOneOnOneStudents = parseInt(maxOneOnOneStudents);
      } else if (courseType !== "BOTH") {
        courseData.maxOneOnOneStudents = undefined;
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

  const handlePublish = async () => {
    if (!courseId || !course) return;
    const sessionCount = course.sessions?.length ?? 0;
    if (sessionCount < 1) {
      Swal.fire({
        icon: "warning",
        title: "Add sessions first",
        text: "Add at least one session before publishing.",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#f59e0b",
      });
      return;
    }
    setPublishing(true);
    try {
      await axiosPrivate.post(`courses/${courseId}/publish`, {}, { withCredentials: true });
      Swal.fire({
        icon: "success",
        title: "Course Published",
        text: "Your course is now live and visible to students.",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#10b981",
      });
      fetchCourse();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to publish course.";
      Swal.fire({ icon: "error", title: "Publish Failed", text: msg, confirmButtonColor: "#ef4444" });
    } finally {
      setPublishing(false);
    }
  };

  const submitRescheduleRequest = async () => {
    if (!rescheduleModal || rescheduleReason.trim().length < 10) {
      Swal.fire({ icon: "warning", title: "Reason required", text: "Please provide a reason (at least 10 characters).", confirmButtonColor: "#f59e0b" });
      return;
    }
    if (!rescheduleStart || !rescheduleEnd) {
      Swal.fire({ icon: "warning", title: "Dates required", text: "Please set requested start and end date/time.", confirmButtonColor: "#f59e0b" });
      return;
    }
    setRescheduleSubmitting(true);
    try {
      await axiosPrivate.post(
        "sessions/reschedule-requests",
        {
          sessionId: rescheduleModal.sessionId,
          requestedStartTime: new Date(rescheduleStart).toISOString(),
          requestedEndTime: new Date(rescheduleEnd).toISOString(),
          reason: rescheduleReason.trim(),
        },
        { withCredentials: true }
      );
      Swal.fire({ icon: "success", title: "Request submitted", text: "Admin will review your reschedule request.", confirmButtonColor: "#10b981" });
      setRescheduleModal(null);
      setRescheduleReason("");
      setRescheduleStart("");
      setRescheduleEnd("");
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Could not submit request.", confirmButtonColor: "#ef4444" });
    } finally {
      setRescheduleSubmitting(false);
    }
  };

  const submitAddSession = async () => {
    if (!courseId || !addSessionStart || !addSessionEnd) {
      Swal.fire({ icon: "warning", title: "Dates required", text: "Please set start and end date/time.", confirmButtonColor: "#f59e0b" });
      return;
    }
    const start = new Date(addSessionStart);
    const end = new Date(addSessionEnd);
    if (end <= start) {
      Swal.fire({ icon: "warning", title: "Invalid times", text: "End must be after start.", confirmButtonColor: "#f59e0b" });
      return;
    }
    setAddSessionSubmitting(true);
    try {
      await axiosPrivate.post(
        "sessions",
        {
          courseId,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          title: addSessionTitle.trim() || undefined,
          description: addSessionDesc.trim() || undefined,
        },
        { withCredentials: true }
      );
      Swal.fire({ icon: "success", title: "Session added", text: "The session has been added to this course.", confirmButtonColor: "#10b981" });
      setAddSessionModal(false);
      setAddSessionTitle("");
      setAddSessionDesc("");
      setAddSessionStart("");
      setAddSessionEnd("");
      setAddSessionReason("");
      fetchCourse();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Could not add session.", confirmButtonColor: "#ef4444" });
    } finally {
      setAddSessionSubmitting(false);
    }
  };

  const handleCourseImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !courseId) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axiosPrivate.patch(
        `courses/course/${courseId}/upload-image`,
        formData,
        { withCredentials: true }
      );
      const newPath = response?.data?.imagePath;
      if (newPath && course) setCourse({ ...course, imagePath: newPath });
      Swal.fire({ icon: "success", title: "Image updated", confirmButtonColor: "#10b981" });
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Upload failed", text: err.response?.data?.message || "Could not upload image.", confirmButtonColor: "#ef4444" });
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleDuplicateCourse = async () => {
    if (!courseId) return;
    setDuplicating(true);
    try {
      const response = await axiosPrivate.post(`courses/duplicate/${courseId}`, {}, { withCredentials: true });
      const newCourse = response?.data;
      const newId = newCourse?.id;
      if (newId) {
        Swal.fire({ icon: "success", title: "Course duplicated", text: "You can edit the copy below.", confirmButtonColor: "#10b981" });
        router.push(`/tutor/courses/${newId}/edit`);
      } else {
        Swal.fire({ icon: "error", title: "Failed", text: "Could not duplicate course.", confirmButtonColor: "#ef4444" });
      }
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Could not duplicate course.", confirmButtonColor: "#ef4444" });
    } finally {
      setDuplicating(false);
    }
  };

  const isDraft = course?.status === "DRAFT";
  const sessionCount = course?.sessions?.length ?? 0;

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-100/80 px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100/80 dark:bg-slate-900/50">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href="/tutor/courses"
                className="inline-flex items-center text-white/90 hover:text-white text-sm font-medium mb-4 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Edit course</h1>
              <p className="mt-2 text-purple-100 text-lg max-w-xl">
                Update your course details, pricing, and sessions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDuplicateCourse}
                disabled={duplicating}
                className="border-white/50 text-white hover:bg-white/10 bg-white/5"
              >
                <FaCopy className="w-3 h-3 mr-1" />
                {duplicating ? "Duplicating…" : "Duplicate course"}
              </Button>
              <Badge className={isDraft ? "bg-amber-400/90 text-white border-0" : "bg-green-400/90 text-white border-0"}>
                {isDraft ? "Draft" : "Published"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 -mt-2 relative z-10 space-y-8">
        <p
          ref={errRef}
          className={`text-center text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3 ${errMsg ? "block" : "hidden"}`}
          aria-live="assertive"
        >
          {errMsg}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Cover & basics */}
          <Card className="shadow-md border-0 bg-white dark:bg-slate-800/80 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-500/10 dark:to-indigo-500/10 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FaBookOpen className="w-5 h-5 text-purple-600" />
                Cover & basics
              </CardTitle>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                  <FaImage className="w-4 h-4 text-purple-500" />
                  Course image
                </Label>
                <div className="flex flex-wrap items-start gap-6">
                  <label className="cursor-pointer group">
                    <div className="relative w-40 h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover:border-purple-400 overflow-hidden transition-colors bg-slate-50 dark:bg-slate-700/50">
                      <Image
                        src={course?.imagePath || DEFAULT_COURSE_IMAGE}
                        alt="Course"
                        fill
                        className="object-cover"
                        unoptimized={!!course?.imagePath}
                      />
                    </div>
                    <Input
                      id="edit-course-image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploadingImage}
                      onChange={handleCourseImageChange}
                    />
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      {uploadingImage ? "Uploading…" : "Click to replace"}
                    </p>
                  </label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                    {uploadingImage ? "Uploading…" : "Upload a new image to replace. Old image is removed from Cloudinary."}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700 dark:text-slate-300 font-medium">
                  Course title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Introduction to Web Development"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 font-medium">
                  Short description
                </Label>
                <Textarea
                  id="description"
                  placeholder="What will students learn? Who is this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section: Pricing & format */}
          <Card className="shadow-md border-0 bg-white dark:bg-slate-800/80 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 dark:from-emerald-500/10 dark:to-teal-500/10 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Pricing & format
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-700 dark:text-slate-300 font-medium">
                    Price (₦) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseType" className="text-slate-700 dark:text-slate-300 font-medium">
                    Course type
                  </Label>
                  <Select
                    value={courseType}
                    onValueChange={(value) => setCourseType(value as "ONE_ON_ONE" | "GROUP" | "BOTH")}
                  >
                    <SelectTrigger id="courseType" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_ON_ONE">One-on-One</SelectItem>
                      <SelectItem value="GROUP">Group Class</SelectItem>
                      <SelectItem value="BOTH">Both (Group & 1:1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(courseType === "GROUP" || courseType === "BOTH") && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="maxStudents" className="text-slate-700 dark:text-slate-300 font-medium">
                      Group: max students
                    </Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      placeholder="e.g., 10 (leave empty for unlimited)"
                      value={maxStudents}
                      onChange={(e) => setMaxStudents(e.target.value)}
                      min="1"
                      className="max-w-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                    />
                  </div>
                )}
                {courseType === "BOTH" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="priceOneOnOne" className="text-slate-700 dark:text-slate-300 font-medium">
                        1:1 price (₦) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="priceOneOnOne"
                        type="number"
                        placeholder="Higher than group"
                        value={priceOneOnOne}
                        onChange={(e) => setPriceOneOnOne(e.target.value)}
                        min="0"
                        step="0.01"
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxOneOnOneStudents" className="text-slate-700 dark:text-slate-300 font-medium">
                        1:1: max students
                      </Label>
                      <Input
                        id="maxOneOnOneStudents"
                        type="number"
                        placeholder="e.g., 3"
                        value={maxOneOnOneStudents}
                        onChange={(e) => setMaxOneOnOneStudents(e.target.value)}
                        min="1"
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section: Curriculum & outcomes */}
          <Card className="shadow-md border-0 bg-white dark:bg-slate-800/80 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 dark:from-amber-500/10 dark:to-orange-500/10 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Curriculum & outcomes
              </CardTitle>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="curriculum" className="text-slate-700 dark:text-slate-300 font-medium">
                  Curriculum outline
                </Label>
                <Textarea
                  id="curriculum"
                  placeholder="Topics, modules, and what you’ll cover..."
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  rows={4}
                  className="resize-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcomes" className="text-slate-700 dark:text-slate-300 font-medium">
                  Learning outcomes
                </Label>
                <Textarea
                  id="outcomes"
                  placeholder="What will students be able to do after this course?"
                  value={outcomes}
                  onChange={(e) => setOutcomes(e.target.value)}
                  rows={3}
                  className="resize-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Form actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
            <Link href="/tutor/courses" className="sm:w-auto w-full">
              <Button type="button" variant="outline" className="w-full sm:min-w-[120px] border-slate-300 dark:border-slate-600">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full sm:w-auto sm:min-w-[180px] bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
              disabled={loading}
            >
              {loading ? <SyncLoader size={8} color="#ffffff" /> : "Update course"}
            </Button>
          </div>
        </form>

        {/* Sessions */}
        <Card className="shadow-md border-0 bg-white dark:bg-slate-800/80 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-500/10 dark:to-indigo-500/10 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FaCalendarAlt className="w-5 h-5 text-indigo-600" />
              Sessions
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setAddSessionModal(true)} className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-900/30">
              <FaPlus className="w-3 h-3 mr-2" />
              Add session
            </Button>
          </div>
          <CardContent className="p-6 space-y-4">
            {course.sessions && course.sessions.length > 0 ? (
              <ul className="space-y-2">
                {course.sessions.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600"
                  >
                    <span className="font-medium min-w-0">{s.title || "Session"}</span>
                    <span className="text-sm text-slate-500 shrink-0">
                      <Moment format="MMM D, YYYY • h:mm A">{s.startTime}</Moment>
                      {" → "}
                      <Moment format="h:mm A">{s.endTime}</Moment>
                    </span>
                    {!isDraft && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto shrink-0"
                        onClick={() => setRescheduleModal({ sessionId: s.id, title: s.title || "Session" })}
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Request reschedule
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No sessions yet. Add one to publish.</p>
            )}
            {isDraft && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button
                  onClick={handlePublish}
                  disabled={publishing || sessionCount < 1}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {publishing ? "Publishing…" : "Publish course"}
                </Button>
                {sessionCount < 1 && (
                  <span className="text-sm text-amber-600 dark:text-amber-400">Add at least one session to publish.</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reschedule request modal */}
        <Dialog open={!!rescheduleModal} onOpenChange={(open) => !open && setRescheduleModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request reschedule: {rescheduleModal?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>New start (date & time)</Label>
                <Input
                  type="datetime-local"
                  min={getMinDatetimeLocal()}
                  value={rescheduleStart}
                  onChange={(e) => setRescheduleStart(e.target.value)}
                />
              </div>
              <div>
                <Label>New end (date & time)</Label>
                <Input
                  type="datetime-local"
                  min={rescheduleStart || getMinDatetimeLocal()}
                  value={rescheduleEnd}
                  onChange={(e) => setRescheduleEnd(e.target.value)}
                />
              </div>
              <div>
                <Label>Reason (min 10 characters)</Label>
                <Textarea
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Why do you need to reschedule?"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRescheduleModal(null)}>Cancel</Button>
              <Button onClick={submitRescheduleRequest} disabled={rescheduleSubmitting}>
                {rescheduleSubmitting ? "Submitting…" : "Submit request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add session modal */}
        <Dialog open={addSessionModal} onOpenChange={setAddSessionModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Title (optional)</Label>
                <Input value={addSessionTitle} onChange={(e) => setAddSessionTitle(e.target.value)} placeholder="Session title" />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea value={addSessionDesc} onChange={(e) => setAddSessionDesc(e.target.value)} placeholder="Brief description" rows={2} />
              </div>
              <div>
                <Label>Start (date & time)</Label>
                <Input
                  type="datetime-local"
                  min={getMinDatetimeLocal()}
                  value={addSessionStart}
                  onChange={(e) => setAddSessionStart(e.target.value)}
                />
              </div>
              <div>
                <Label>End (date & time)</Label>
                <Input
                  type="datetime-local"
                  min={addSessionStart || getMinDatetimeLocal()}
                  value={addSessionEnd}
                  onChange={(e) => setAddSessionEnd(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddSessionModal(false)}>Cancel</Button>
              <Button onClick={submitAddSession} disabled={addSessionSubmitting}>
                {addSessionSubmitting ? "Adding…" : "Add session"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TutorEditCourse;
