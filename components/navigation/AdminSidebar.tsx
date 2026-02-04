"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBlog,
  FaUserAlt,
  FaLock,
  FaDollarSign,
  FaLaughWink,
  FaBinoculars,
  FaPenAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import { useAdminLogout } from "@/hooks/useAdminLogout";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import { useAdmin } from "@/hooks/useAdmin";
import {
  getAuthAdmin,
  getAdminProfile,
  setAdminProfile,
} from "@/utils/authStorage";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const AdminSidebar = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const { admin, setAdmin } = useAdmin();
  const router = useRouter();
  const logout = useAdminLogout();
  const [email, setEmail] = useState<string>("");

  const fetchEmail = () => {
    const data = getAuthAdmin();
    if (data?.email) setEmail(data.email);
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  useEffect(() => {
    if (email) {
      fetchAdmin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  const fetchAdmin = async () => {
    try {
      const response = await axiosPrivate.get(`admin/${email}`);
      const data = response?.data;
      setAdmin(data);
      if (data) setAdminProfile(data as Record<string, unknown>);
    } catch (error) {
      console.error("Error:", error);
      const cached = getAdminProfile();
      if (cached) setAdmin(cached);
    }
  };

  const signOut = async () => {
    await logout();
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <Link
        href="/admin"
        className="flex items-center justify-center mb-8 p-4 hover:bg-gray-800 rounded-lg transition-colors"
      >
        <div className="rotate-[-15deg] mr-3">
          <FaLaughWink className="text-2xl" />
        </div>
        <div className="text-lg font-bold">{admin.name || "Admin"}</div>
      </Link>

      <nav className="space-y-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="courses" className="border-none">
            <AccordionTrigger className="hover:bg-gray-800 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <IoSchool className="h-5 w-5" />
                <span>Courses</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                <Link
                  href="/admin/courses"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaBinoculars className="h-4 w-4" />
                  <span>View All</span>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tutors" className="border-none">
            <AccordionTrigger className="hover:bg-gray-800 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <FaChalkboardTeacher className="h-5 w-5" />
                <span>Tutors</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                <Link
                  href="/admin/tutors"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaBinoculars className="h-4 w-4" />
                  <span>View All</span>
                </Link>
                <Link
                  href="/admin/tutors/pending"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaPenAlt className="h-4 w-4" />
                  <span>Pending Approval</span>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="blog" className="border-none">
            <AccordionTrigger className="hover:bg-gray-800 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <FaBlog className="h-5 w-5" />
                <span>Blog Posts</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                <Link
                  href="/admin/posts"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaBinoculars className="h-4 w-4" />
                  <span>View</span>
                </Link>
                <Link
                  href="/admin/posts/new"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaPenAlt className="h-4 w-4" />
                  <span>Create</span>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Link
          href="/admin/students"
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FaUserGraduate className="h-5 w-5" />
          <span>Students</span>
        </Link>

        <Link
          href="/admin/courses/payment"
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FaDollarSign className="h-5 w-5" />
          <span>Payments</span>
        </Link>

        {admin.role === "SUPER_ADMIN" && (
          <>
            <hr className="my-4 border-gray-700" />
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="admins" className="border-none">
                <AccordionTrigger className="hover:bg-gray-800 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <FaUserAlt className="h-5 w-5" />
                    <span>Admins</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-4">
                    <Link
                      href="/admins"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <FaBinoculars className="h-4 w-4" />
                      <span>View</span>
                    </Link>
                    <Link
                      href="/admins/new"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <FaPenAlt className="h-4 w-4" />
                      <span>Create</span>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}

        <hr className="my-4 border-gray-700" />

        <Button
          onClick={signOut}
          variant="ghost"
          className="w-full justify-start text-white hover:bg-gray-800"
        >
          <FaLock className="h-5 w-5 mr-2" />
          <span>Sign Out</span>
        </Button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
