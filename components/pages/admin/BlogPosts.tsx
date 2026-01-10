"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import ReactPaginate from "react-paginate";
import Moment from "react-moment";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  postUrl: string;
  datePosted: string;
}

const BlogPosts = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const router = useRouter();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const postsPerPage = 20;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosPrivate.get(`admin/blogs/${currentPage}`, {
          params: {
            search: searchQuery,
            startDate,
            endDate,
          },
        });
        setPosts(response.data.posts);
        setTotalPosts(response.data.totalPosts);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPosts();
  }, [currentPage, searchQuery, startDate, endDate, axiosPrivate]);

  const pageCount = Math.ceil(totalPosts / postsPerPage);

  const changePage = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleEdit = async (id: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("EDIT_POST_ID", String(id));
    }
    router.push(`/admin/posts/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosPrivate.delete(`blog/${id}`);
      Swal.fire({
        icon: "success",
        title: "Post Deleted",
        text: `${response.data.title} deleted successfully`,
        confirmButtonText: "OK",
      });
      const newResponse = await axiosPrivate.get(`admin/blogs/${currentPage}`, {
        params: { search: searchQuery, startDate, endDate },
      });
      setPosts(newResponse.data.posts);
      setTotalPosts(newResponse.data.totalPosts);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Delete Failed!",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Blog Posts</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search for Post..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-900 text-white border-gray-700 mt-1"
              />
            </div>
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
                className="bg-gray-900 text-white border-gray-700 mt-1"
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
                className="bg-gray-900 text-white border-gray-700 mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 text-white">
                <TableHead className="text-white">Id</TableHead>
                <TableHead className="text-white">Title</TableHead>
                <TableHead className="text-white">Post Url</TableHead>
                <TableHead className="text-white">Post Date</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} className="bg-red-600 text-white">
                  <TableCell className="bg-black text-white font-semibold">
                    {post.id}
                  </TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.postUrl}</TableCell>
                  <TableCell>
                    <Moment format="DD/MM/YYYY">{post.datePosted}</Moment>
                  </TableCell>
                  <TableCell className="bg-black">
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(post.id)}
                        title="Edit Blog Post"
                        className="text-white hover:bg-gray-800"
                      >
                        <FaEdit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                        title="Delete Blog Post"
                        className="text-red-400 hover:bg-gray-800 hover:text-red-600"
                      >
                        <FaTrashAlt className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pageCount > 1 && (
            <div className="mt-6">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPosts;
