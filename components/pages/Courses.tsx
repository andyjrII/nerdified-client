"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import db from "@/utils/localBase";
import Moment from "react-moment";
import ReactPaginate from "react-paginate";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import StarRating from "@/components/StarRating";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";

interface Course {
  id: number;
  title: string;
  price: number | string;
  updatedAt: string;
  averageRating: number;
}

const Courses = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const coursesPerPage = 20;

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await db.collection("auth_student").get();
        if (data.length > 0) {
          setEmail(data[0].email);
        }
      } catch (error) {
        console.log("Error during initialization:", error);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (email) {
      getWishlist();
    }
  }, [email]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await axiosPrivate.get(`courses/${currentPage}`, {
          params: {
            search: searchQuery,
          },
        });
        setTotalCourses(response.data.totalCourses);
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching Courses!", error);
      }
    };
    getCourses();
  }, [currentPage, searchQuery, axiosPrivate]);

  const getWishlist = async () => {
    if (!email) return;
    try {
      const response = await axiosPrivate.get(`wishlist/email/${email}`);
      const wishlistSet = new Set(response.data.map((item: any) => item.courseId));
      setWishlist(wishlistSet);
    } catch (error) {
      console.error("Error getting wishlist", error);
    }
  };

  const handleWishlistToggle = async (courseId: number) => {
    if (email) {
      try {
        if (wishlist.has(courseId)) {
          await axiosPrivate.delete("/wishlist/remove", {
            data: { email, courseId },
          });
          Swal.fire({
            icon: "success",
            title: "Course Removed",
            text: "Course has been successfully removed from wishlist!",
            confirmButtonText: "OK",
          });
          setWishlist((prev) => {
            const newSet = new Set(prev);
            newSet.delete(courseId);
            return newSet;
          });
        } else {
          await axiosPrivate.post(
            "/wishlist/add",
            { email, courseId },
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
          setWishlist((prev) => new Set(prev).add(courseId));
        }
      } catch (error) {
        console.error("Error toggling wishlist:", error);
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

  const pageCount = Math.ceil(totalCourses / coursesPerPage);

  const changePage = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const saveCourse = (course: Course) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("NERDVILLE_COURSE", JSON.stringify(course));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <main>
      <header className="py-6 border-b bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-2xl font-bold">
              Courses
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search filter */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search for Class..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Courses Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {courses.map((course) => {
            const isInWishlist = wishlist.has(course.id);
            const priceValue =
              typeof course.price === "string"
                ? course.price
                : formatCurrency(course.price);
            return (
              <motion.div layout key={course.id}>
                <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-blue-900 text-white py-3">
                    <h4 className="text-lg font-semibold my-0 text-center">
                      {course.title}
                    </h4>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="list-none space-y-2 mb-4 text-center">
                      <li className="text-sm text-gray-600">
                        Updated:{" "}
                        <Moment format="MMMM D, YYYY">{course.updatedAt}</Moment>
                      </li>
                      <li className="flex justify-center">
                        <StarRating rating={course.averageRating || 0} />
                      </li>
                      <li className="text-xl font-bold text-blue-900">
                        {priceValue}
                      </li>
                    </ul>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        asChild
                        className="flex-1 bg-blue-900 hover:bg-blue-800"
                        onClick={() => saveCourse(course)}
                      >
                        <Link href={`/courses/${course.id}`}>View</Link>
                      </Button>
                      <button
                        onClick={() => handleWishlistToggle(course.id)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title={
                          isInWishlist
                            ? "Remove Course from Wishlist"
                            : "Add Course to Wishlist"
                        }
                      >
                        <FaHeart
                          className={`h-5 w-5 ${
                            isInWishlist ? "text-red-500 fill-current" : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pagination */}
        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"flex justify-center space-x-2"}
            previousLinkClassName={"px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"}
            nextLinkClassName={"px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
            activeClassName={"bg-blue-900 text-white"}
            pageLinkClassName={"px-4 py-2 border rounded hover:bg-gray-100"}
            breakLabel={"..."}
          />
        )}
      </div>
    </main>
  );
};

export default Courses;
