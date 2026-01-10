"use client";

import { useState, useEffect } from "react";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import ReactPaginate from "react-paginate";
import Moment from "react-moment";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

interface Payment {
  id: number;
  student: {
    email: string;
  };
  course: {
    title: string;
  };
  paidAmount: number | string;
  dateEnrolled: string;
  status: string;
}

interface CourseOption {
  id: number;
  title: string;
}

const CoursePayment = () => {
  const axiosPrivate = useAdminAxiosPrivate();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");

  const paymentsPerPage = 30;

  useEffect(() => {
    axiosPrivate
      .get("courses/all/titles")
      .then((response) => {
        setCourseOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course titles:", error);
      });
  }, [axiosPrivate]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosPrivate.get(
          `courses/payments/${currentPage}`,
          {
            params: {
              search: searchQuery,
              status: status || undefined,
            },
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setPayments(response.data.payments);
        setTotalPayments(response.data.totalPayments);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPayments();
  }, [currentPage, searchQuery, status, axiosPrivate]);

  const pageCount = Math.ceil(totalPayments / paymentsPerPage);

  const changePage = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async () => {
    if (!selectedCourse || !newStatus) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select both course and new status",
        confirmButtonText: "OK",
      });
      return;
    }

    const courseId = parseInt(selectedCourse);
    try {
      const response = await axiosPrivate.patch(
        `courses/update_status/${currentPage}`,
        JSON.stringify({
          courseId,
          status: newStatus,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setPayments(response.data);
      Swal.fire({
        icon: "success",
        title: "Update Success",
        text: "Course status updated successfully!",
        confirmButtonText: "OK",
      });
      setSelectedCourse("");
      setNewStatus("");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Error updating course status!",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Course Payments</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search for Course..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-900 text-white border-gray-700 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => {
                setStatus(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger id="status" className="bg-gray-900 text-white border-gray-700 mt-1">
                  <SelectValue placeholder="Choose Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="STARTED">Started</SelectItem>
                  <SelectItem value="DROPPED">Dropped</SelectItem>
                  <SelectItem value="FINISHED">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Update Course Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="course-select">Select Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger id="course-select" className="bg-gray-900 text-white border-gray-700 mt-1">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courseOptions.map((course) => (
                    <SelectItem key={course.id} value={String(course.id)}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="new-status" className="bg-gray-900 text-white border-gray-700 mt-1">
                  <SelectValue placeholder="New Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="STARTED">Started</SelectItem>
                  <SelectItem value="DROPPED">Dropped</SelectItem>
                  <SelectItem value="FINISHED">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedCourse || !newStatus}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 text-white">
                <TableHead className="text-white">Id</TableHead>
                <TableHead className="text-white">Student Email</TableHead>
                <TableHead className="text-white">Course Title</TableHead>
                <TableHead className="text-white">Price</TableHead>
                <TableHead className="text-white">Payment Date</TableHead>
                <TableHead className="text-white">Course Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="bg-red-600 text-white">
                  <TableCell className="bg-black text-white font-semibold">
                    {payment.id}
                  </TableCell>
                  <TableCell>{payment.student.email}</TableCell>
                  <TableCell>{payment.course.title}</TableCell>
                  <TableCell>
                    {typeof payment.paidAmount === "number"
                      ? formatCurrency(payment.paidAmount)
                      : payment.paidAmount}
                  </TableCell>
                  <TableCell>
                    <Moment format="DD/MM/YYYY">{payment.dateEnrolled}</Moment>
                  </TableCell>
                  <TableCell>{payment.status}</TableCell>
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

export default CoursePayment;
