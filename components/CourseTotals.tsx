"use client";

import { useEffect, useState } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import db from "@/utils/localBase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";

const CourseTotals = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState<string>("");
  const [totalCourse, setTotalCourse] = useState<number>(0);
  const [totalWishes, setTotalWishes] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<string | number>("₦0.00");

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail();
        if (email) {
          await getTotalCourses();
          await getTotalWishItems();
          await getPaidAmountTotals();
        }
      } catch (error) {
        console.log("Error during initialization:", error);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  const fetchEmail = async () => {
    try {
      const data = await db.collection("auth_student").get();
      if (data.length > 0) {
        setEmail(data[0].email);
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  const getTotalCourses = async () => {
    try {
      const response = await axiosPrivate.get(`students/total/${email}`);
      setTotalCourse(response?.data);
    } catch (error) {
      console.error("Error getting total number of Courses");
    }
  };

  const getTotalWishItems = async () => {
    try {
      const response = await axiosPrivate.get(`wishlist/total/${email}`, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setTotalWishes(response?.data);
    } catch (error) {
      console.error("Error getting total Wishlist items");
    }
  };

  const getPaidAmountTotals = async () => {
    try {
      const response = await axiosPrivate.get(`students/total-paid/${email}`);
      const total = response?.data;
      setTotalPaid(typeof total === "number" ? formatCurrency(total) : total);
    } catch (error) {
      console.error("Error getting total amount paid for Courses");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <Card className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
        <CardHeader>
          <CardTitle className="text-white">My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalCourse}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="text-white">My Wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalWishes}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <CardHeader>
          <CardTitle className="text-white">Spendings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalPaid}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTotals;
