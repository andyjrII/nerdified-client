import { useState, useEffect } from "react";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import "chart.js/auto";
import { Pie } from "react-chartjs-2";

const PaymentsPieChart = () => {
  const axiosPrivate = useAdminAxiosPrivate();

  const [beginner, setBeginner] = useState();
  const [intermediate, setIntermediate] = useState();
  const [advance, setAdvance] = useState();

  useEffect(() => {
    const getCoursePrices = async () => {
      try {
        const response = await axiosPrivate.get("admin/payments_level", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        setBeginner(response?.data[0]?.sumOfPaidAmount);
        setIntermediate(response?.data[1]?.sumOfPaidAmount);
        setAdvance(response?.data[2]?.sumOfPaidAmount);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getCoursePrices();
  }, []);

  const getLevelChart = () => {
    return {
      labels: ["Beginner", "Intermediate", "Advance"],
      datasets: [
        {
          data: [beginner, intermediate, advance],
          backgroundColor: [
            "rgba(192,75,192, 0.6)",
            "rgba(255, 132, 132, 0.6)",
            "rgba(75, 75, 132, 0.6)"
          ]
        }
      ]
    };
  };

  return <Pie data={getLevelChart()} options={{}} />;
};

export default PaymentsPieChart;
