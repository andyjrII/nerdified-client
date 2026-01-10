"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const NewCourse = () => {
  const errRef = useRef<HTMLParagraphElement>(null);
  const axiosPrivate = useAdminAxiosPrivate();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErrMsg("");
  }, [title, price, selectedFile]);

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

    if (!selectedFile) {
      setErrMsg("Please select a PDF file");
      errRef.current?.focus();
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("pdf", selectedFile);

      await axiosPrivate.post("courses/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Course Created",
        text: `${title} created successfully`,
        confirmButtonText: "OK",
      });

      setTitle("");
      setPrice("0");
      setSelectedFile(null);
      setFileName("");
      router.push("/admin/courses");
    } catch (err: any) {
      if (err.response?.status === 400) {
        setErrMsg("Check file & reupload.");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else if (err.response?.status === 409) {
        setErrMsg("Course with title already exists!");
      } else {
        setErrMsg("Creation Failed");
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errMsg || "Creation Failed!",
        confirmButtonText: "OK",
      });
      errRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">New Course</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
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
                placeholder="Course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
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
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="bg-gray-900 text-white border-gray-700"
                />
                <span className="text-lg font-semibold">.00</span>
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
                  required
                  className="hidden"
                />
                <Label
                  htmlFor="pdf"
                  className="cursor-pointer flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
                >
                  {fileName || "Choose a PDF file"}
                </Label>
              </div>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white w-full md:w-1/3"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <SyncLoader size={8} color="#ffffff" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCourse;
