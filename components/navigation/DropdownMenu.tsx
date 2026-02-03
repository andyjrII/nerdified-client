"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faGear,
  faUser,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useStudent } from "@/hooks/useStudent";
import { useLogout } from "@/hooks/useLogout";
const DPDefault = "/images/navpages/person_profile.jpg";
import db from "@/utils/localBase";
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
    const initializeData = async () => {
      try {
        const data = await db.collection("auth_student").get();
        if (data.length > 0) {
          setEmail(data[0].email);
        }
      } catch (error) {
        console.error("Error fetching email from localBase:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (email) {
      const fetchStudent = async () => {
        try {
          const response = await axiosPrivate.get(`students/${email}`);
          setStudent(response?.data);
        } catch (error) {
          console.error("Error fetching Student Profile:", error);
          // Fallback: Fetch from Localbase if server fails
          try {
            const localStudent = await db
              .collection("student")
              .doc(email)
              .get();
            setStudent(localStudent);
          } catch (localError) {
            console.error("Error fetching from localBase:", localError);
          }
        }
      };

      fetchStudent();
    }
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
            src={profileImageError ? DPDefault : (student.imagePath || DPDefault)}
            alt="Student"
            width={36}
            height={36}
            className="rounded-full object-cover"
            onError={() => setProfileImageError(true)}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-blue-900 text-white border-blue-700">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {student.name || "Student Name"}
            </p>
            <p className="text-xs leading-none text-gray-400">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-700" />
        <DropdownMenuItem asChild className="hover:bg-blue-800 focus:bg-blue-800 text-white cursor-pointer">
          <Link href="/student" className="flex items-center space-x-2 w-full">
            <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
            <span>Profile</span>
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
          <Link href="/student/picture" className="flex items-center space-x-2 w-full">
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
