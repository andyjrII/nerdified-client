"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import axios from "@/lib/api/axios";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  title: string;
  price: string | number;
  details?: string;
}

const UpdateCourse = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const router = useRouter();
  const errRef = useRef<HTMLParagraphElement>(null);

  const [courseId, setCourseId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("EDIT_COURSE_ID");
      setCourseId(storedId);
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      getCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getCourse when courseId changes
  }, [courseId]);

  useEffect(() => {
    setErrMsg("");
  }, [title, price, courseId, selectedFile]);

  const getCourse = async () => {
    if (!courseId) return;
    try {
      const response = await axios.get(`courses/course/${courseId}`);
      if (!response.data) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Course does not exist!",
          confirmButtonText: "OK",
        });
        return;
      }
      setCourse(response.data);
      setPrice(String(response.data.price || ""));
    } catch (err) {
      setErrMsg("Error Occurred!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
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
      const formData = new FormData();
      if (title) formData.append("title", title);
      if (price) formData.append("price", price);
      if (selectedFile) formData.append("pdf", selectedFile);

      const response = await axiosPrivate.patch(
        `courses/update/${courseId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setCourse(response?.data);

      Swal.fire({
        icon: "success",
        title: "Update Success",
        text: `${course?.title || title} updated successfully`,
        confirmButtonText: "OK",
      });
      router.push(`/admin/courses`);
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Bad request.");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Update Failed");
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errMsg || "Update Failed!",
        confirmButtonText: "OK",
      });
      errRef.current?.focus();
    }
    setLoading(false);
  };

  const getFileNameFromUrl = (url: string | undefined): string => {
    if (!url) return "";
    const segments = url.split("/");
    return segments.pop() || "";
  };

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading course...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Update Course</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Update Course</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            ref={errRef}
            className={`text-center text-sm text-red-600 mb-4 ${
              errMsg ? "block" : "hidden"
            }`}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                type="text"
                placeholder={course.title}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">₦</span>
                <Input
                  id="price"
                  type="number"
                  placeholder={String(course.price || "")}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="bg-gray-900 text-white border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf">Course Details (PDF)</Label>
              <div className="relative">
                <Input
                  type="file"
                  id="pdf"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="pdf"
                  className="cursor-pointer flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
                >
                  {fileName || "Choose a new PDF file (optional)"}
                </Label>
              </div>
              <small className="text-gray-600">
                <b>Current File: </b>
                {course.details
                  ? getFileNameFromUrl(course.details)
                  : "No file available"}
              </small>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white w-full md:w-1/3"
                size="lg"
                disabled={loading}
              >
                {loading ? <SyncLoader size={8} color="#ffffff" /> : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateCourse;
