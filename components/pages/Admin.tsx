"use client";

import { useState, useEffect } from "react";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import { FaBlog, FaUserGraduate } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import PaymentsLineChart from "@/components/PaymentsLineChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  useEffect(() => {
    getTotals();
  }, [axiosPrivate]);

  const getTotals = async () => {
    try {
      const response = await axiosPrivate.get("admin/totals");
      setTotalStudents(response.data[0]);
      setTotalCourses(response.data[1]);
      setTotalPosts(response.data[2]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Students */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {totalStudents}
                </p>
              </div>
              <div className="text-gray-300">
                <FaUserGraduate className="text-4xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Courses */}
        <Card className="border-l-4 border-l-green-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-green-600 uppercase mb-1">
                  Total Courses
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {totalCourses}
                </p>
              </div>
              <div className="text-gray-300">
                <IoSchool className="text-4xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Posts */}
        <Card className="border-l-4 border-l-yellow-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-yellow-600 uppercase mb-1">
                  Total Blog Posts
                </p>
                <p className="text-3xl font-bold text-gray-800">{totalPosts}</p>
              </div>
              <div className="text-gray-300">
                <FaBlog className="text-4xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-600">Earnings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <PaymentsLineChart />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
