"use client";

import { useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
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
import { FaBookOpen, FaArrowLeft, FaCalendarAlt, FaPlus, FaTrash, FaImage } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export const DEFAULT_COURSE_IMAGE = "/images/course.jpeg";

/** Current local date-time in YYYY-MM-DDTHH:mm for datetime-local min (no past dates). */
function getMinDatetimeLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await axiosPrivate.patch(`courses/course/${newCourseId}/upload-image`, formData, {
          withCredentials: true,
        });
      }

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
    <div className="min-h-screen bg-slate-100/80 dark:bg-slate-900/50">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/tutor/courses"
            className="inline-flex items-center text-white/90 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Create a new course</h1>
          <p className="mt-2 text-purple-100 text-lg max-w-xl">
            Set up your course details, pricing, and optional sessions. You can add or change sessions anytime from the course edit page.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 -mt-2 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <p
            ref={errRef}
            className={`text-center text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3 ${errMsg ? "block" : "hidden"}`}
            aria-live="assertive"
          >
            {errMsg}
          </p>

          {/* Section: Cover & basics */}
          <Card className="shadow-md border-0 bg-white dark:bg-slate-800/80 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-500/10 dark:to-indigo-500/10 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FaBookOpen className="w-5 h-5 text-purple-600" />
                Cover & basics
              </CardTitle>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Course image */}
              <div className="space-y-3">
                <Label className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                  <FaImage className="w-4 h-4 text-purple-500" />
                  Course image
                </Label>
                <div className="flex flex-wrap items-start gap-6">
                  <label className="cursor-pointer group">
                    <div className="relative w-40 h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover:border-purple-400 dark:group-hover:border-purple-500 overflow-hidden transition-colors bg-slate-50 dark:bg-slate-700/50">
                      {imagePreview ? (
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                      ) : (
                        <Image src={DEFAULT_COURSE_IMAGE} alt="Default" fill className="object-cover" unoptimized />
                      )}
                    </div>
                    <Input
                      id="course-image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        } else {
                          setImageFile(null);
                          setImagePreview(null);
                        }
                      }}
                    />
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Click to change</p>
                  </label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                    Shown on the course card. Default image is used if you don’t upload one.
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
                    required
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

          {/* Section: Content */}
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

          {/* Section: Sessions */}
          <Card className="shadow-md border-0 bg-white dark:bg-slate-800/80 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-500/10 dark:to-indigo-500/10 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-indigo-600" />
                Sessions
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addSessionRow} className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-900/30">
                <FaPlus className="w-3 h-3 mr-2" />
                Add session
              </Button>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Optional: add sessions now or from the course edit page later. You’ll need at least one session to publish.
              </p>
              {sessions.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/30 p-8 text-center">
                  <FaCalendarAlt className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                  <p className="text-slate-600 dark:text-slate-400 text-sm">No sessions added yet</p>
                  <Button type="button" variant="outline" size="sm" onClick={addSessionRow} className="mt-3">
                    Add your first session
                  </Button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {sessions.map((row, i) => (
                    <li
                      key={i}
                      className="flex flex-wrap items-end gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600"
                    >
                      <div className="flex-1 min-w-[140px] space-y-1">
                        <Label className="text-xs text-slate-500">Start</Label>
                        <Input
                          type="datetime-local"
                          min={getMinDatetimeLocal()}
                          value={row.start}
                          onChange={(e) => updateSessionRow(i, "start", e.target.value)}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                        />
                      </div>
                      <div className="flex-1 min-w-[140px] space-y-1">
                        <Label className="text-xs text-slate-500">End</Label>
                        <Input
                          type="datetime-local"
                          min={row.start || getMinDatetimeLocal()}
                          value={row.end}
                          onChange={(e) => updateSessionRow(i, "end", e.target.value)}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                        />
                      </div>
                      <div className="flex-1 min-w-[120px] space-y-1">
                        <Label className="text-xs text-slate-500">Title (optional)</Label>
                        <Input
                          placeholder="e.g. Week 1"
                          value={row.title}
                          onChange={(e) => updateSessionRow(i, "title", e.target.value)}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSessionRow(i)}
                        aria-label="Remove session"
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
            <Link href="/tutor/courses" className="sm:w-auto w-full">
              <Button type="button" variant="outline" className="w-full sm:min-w-[120px] border-slate-300 dark:border-slate-600">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full sm:w-auto sm:min-w-[180px] bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
              disabled={loading || !title.trim()}
            >
              {loading ? (
                <SyncLoader size={8} color="#ffffff" />
              ) : (
                "Create course"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorCreateCourse;
