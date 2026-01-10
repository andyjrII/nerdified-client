"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const NewPost = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const router = useRouter();
  const errRef = useRef<HTMLParagraphElement>(null);

  const [title, setTitle] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [title, datePosted, postUrl, selectedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(
        "blog/create",
        JSON.stringify({ title, datePosted, postUrl }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (selectedImage) {
        await imageUpload(response?.data.id);
      }

      Swal.fire({
        icon: "success",
        title: "Post Created",
        text: `${title} created successfully`,
        confirmButtonText: "OK",
      });

      setTitle("");
      setPostUrl("");
      setDatePosted("");
      setSelectedImage(null);
      setFileName("");
      router.push("/admin/posts");
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Credentials");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Post Creation Failed");
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errMsg || "Creation Failed!",
        confirmButtonText: "OK",
      });
      errRef.current?.focus();
    }
  };

  const imageUpload = async (id: number) => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      await axiosPrivate.patch(`blog/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    } catch (err: any) {
      setErrMsg("Image upload Failed");
      errRef.current?.focus();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">New Post</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postUrl">Post URL</Label>
              <Input
                id="postUrl"
                type="text"
                placeholder="Post URL"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                required
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="datePosted">Date Posted</Label>
              <Input
                id="datePosted"
                type="date"
                value={datePosted}
                onChange={(e) => setDatePosted(e.target.value)}
                required
                max={new Date().toISOString().split("T")[0]}
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Post Image (Optional)</Label>
              <div className="relative">
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label
                  htmlFor="image"
                  className="cursor-pointer flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
                >
                  {fileName || "Choose an image (optional)"}
                </Label>
              </div>
              {selectedImage && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300 mt-2">
                  <Image
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white w-full md:w-1/3"
                size="lg"
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPost;
