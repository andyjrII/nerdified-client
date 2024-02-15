import { useState, useEffect } from "react";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import "chart.js/auto";
import { Line } from "react-chartjs-2";

const PaymentsLineChart = () => {
  const axiosPrivate = useAdminAxiosPrivate();

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosPrivate.get("admin/payments_month", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        setData(response?.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getData();
  }, []);

  const months = data.map((entry) => entry.month);
  const amounts = data.map((entry) => entry.sumOfPaidAmount);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Sum of Paid Amount",
        data: amounts,
        fill: false,
        borderColor: "rgba(75,192,192,1)"
      }
    ]
  };

  return <Line data={chartData} options={{}} />;
};

export default PaymentsLineChart;
