"use client";

import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Moment from "react-moment";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import ReactPaginate from "react-paginate";
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

interface Student {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
}

const AllStudents = () => {
  const axios = useAdminAxiosPrivate();
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const studentsPerPage = 20;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`students/search/${currentPage}`, {
          params: {
            search: searchQuery,
          },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setStudents(response.data.students);
        setTotalStudents(response.data.totalStudents);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchStudents();
  }, [currentPage, searchQuery, axios]);

  const pageCount = Math.ceil(totalStudents / studentsPerPage);

  const changePage = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`students/${id}`);
      Swal.fire({
        icon: "success",
        title: "Delete Success",
        text: `${response?.data.name} deleted successfully`,
        confirmButtonText: "OK",
      });
      setCurrentPage(1);
      const newResponse = await axios.get(`students/search/${currentPage}`, {
        params: { search: searchQuery },
      });
      setStudents(newResponse.data.students);
      setTotalStudents(newResponse.data.totalStudents);
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
        <h1 className="text-3xl font-bold text-center">Students</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search for student..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-gray-900 text-white border-gray-700"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 text-white">
                <TableHead className="text-white">Id</TableHead>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Phone Number</TableHead>
                <TableHead className="text-white">Address</TableHead>
                <TableHead className="text-white">Joined Date</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="bg-red-600 text-white">
                  <TableCell className="bg-black text-white font-semibold">
                    {student.id}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phoneNumber}</TableCell>
                  <TableCell>{student.address}</TableCell>
                  <TableCell>
                    <Moment format="DD/MM/YYYY">{student.createdAt}</Moment>
                  </TableCell>
                  <TableCell className="bg-black">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(student.id)}
                      title="Delete Student"
                      className="text-red-400 hover:bg-gray-800 hover:text-red-600"
                    >
                      <FaTrashAlt className="h-5 w-5" />
                    </Button>
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

export default AllStudents;
