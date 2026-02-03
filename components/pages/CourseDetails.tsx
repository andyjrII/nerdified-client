"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import db from "@/utils/localBase";
import Moment from "react-moment";
import { FaClock, FaMoneyBill, FaStar, FaHeart } from "react-icons/fa";
import Missing from "./Missing";
import StarRating from "@/components/StarRating";
import Reviews from "@/components/Reviews";
import PDFViewer from "@/components/PDFViewer";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  title: string;
  price: string | number;
  updatedAt: string;
  averageRating: number;
}

const CourseDetails = () => {
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState<string>("");
  const [course, setCourse] = useState<Course | null>(null);
  const [courseEnrolled, setCourseEnrolled] = useState<any>(null);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail();
        if (email) {
          await isCourseEnrolled();
          await checkIfInWishlist();
        }
        await fetchCourse();
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

  const fetchCourse = async () => {
    try {
      let courseId = params.id;
      if (typeof window !== "undefined") {
        const storedCourse = localStorage.getItem("NERDVILLE_COURSE");
        if (storedCourse) {
          const parsedCourse = JSON.parse(storedCourse);
          setCourse(parsedCourse);
          courseId = parsedCourse.id;
        } else if (courseId) {
          const response = await axiosPrivate.get(`courses/course/${courseId}`);
          setCourse(response.data);
          localStorage.setItem("NERDVILLE_COURSE", JSON.stringify(response.data));
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const isCourseEnrolled = async () => {
    if (!course?.id) return;
    try {
      const response = await axiosPrivate.get(
        `students/course_enrolled/${course.id}`,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setCourseEnrolled(response.data);
    } catch (error) {
      console.error("Error verifying if Course is Enrolled.");
    }
  };

  const checkIfInWishlist = async () => {
    if (!course?.id || !email) return;
    try {
      const response = await axiosPrivate.get(`wishlist/email/${email}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const wishlistSet = new Set(response.data.map((item: any) => item.courseId));
      setIsInWishlist(wishlistSet.has(course.id));
    } catch (error) {
      console.log("Error fetching Wishlist!");
    }
  };

  const handleWishlistToggle = async () => {
    if (!course?.id) return;

    if (email) {
      try {
        if (isInWishlist) {
          await axiosPrivate.delete("/wishlist/remove", {
            data: { email, courseId: course.id },
          });
          Swal.fire({
            icon: "success",
            title: "Course Removed",
            text: "Course has been successfully removed from wishlist!",
            confirmButtonText: "OK",
          });
          setIsInWishlist(false);
        } else {
          await axiosPrivate.post(
            "/wishlist/add",
            JSON.stringify({
              email,
              courseid: course.id,
            }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          Swal.fire({
            icon: "success",
            title: "Course Added",
            text: "Course has been successfully added to wishlist!",
            confirmButtonText: "OK",
          });
          setIsInWishlist(true);
        }
      } catch (error) {
        console.log("Error toggling Wishlist!");
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "You must be signed in first!",
        confirmButtonText: "Ok",
      });
    }
  };

  if (!course) {
    return <Missing />;
  }

  return (
    <main>
      <header className="py-6 border-b bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-2xl font-bold">
              {course.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <PDFViewer />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Overview Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="bg-blue-900 text-white">
              <CardTitle className="text-white text-center">Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex gap-4">
                <FaClock className="text-black flex-shrink-0 text-xl mt-1" />
                <div>
                  <h5 className="font-semibold mb-1">Last Updated</h5>
                  <span className="text-sm text-gray-600">
                    <Moment format="MMMM D, YYYY">{course.updatedAt}</Moment>
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <FaStar className="text-yellow-500 flex-shrink-0 text-xl mt-1" />
                <div>
                  <h5 className="font-semibold mb-1">Average Rating</h5>
                  <div className="flex">
                    <StarRating rating={course.averageRating || 0} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <FaMoneyBill className="text-green-600 flex-shrink-0 text-xl mt-1" />
                <div>
                  <h5 className="font-semibold mb-1">Price</h5>
                  <span className="text-gray-600">{course.price}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2">
                {email ? (
                  courseEnrolled ? (
                    <Button disabled className="w-full bg-gray-400">
                      Enrolled
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full bg-blue-900 hover:bg-blue-800"
                    >
                      <Link href={`/courses/${course.id}/payment`}>
                        Enroll now
                      </Link>
                    </Button>
                  )
                ) : (
                  <Button
                    asChild
                    className="w-full bg-blue-900 hover:bg-blue-800"
                  >
                    <Link href="/signin">Login to enrol!</Link>
                  </Button>
                )}
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                    isInWishlist ? "text-red-500" : "text-gray-400"
                  }`}
                  title={
                    isInWishlist
                      ? "Remove Course from Wishlist"
                      : "Add Course to Wishlist"
                  }
                >
                  <FaHeart
                    className={`h-6 w-6 ${
                      isInWishlist ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <div className="lg:col-span-3">
            <Reviews courseId={course.id} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetails;
