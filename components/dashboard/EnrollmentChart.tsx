"use client";

import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/utils/localBase";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EnrollmentChart = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState<string>("");
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await db.collection("auth_student").get();
        if (data.length > 0) {
          setEmail(data[0].email);
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (email) {
      fetchEnrollments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  const fetchEnrollments = async () => {
    try {
      const response = await axiosPrivate.get(`students/enrolled/${email}`);
      const enrollments = Array.isArray(response?.data) ? response.data : [];
      setEnrollmentData(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setEnrollmentData([]);
    }
  };

  // Group enrollments by month
  const monthlyEnrollments = enrollmentData.reduce((acc, enrollment) => {
    const date = new Date(enrollment.dateEnrolled);
    const month = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const months = Object.keys(monthlyEnrollments);
  const counts = Object.values(monthlyEnrollments);

  const chartData = {
    labels: months.length > 0 ? months : ["No data"],
    datasets: [
      {
        label: "Courses Enrolled",
        data: counts.length > 0 ? counts : [0],
        backgroundColor: "rgba(30, 58, 138, 0.8)",
        borderColor: "rgba(30, 58, 138, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default EnrollmentChart;
