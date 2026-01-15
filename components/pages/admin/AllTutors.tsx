"use client";

import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
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
import { Badge } from "@/components/ui/badge";

interface Tutor {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  bio: string;
  qualifications: string;
  approved: boolean;
  approvedAt: string | null;
  createdAt: string;
  courses: any[];
  approvedBy: {
    id: number;
    name: string;
    email: string;
  } | null;
}

const AllTutors = () => {
  const axios = useAdminAxiosPrivate();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [totalTutors, setTotalTutors] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [approvedFilter, setApprovedFilter] = useState<boolean | undefined>(
    undefined,
  );

  const tutorsPerPage = 20;

  const fetchTutors = async () => {
    try {
      const params: any = {
        search: searchQuery,
      };
      if (approvedFilter !== undefined) {
        params.approved = approvedFilter.toString();
      }
      const response = await axios.get(`admin/tutors/${currentPage}`, {
        params,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setTutors(response.data.tutors);
      setTotalTutors(response.data.totalTutors);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchTutors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, approvedFilter]);

  const pageCount = Math.ceil(totalTutors / tutorsPerPage);

  const changePage = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleApprove = async (id: number, name: string) => {
    try {
      const result = await Swal.fire({
        title: "Approve Tutor?",
        text: `Are you sure you want to approve ${name}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, approve",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await axios.patch(`admin/tutors/${id}/approve`);
        Swal.fire({
          icon: "success",
          title: "Tutor Approved",
          text: `${name} has been approved successfully`,
          confirmButtonText: "OK",
        });
        fetchTutors();
      }
    } catch (error: any) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: error.response?.data?.message || "Failed to approve tutor",
        confirmButtonText: "OK",
      });
    }
  };

  const handleReject = async (id: number, name: string) => {
    try {
      const result = await Swal.fire({
        title: "Reject Tutor?",
        text: `Are you sure you want to reject ${name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, reject",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await axios.patch(`admin/tutors/${id}/reject`);
        Swal.fire({
          icon: "success",
          title: "Tutor Rejected",
          text: `${name} has been rejected`,
          confirmButtonText: "OK",
        });
        fetchTutors();
      }
    } catch (error: any) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: error.response?.data?.message || "Failed to reject tutor",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Tutor Management</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter Tutors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Search for tutor..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-gray-900 text-white border-gray-700"
          />
          <div className="flex gap-2">
            <Button
              variant={approvedFilter === undefined ? "default" : "outline"}
              onClick={() => {
                setApprovedFilter(undefined);
                setCurrentPage(1);
              }}
            >
              All
            </Button>
            <Button
              variant={approvedFilter === false ? "default" : "outline"}
              onClick={() => {
                setApprovedFilter(false);
                setCurrentPage(1);
              }}
            >
              Pending Approval
            </Button>
            <Button
              variant={approvedFilter === true ? "default" : "outline"}
              onClick={() => {
                setApprovedFilter(true);
                setCurrentPage(1);
              }}
            >
              Approved
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            All Tutors ({approvedFilter === false ? "Pending" : approvedFilter === true ? "Approved" : "All"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 text-white">
                <TableHead className="text-white">Id</TableHead>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Phone</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Courses</TableHead>
                <TableHead className="text-white">Joined Date</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.map((tutor) => (
                <TableRow key={tutor.id} className="bg-gray-800 text-white">
                  <TableCell className="bg-black text-white font-semibold">
                    {tutor.id}
                  </TableCell>
                  <TableCell>{tutor.name || "N/A"}</TableCell>
                  <TableCell>{tutor.email}</TableCell>
                  <TableCell>{tutor.phoneNumber || "N/A"}</TableCell>
                  <TableCell>
                    {tutor.approved ? (
                      <Badge className="bg-green-600">Approved</Badge>
                    ) : (
                      <Badge className="bg-orange-600">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>{tutor.courses?.length || 0}</TableCell>
                  <TableCell>
                    <Moment format="DD/MM/YYYY">{tutor.createdAt}</Moment>
                  </TableCell>
                  <TableCell className="bg-black">
                    <div className="flex gap-2">
                      {!tutor.approved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(tutor.id, tutor.name || tutor.email)}
                          title="Approve Tutor"
                          className="text-green-400 hover:bg-gray-700 hover:text-green-600"
                        >
                          <FaCheck className="h-5 w-5" />
                        </Button>
                      )}
                      {tutor.approved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReject(tutor.id, tutor.name || tutor.email)}
                          title="Reject Tutor"
                          className="text-red-400 hover:bg-gray-700 hover:text-red-600"
                        >
                          <FaTimes className="h-5 w-5" />
                        </Button>
                      )}
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
                previousLinkClassName={
                  "px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                }
                nextLinkClassName={
                  "px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                }
                disabledClassName={"opacity-50 cursor-not-allowed"}
                activeClassName={"bg-blue-900 text-white"}
                pageLinkClassName={
                  "px-4 py-2 border rounded hover:bg-gray-100"
                }
                breakLabel={"..."}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllTutors;
