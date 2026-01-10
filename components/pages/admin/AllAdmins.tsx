"use client";

import { useState, useEffect } from "react";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import { FaTrashAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import db from "@/utils/localBase";
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

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AllAdmins = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const [role, setRole] = useState<string>("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [totalAdmins, setTotalAdmins] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const adminsPerPage = 20;

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchRole();
      } catch (error) {
        console.error("Error fetching role from localBase:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (role) {
      fetchAdmins();
    }
  }, [currentPage, searchQuery, role, axiosPrivate]);

  const fetchRole = async () => {
    try {
      const data = await db.collection("auth_admin").get();
      if (data.length > 0) {
        setRole(data[0].role);
      }
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axiosPrivate.get(`admin/all/${currentPage}`, {
        params: {
          search: searchQuery,
          role,
        },
      });
      setAdmins(response.data.admins);
      setTotalAdmins(response.data.totalAdmins);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const pageCount = Math.ceil(totalAdmins / adminsPerPage);

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
      const response = await axiosPrivate.delete(`admin/${id}`, {
        params: {
          role,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Delete Success",
        text: `${response.data.name} deleted successfully`,
        confirmButtonText: "OK",
      });
      fetchAdmins();
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
        <h1 className="text-3xl font-bold text-center">All Admins</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search for admin..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-gray-900 text-white border-gray-700"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 text-white">
                <TableHead className="text-white">Id</TableHead>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id} className="bg-red-600 text-white">
                  <TableCell className="bg-black text-white font-semibold">
                    {admin.id}
                  </TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell className="bg-black">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(admin.id)}
                      title="Delete Admin"
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

export default AllAdmins;
