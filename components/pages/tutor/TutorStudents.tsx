"use client";

import { useCallback, useEffect, useState } from "react";
import { useTutorAxiosPrivate } from "@/hooks/useTutorAxiosPrivate";
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
import { FaUserFriends, FaSearch, FaBookOpen, FaDollarSign, FaCalendarAlt } from "react-icons/fa";
import Moment from "react-moment";
import { formatCurrency } from "@/utils/formatCurrency";

interface StudentRow {
  studentId: number;
  name: string;
  email: string;
  coursesEnrolled: number;
  totalPaid: number;
  lastEnrolled: string;
}

const TutorStudents = () => {
  const axiosPrivate = useTutorAxiosPrivate();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("tutors/me/students", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const list = Array.isArray(response?.data) ? response.data : [];
      setStudents(list);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
          <p className="text-gray-600">
            Students enrolled in your courses
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <FaUserFriends className="w-5 h-5 text-purple-600" />
                All Students ({students.length})
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Courses</TableHead>
                    <TableHead className="text-right">Total paid</TableHead>
                    <TableHead>Last enrolled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => (
                    <TableRow key={s.studentId}>
                      <TableCell>
                        <p className="font-medium">{s.name || "—"}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-600">{s.email || "—"}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1">
                          <FaBookOpen className="w-4 h-4 text-purple-500" />
                          {s.coursesEnrolled}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(s.totalPaid)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <Moment format="MMM D, YYYY">{s.lastEnrolled}</Moment>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FaUserFriends className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>
                  {searchQuery
                    ? "No students match your search."
                    : "No students enrolled yet. They will appear here when they enroll in your courses."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorStudents;
