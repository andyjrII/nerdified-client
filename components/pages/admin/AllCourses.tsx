"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Moment from "react-moment";
import ReactPaginate from "react-paginate";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  title: string;
  price: string | number;
  updatedAt: string;
}

const AllCourses = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const coursesPerPage = 20;

  const pageCount = Math.ceil(totalCourses / coursesPerPage);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axiosPrivate.get(`courses/${currentPage}`, {
        params: {
          search: searchQuery,
        },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setCourses(response.data.courses);
      setTotalCourses(response.data.totalCourses);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [axiosPrivate, currentPage, searchQuery]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const changePage = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = async (id: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("EDIT_COURSE_ID", String(id));
    }
    router.push(`/admin/courses/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosPrivate.delete(`courses/${id}`);
      Swal.fire({
        icon: "success",
        title: "Delete Success",
        text: `${response?.data.title} deleted successfully`,
        confirmButtonText: "OK",
      });
      fetchCourses();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error deleting course!",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Courses</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search for Course..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-gray-900 text-white border-gray-700"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 text-white">
                <TableHead className="text-white">Id</TableHead>
                <TableHead className="text-white">Title</TableHead>
                <TableHead className="text-white">Price</TableHead>
                <TableHead className="text-white">Updated</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} className="bg-red-600 text-white">
                  <TableCell className="bg-black text-white font-semibold">
                    {course.id}
                  </TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell>
                    <Moment format="DD/MM/YYYY">{course.updatedAt}</Moment>
                  </TableCell>
                  <TableCell className="bg-black">
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(course.id)}
                        title="Edit Course"
                        className="text-white hover:bg-gray-800"
                      >
                        <FaEdit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(course.id)}
                        title="Delete Course"
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

export default AllCourses;
