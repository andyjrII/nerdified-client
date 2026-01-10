"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: string;
  postUrl: string;
  datePosted: string;
  imagePath?: string;
}

const UpdatePost = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const errRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  const [postId, setPostId] = useState<string | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState<string>("");
  const [datePosted, setDatePosted] = useState<string>("");
  const [postUrl, setPostUrl] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("EDIT_POST_ID");
      setPostId(storedId);
    }
  }, []);

  useEffect(() => {
    if (postId) {
      getPost();
    }
  }, [postId]);

  useEffect(() => {
    setErrMsg("");
  }, [title, datePosted, postUrl, selectedImage, postId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setFileName(file.name);
    }
  };

  const getPost = async () => {
    if (!postId) return;
    try {
      const response = await axios.get(`blog/post/${postId}`);
      if (!response.data) {
        alert("Post does not exist");
        return;
      }
      setPost(response.data);
      setTitle(response.data.title || "");
      setPostUrl(response.data.postUrl || "");
      setDatePosted(
        response.data.datePosted
          ? new Date(response.data.datePosted).toISOString().split("T")[0]
          : ""
      );
    } catch (err) {
      setErrMsg("Post does not exist");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;

    try {
      const response = await axiosPrivate.patch(
        `blog/update/${postId}`,
        JSON.stringify({ title, datePosted, postUrl }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (selectedImage) {
        await imageUpload(response?.data.id);
      }

      setPost(response?.data);
      Swal.fire({
        icon: "success",
        title: "Update Success",
        text: `${post?.title || title} updated successfully`,
        confirmButtonText: "OK",
      });
      router.push(`/admin/posts`);
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Post with title already exists");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else if (err.response?.status === 500) {
        setErrMsg("Server error");
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
  };

  const imageUpload = async (id: number) => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      await axios.patch(`blog/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    } catch (err: any) {
      setErrMsg("Image upload Failed");
      errRef.current?.focus();
    }
  };

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Update Post</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Update Blog Post</CardTitle>
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
                placeholder={post.title}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postUrl">Post URL</Label>
              <Input
                id="postUrl"
                type="text"
                placeholder={post.postUrl}
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
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
                max={new Date().toISOString().split("T")[0]}
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Post Image (Optional)</Label>
              {post.imagePath && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300 mb-2">
                  <Image
                    src={post.imagePath}
                    alt="Current post image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
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
                  {fileName || "Choose a new image (optional)"}
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
                Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePost;
