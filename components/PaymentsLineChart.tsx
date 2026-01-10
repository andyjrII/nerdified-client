"use client";

import { useState, useEffect } from "react";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface PaymentData {
  month: string;
  sumOfPaidAmount: number;
}

const PaymentsLineChart = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const [data, setData] = useState<PaymentData[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosPrivate.get("admin/payments_month", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setData(response?.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getData();
  }, [axiosPrivate]);

  const months = data.map((entry) => entry.month);
  const amounts = data.map((entry) => entry.sumOfPaidAmount);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Total Payments Per Month",
        data: amounts,
        fill: true,
        borderColor: "rgba(0,2,50,1)",
        backgroundColor: "rgba(0,2,50,0.1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Earnings Overview",
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default PaymentsLineChart;
