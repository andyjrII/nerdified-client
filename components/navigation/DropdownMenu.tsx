"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faGear,
  faSignOut,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useStudent } from "@/hooks/useStudent";
import { useLogout } from "@/hooks/useLogout";
const DPDefault = "/images/navpages/person_profile.jpg";
import {
  getAuthStudent,
  getStudentProfile,
  setStudentProfile,
} from "@/utils/authStorage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const StudentDropdownMenu = () => {
  const axiosPrivate = useAxiosPrivate();
  const { student, setStudent } = useStudent();
  const [email, setEmail] = useState<string>("");
  const [profileImageError, setProfileImageError] = useState(false);
  const logout = useLogout();

  useEffect(() => {
    const data = getAuthStudent();
    if (data?.email) setEmail(data.email);
  }, []);

  useEffect(() => {
    if (!email) return;
    const fetchStudent = async () => {
      try {
        const response = await axiosPrivate.get(`students/${email}`);
        const data = response?.data;
        setStudent(data);
        if (data) setStudentProfile(data as Record<string, unknown>);
      } catch (error) {
        console.error("Error fetching Student Profile:", error);
        const cached = getStudentProfile();
        if (cached) setStudent(cached);
      }
    };
    fetchStudent();
  }, [email, axiosPrivate, setStudent]);

  // Reset image error when student image path changes
  useEffect(() => {
    setProfileImageError(false);
  }, [student?.imagePath]);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border-2 border-white/20 hover:border-white/40 p-0"
        >
          <Image
            src={profileImageError ? DPDefault : (student?.imagePath || DPDefault)}
            alt={student?.name || "Student"}
            width={36}
            height={36}
            className="rounded-full object-cover"
            onError={() => setProfileImageError(true)}
            unoptimized={!!(student?.imagePath && !student.imagePath.startsWith("/"))}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-blue-900 text-white border-blue-700">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {student?.name || "Student"}
            </p>
            <p className="text-xs leading-none text-gray-400">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-700" />
        <DropdownMenuItem asChild className="hover:bg-blue-800 focus:bg-blue-800 text-white cursor-pointer">
          <Link href="/student" className="flex items-center space-x-2 w-full">
            <FontAwesomeIcon icon={faHome} className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-blue-700" />
        <DropdownMenuItem asChild className="hover:bg-blue-800 focus:bg-blue-800 text-white cursor-pointer">
          <Link href="/student/wishlist" className="flex items-center space-x-2 w-full">
            <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
            <span>Wishlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-blue-800 focus:bg-blue-800 text-white cursor-pointer">
          <Link href="/student/settings" className="flex items-center space-x-2 w-full">
            <FontAwesomeIcon icon={faGear} className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-blue-700" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="hover:bg-blue-800 focus:bg-blue-800 text-white cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faSignOut} className="h-4 w-4" />
            <span>Sign Out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
