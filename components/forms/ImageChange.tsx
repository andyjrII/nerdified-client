"use client";

import { useState, useEffect } from "react";
import { FcImageFile } from "react-icons/fc";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import db from "@/utils/localBase";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const DPDefault = "/images/navpages/person_profile.jpg";

const ImageChange = () => {
  const axiosPrivate = useAxiosPrivate();
  const [fileName, setFileName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string>("");
  const [newImage, setNewImage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail();
        if (email) await fetchImage();
      } catch (error) {
        console.log("Error during initialization:", error);
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  useEffect(() => {
    if (selectedImage) {
      fetchImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when selectedImage/email change
  }, [selectedImage, email]);

  const fetchEmail = async () => {
    try {
      const data = await db.collection("auth_student").get();
      if (data.length > 0) {
        setEmail(data[0].email);
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  const fetchImage = async () => {
    try {
      const localStudent = await db.collection("student").doc(email).get();
      setImagePath(localStudent?.imagePath || "");
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setFileName(file.name);
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!selectedImage) {
      Swal.fire({
        icon: "info",
        title: "No Image Selected",
        text: "Please select an image first!",
        confirmButtonText: "OK",
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axiosPrivate.patch(
        `students/upload/${email}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Image Upload",
        text: "Image uploaded successfully!",
        confirmButtonText: "OK",
      });

      await db.collection("student").doc(email).update({
        imagePath: response.data,
      });
      setNewImage(response.data);
      setSelectedImage(null);
      setFileName("");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Something went wrong!",
        confirmButtonText: "OK",
      });
    }
    setLoading(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-center">Edit Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
          <Image
            src={newImage || imagePath || DPDefault}
            alt="Student"
            fill
            className="object-cover"
          />
        </div>
        <form onSubmit={handleImageSubmit} className="space-y-4">
          <div>
            <Input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="hidden"
            />
            <Label
              htmlFor="file-input"
              className="cursor-pointer flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FcImageFile className="w-5 h-5" />
              <span>{fileName || "Choose an image"}</span>
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800"
            disabled={loading || !selectedImage}
          >
            {loading ? <SyncLoader size={8} color="#ffffff" /> : "Upload"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImageChange;
