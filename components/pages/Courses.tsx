"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useAuth } from "@/hooks/useAuth";
import Moment from "react-moment";
import ReactPaginate from "react-paginate";
import { motion, Variants } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaBookOpen,
  FaSearch,
  FaArrowRight,
  FaRegClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import StarRating from "@/components/StarRating";
import Swal from "sweetalert2";
import { formatCurrency } from "@/utils/formatCurrency";

interface Course {
  id: number;
  title: string;
  price: number | string;
  updatedAt: string;
  averageRating: number;
}

/* ---------- motion helpers (shared with the landing page) ---------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: "easeOut" },
  }),
};

// Deterministic gradient cover per course, so the grid feels varied but stable.
const covers = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
];

const Courses = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const email = auth.email ?? "";
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  const coursesPerPage = 20;

  useEffect(() => {
    if (email) {
      getWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, [currentPage, searchQuery, axiosPrivate]);

  const getWishlist = async () => {
    if (!email) return;
    try {
      const response = await axiosPrivate.get(`wishlist/email/${email}`);
      const wishlistSet = new Set<number>(
        response.data.map((item: { courseId: number }) => item.courseId)
      );
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
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
    <div className="bg-white text-slate-900">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 ring-1 ring-blue-100"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Live <span className="text-blue-300">•</span> Instructor-led{" "}
            <span className="text-blue-300">•</span>{" "}
            <span className="text-slate-400">Interactive</span>
          </motion.span>

          <motion.h1
            className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
          >
            Learn something new,{" "}
            <span className="relative inline-block text-blue-600">
              live
              <svg
                className="absolute -bottom-1.5 left-0 w-full"
                height="12"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.path
                  d="M2 8C40 3 160 3 198 8"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.9, ease: "easeInOut" }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          >
            Browse instructor-led classes, save your favourites, and book a live
            session that fits your schedule.
          </motion.p>

          {/* Search */}
          <motion.div
            className="mx-auto mt-7 max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25, ease: "easeOut" }}
          >
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search for a class or topic…"
                onChange={handleSearchChange}
                className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== RESULTS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        {/* Result count */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {totalCourses > 0 ? (
                <>
                  <span className="font-semibold text-slate-900">
                    {totalCourses}
                  </span>{" "}
                  {totalCourses === 1 ? "course" : "courses"}
                  {searchQuery && (
                    <>
                      {" "}
                      for{" "}
                      <span className="font-semibold text-slate-900">
                        &ldquo;{searchQuery}&rdquo;
                      </span>
                    </>
                  )}
                </>
              ) : null}
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="h-24 animate-pulse bg-slate-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
                    <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && courses.length === 0 && (
          <motion.div
            className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-slate-50 px-6 py-14 text-center"
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <FaBookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No courses found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {searchQuery
                ? "No courses match your search. Try a different keyword."
                : "No courses are available right now. Check back later!"}
            </p>
          </motion.div>
        )}

        {/* Courses grid */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course, i) => {
              const isInWishlist = wishlist.has(course.id);
              const priceValue =
                typeof course.price === "string"
                  ? course.price
                  : formatCurrency(course.price);
              const cover = covers[course.id % covers.length];
              const rating = course.averageRating || 0;
              return (
                <motion.div
                  key={course.id}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  animate="show"
                >
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    {/* Cover */}
                    <div
                      className={`relative flex h-24 items-center justify-center bg-gradient-to-br ${cover}`}
                    >
                      <FaBookOpen className="h-8 w-8 text-white/80" />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Live class
                      </span>
                      <button
                        onClick={() => handleWishlistToggle(course.id)}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white"
                        title={
                          isInWishlist
                            ? "Remove Course from Wishlist"
                            : "Add Course to Wishlist"
                        }
                        aria-label={
                          isInWishlist
                            ? "Remove Course from Wishlist"
                            : "Add Course to Wishlist"
                        }
                      >
                        {isInWishlist ? (
                          <FaHeart className="h-4 w-4 text-rose-500" />
                        ) : (
                          <FaRegHeart className="h-4 w-4 text-slate-500" />
                        )}
                      </button>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900">
                        {course.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                        <FaRegClock className="h-3 w-3" />
                        Updated{" "}
                        <Moment format="MMM D, YYYY">{course.updatedAt}</Moment>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5">
                        <StarRating rating={rating} />
                        <span className="text-xs font-medium text-slate-400">
                          {rating > 0 ? rating.toFixed(1) : "New"}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-lg font-extrabold text-blue-600">
                          {priceValue}
                        </span>
                        <Link
                          href={`/courses/${course.id}`}
                          onClick={() => saveCourse(course)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                          View
                          <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && pageCount > 1 && (
          <div className="mt-10">
            <ReactPaginate
              previousLabel={<FaChevronLeft className="h-3 w-3" />}
              nextLabel={<FaChevronRight className="h-3 w-3" />}
              pageCount={pageCount}
              forcePage={currentPage - 1}
              onPageChange={changePage}
              breakLabel="…"
              containerClassName="flex flex-wrap items-center justify-center gap-2"
              pageLinkClassName="flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              activeLinkClassName="!border-blue-600 !bg-blue-600 !text-white hover:!bg-blue-700"
              previousLinkClassName="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
              nextLinkClassName="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
              breakLinkClassName="flex h-10 min-w-10 items-center justify-center px-2 text-slate-400"
              disabledLinkClassName="cursor-not-allowed opacity-40 hover:bg-transparent"
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;
