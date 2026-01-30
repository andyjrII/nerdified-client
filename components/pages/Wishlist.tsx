"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { FaHeart } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import db from "@/utils/localBase";
import Moment from "react-moment";
import { formatCurrency } from "@/utils/formatCurrency";
import StarRating from "@/components/StarRating";
import StudentInfo from "@/components/StudentInfo";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WishlistItem {
  id: number;
  courseId: number;
  createdAt: string;
  course: {
    id: number;
    title: string;
    price: number | string;
    averageRating: number;
  };
}

const Wishlist = () => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail();
        if (email) await getWishlist();
      } catch (error) {
        console.log("Error during initialization:", error);
      }
    };

    initialize();
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

  const getWishlist = async () => {
    try {
      const response = await axiosPrivate.get(`wishlist/email/${email}`, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setWishlist(response?.data);
    } catch (error) {
      console.error("Error getting Wishlist");
    }
  };

  const handleRemove = async (courseId: number) => {
    try {
      await axiosPrivate.delete("wishlist/remove", {
        data: { email, courseId },
      });
      Swal.fire({
        icon: "success",
        title: "Course Removed",
        text: "Course has been successfully removed from wishlist!",
        confirmButtonText: "OK",
      });
      getWishlist();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error removing course from wishlist!",
        confirmButtonText: "Try again",
      });
    }
  };

  const handleCourseView = (course: WishlistItem["course"]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("NERDVILLE_COURSE", JSON.stringify(course));
    }
    router.push(`/courses/${course.id}`);
  };

  return (
    <section className="border-t border-b bg-gray-50 min-h-screen">
      <main className="w-full px-4 py-6">
        <StudentInfo />

        <div className="text-center mb-6">
          <h1 className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-2xl font-bold">
            Wishlist
          </h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>My Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            {wishlist.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Your wishlist is empty
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wishlist.map((wish) => (
                    <TableRow key={wish.id}>
                      <TableCell className="font-medium">
                        {wish.course.title}
                      </TableCell>
                      <TableCell>
                        <StarRating rating={wish.course.averageRating || 0} />
                      </TableCell>
                      <TableCell>
                        {typeof wish.course.price === "number"
                          ? formatCurrency(wish.course.price)
                          : wish.course.price}
                      </TableCell>
                      <TableCell>
                        <Moment format="MMMM D, YYYY">{wish.createdAt}</Moment>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCourseView(wish.course)}
                            title="View Course"
                          >
                            <GrView className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(wish.courseId)}
                            title="Remove from Wishlist"
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaHeart className="h-5 w-5 fill-current" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </section>
  );
};

export default Wishlist;
