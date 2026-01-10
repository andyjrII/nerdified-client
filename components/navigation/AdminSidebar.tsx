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
} from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import { useAdminLogout } from "@/hooks/useAdminLogout";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import { useAdmin } from "@/hooks/useAdmin";
import db from "@/utils/localBase";
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

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchEmail();
        if (email) {
          await fetchAdmin();
        }
      } catch (error) {
        console.error("Error fetching email from localBase:", error);
      }
    };

    initializeData();
  }, [email]);

  const fetchEmail = async () => {
    try {
      const data = await db.collection("auth_admin").get();
      if (data.length > 0) {
        setEmail(data[0].email);
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  const fetchAdmin = async () => {
    try {
      const response = await axiosPrivate.get(`admin/${email}`);
      setAdmin(response?.data);
    } catch (error) {
      console.error("Error:", error);
      try {
        const localAdmin = await db.collection("admin").doc(email).get();
        setAdmin(localAdmin);
      } catch (localError) {
        console.error("Error fetching from localBase:", localError);
      }
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
                  <span>View</span>
                </Link>
                <Link
                  href="/admin/courses/new"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaPenAlt className="h-4 w-4" />
                  <span>Create</span>
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

        {admin.role === "SUPER" && (
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
