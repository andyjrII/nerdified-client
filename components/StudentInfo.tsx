"use client";

import { useEffect, useState } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import Moment from "react-moment";
import { FaClock, FaEnvelope, FaPhone, FaUserGraduate } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import { getAuthStudent, getStudentProfile, setStudentProfile } from "@/utils/authStorage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Student {
  email?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: string;
  name?: string;
  imagePath?: string;
}

const StudentInfo = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState<string>("");
  const [student, setStudent] = useState<Student>({});

  const fetchEmail = () => {
    const data = getAuthStudent();
    if (data?.email) setEmail(data.email);
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  useEffect(() => {
    if (email) fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when email changes
  }, [email]);

  const fetchStudent = async () => {
    try {
      const response = await axiosPrivate.get(`students/${email}`);
      const studentData = response?.data;
      if (studentData) setStudentProfile(studentData as Record<string, unknown>);
      setStudent(studentData);
    } catch (error) {
      console.error("Failed to fetch student data from server.");
      const cached = getStudentProfile();
      if (cached) setStudent(cached as Student);
    }
  };

  return (
    <Card className="shadow-lg mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full bg-blue-100 overflow-hidden">
            {student?.imagePath ? (
              <Image
                src={student.imagePath}
                alt={student.name || "Student"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUserGraduate className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {student?.name ? `Welcome, ${student.name}!` : "Welcome!"}
            </h2>
            <p className="text-gray-600">
              {student?.email || email}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          {student.phoneNumber && (
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <FaPhone className="h-3 w-3" />
              {student.phoneNumber}
            </Badge>
          )}
          {student.address && (
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <IoLocation className="h-3 w-3" />
              {student.address}
            </Badge>
          )}
          {student.createdAt && (
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <FaClock className="h-3 w-3" />
              Member since <Moment format="MMM YYYY">{student.createdAt}</Moment>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentInfo;
