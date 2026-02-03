"use client";

import { useCallback, useEffect, useState } from "react";
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
import db from "@/utils/localBase";
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

  const fetchEnrollments = useCallback(async () => {
    try {
      const response = await axiosPrivate.get(`students/enrolled/${email}`);
      const enrollments = Array.isArray(response?.data) ? response.data : [];
      setEnrollmentData(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setEnrollmentData([]);
    }
  }, [axiosPrivate, email]);

  useEffect(() => {
    if (email) {
      fetchEnrollments();
    }
  }, [email, fetchEnrollments]);

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
