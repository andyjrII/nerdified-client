"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import Link from "next/link";
import Image from "next/image";
import Moment from "react-moment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Blog {
  id: number;
  title: string;
  datePosted: string;
  postUrl: string;
  imagePath?: string;
}

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const response = await axios.get("blog/posts/latest");
        // Ensure we always have an array
        const blogsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.blogs || response.data?.posts || []);
        setBlogs(blogsData);
        if (blogsData.length > 0) {
          await fetchImages();
        }
      } catch (error) {
        console.error("Error fetching latest blogs:", error);
        setBlogs([]); // Ensure blogs is always an array
      }
    };

    fetchLatestBlogs();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("blog/posts/latest/images");
      // Ensure we always have an array
      const imageUrls = Array.isArray(response?.data) 
        ? response.data 
        : (response?.data?.images || response?.data?.urls || []);
      
      if (!imageUrls || imageUrls.length === 0) {
        setImagePaths([]);
        return;
      }

      const imageBlobs = await Promise.all(
        imageUrls.map(async (imageUrl: string) => {
          try {
            const imageResponse = await axios.get(`blog/image/${imageUrl}`, {
              responseType: "arraybuffer",
            });
            return new Blob([imageResponse.data], { type: "image/jpeg" });
          } catch (err) {
            console.error(`Error fetching image ${imageUrl}:`, err);
            return null;
          }
        })
      );
      const images = imageBlobs
        .filter((blob): blob is Blob => blob !== null)
        .map((imageBlob) => URL.createObjectURL(imageBlob));
      setImagePaths(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImagePaths([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs && Array.isArray(blogs) && blogs.length > 0 ? (
          blogs.map((blog, index) => (
          <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {imagePaths[index] && (
              <div className="relative w-full h-48">
                <Image
                  src={imagePaths[index]}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
              <CardDescription>
                Posted on:{" "}
                <Moment format="MMMM D, YYYY">{blog.datePosted}</Moment>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={blog.postUrl}>Read More</Link>
              </Button>
            </CardContent>
          </Card>
        ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No blog posts available
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestBlogs;
