"use client";

import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { getAuthStudent } from "@/utils/authStorage";
import { formatCurrency } from "@/utils/formatCurrency";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SpendingChart = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState<string>("");
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);

  useEffect(() => {
    const data = getAuthStudent();
    if (data?.email) setEmail(data.email);
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

  // Group spending by month
  const monthlySpending = enrollmentData.reduce((acc, enrollment) => {
    const date = new Date(enrollment.dateEnrolled);
    const month = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const amount = parseFloat(String(enrollment.paidAmount || 0));
    acc[month] = (acc[month] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const months = Object.keys(monthlySpending);
  const amounts = Object.values(monthlySpending);

  const chartData = {
    labels: months.length > 0 ? months : ["No data"],
    datasets: [
      {
        label: "Total Spending",
        data: amounts.length > 0 ? amounts : [0],
        fill: true,
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
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
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return formatCurrency(context.parsed.y);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default SpendingChart;
