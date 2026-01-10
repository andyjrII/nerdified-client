"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "@/lib/api/axios";
import Image from "next/image";
import Moment from "react-moment";
import ReactPaginate from "react-paginate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  datePosted: string;
  postUrl: string;
  imagePath?: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const postsPerPage = 20;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`blog/${currentPage}`, {
          params: {
            search: searchQuery,
            startDate,
            endDate,
          },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setPosts(response.data.posts);
        setTotalPosts(response.data.totalPosts);
        await fetchImages(currentPage, searchQuery, startDate, endDate);
      } catch (error) {
        console.error("Error getting posts:", error);
      }
    };
    fetchPosts();
  }, [currentPage, searchQuery, startDate, endDate]);

  const fetchImages = async (
    page: number,
    search: string,
    start: string,
    end: string
  ) => {
    try {
      const response = await axios.get(`blog/images/${page}`, {
        params: {
          search,
          startDate: start,
          endDate: end,
        },
      });
      const imageUrls = response?.data;
      const imageBlobs = await Promise.all(
        imageUrls.map(async (imageUrl: string) => {
          const imageResponse = await axios.get(`blog/image/${imageUrl}`, {
            responseType: "arraybuffer",
          });
          return new Blob([imageResponse.data], { type: "image/jpeg" });
        })
      );
      const images = imageBlobs.map((imageBlob) =>
        URL.createObjectURL(imageBlob)
      );
      setImagePaths(images);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const pageCount = Math.ceil(totalPosts / postsPerPage);

  const changePage = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.trim());
    setCurrentPage(1);
  };

  return (
    <main>
      <header className="py-6 border-b bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-2xl font-bold">
              Blog
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Blog entries */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post, index) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {imagePaths[index] && (
                    <Link href={post.postUrl}>
                      <div className="relative w-full h-48">
                        <Image
                          src={imagePaths[index]}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  )}
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      <Moment format="MMMM D, YYYY">{post.datePosted}</Moment>
                    </div>
                    <h2 className="text-xl font-bold mb-4 line-clamp-2">
                      {post.title}
                    </h2>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`https://${post.postUrl}`} target="_blank">
                        Read more →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="mt-8">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={"flex justify-center space-x-2"}
                  previousLinkClassName={"px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"}
                  nextLinkClassName={"px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"}
                  disabledClassName={"opacity-50 cursor-not-allowed"}
                  activeClassName={"bg-blue-900 text-white"}
                  pageLinkClassName={"px-4 py-2 border rounded hover:bg-gray-100"}
                  breakLabel={"..."}
                />
              </div>
            )}
          </div>

          {/* Side widgets */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  placeholder="Enter search term..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Frame</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    max={new Date().toISOString().split("T")[0]}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    min={startDate}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Blog;
