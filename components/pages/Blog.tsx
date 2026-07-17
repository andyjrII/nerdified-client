"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "@/lib/api/axios";
import Image from "next/image";
import Moment from "react-moment";
import ReactPaginate from "react-paginate";
import { motion, Variants } from "framer-motion";
import {
  FaSearch,
  FaRegNewspaper,
  FaArrowRight,
  FaRegCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface BlogPost {
  id: number;
  title: string;
  datePosted: string;
  postUrl: string;
  imagePath?: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: "easeOut" },
  }),
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const postsPerPage = 20;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`blog/${currentPage}`, {
          params: {
            search: searchQuery,
            startDate,
            endDate,
          },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setPosts(response.data.posts);
        setTotalPosts(response.data.totalPosts);
        await fetchImages(currentPage, searchQuery, startDate, endDate);
      } catch (error) {
        console.error("Error getting posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage, searchQuery, startDate, endDate]);

  const fetchImages = async (
    page: number,
    search: string,
    start: string,
    end: string
  ) => {
    try {
      const response = await axios.get(`blog/images/${page}`, {
        params: {
          search,
          startDate: start,
          endDate: end,
        },
      });
      const imageUrls = response?.data;
      const imageBlobs = await Promise.all(
        imageUrls.map(async (imageUrl: string) => {
          const imageResponse = await axios.get(`blog/image/${imageUrl}`, {
            responseType: "arraybuffer",
          });
          return new Blob([imageResponse.data], { type: "image/jpeg" });
        })
      );
      const images = imageBlobs.map((imageBlob) =>
        URL.createObjectURL(imageBlob)
      );
      setImagePaths(images);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const pageCount = Math.ceil(totalPosts / postsPerPage);

  const changePage = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.trim());
    setCurrentPage(1);
  };

  return (
    <div className="bg-white text-slate-900">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 ring-1 ring-blue-100"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            The Nerdified Blog
          </motion.span>

          <motion.h1
            className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
          >
            Insights to help you{" "}
            <span className="relative inline-block text-blue-600">
              grow
              <svg className="absolute -bottom-1.5 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden>
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
            Tips, stories, and lessons on learning, teaching, and building
            skills that matter.
          </motion.p>
        </div>
      </section>

      {/* ===================== CONTENT ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Posts */}
          <div className="lg:col-span-3">
            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="h-44 animate-pulse bg-slate-100" />
                    <div className="space-y-3 p-5">
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                      <div className="h-9 w-full animate-pulse rounded-lg bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && posts.length === 0 && (
              <motion.div
                className="rounded-3xl border border-slate-100 bg-slate-50 px-6 py-16 text-center"
                variants={fadeUp}
                initial="hidden"
                animate="show"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <FaRegNewspaper className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No posts found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {searchQuery || startDate || endDate
                    ? "No posts match your filters. Try adjusting your search or date range."
                    : "No blog posts have been published yet. Check back soon!"}
                </p>
              </motion.div>
            )}

            {/* Posts grid */}
            {!loading && posts.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    variants={fadeUp}
                    custom={index}
                    initial="hidden"
                    animate="show"
                  >
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                      <Link
                        href={`https://${post.postUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block h-44 w-full overflow-hidden bg-slate-100"
                      >
                        {imagePaths[index] ? (
                          <Image
                            src={imagePaths[index]}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-slate-300">
                            <FaRegNewspaper className="h-10 w-10" />
                          </span>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                          <FaRegCalendarAlt className="h-3 w-3" />
                          <Moment format="MMMM D, YYYY">{post.datePosted}</Moment>
                        </div>
                        <h2 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-slate-900">
                          {post.title}
                        </h2>
                        <Link
                          href={`https://${post.postUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                        >
                          Read more
                          <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* Search */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900">Search</h3>
                <div className="relative mt-3">
                  <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search posts…"
                    onChange={handleSearchChange}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Time frame */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900">Time frame</h3>
                <div className="mt-3 space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="start-date" className="text-xs font-medium text-slate-500">
                      Start date
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setCurrentPage(1);
                      }}
                      max={new Date().toISOString().split("T")[0]}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="end-date" className="text-xs font-medium text-slate-500">
                      End date
                    </label>
                    <input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setCurrentPage(1);
                      }}
                      min={startDate}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Blog;
