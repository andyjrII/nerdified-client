"use client";

import { useCallback, useEffect, useState } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import Moment from "react-moment";
import { FaClock, FaEnvelope, FaPhone, FaUserGraduate } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import db from "@/utils/localBase";
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

  const fetchEmail = useCallback(async () => {
    try {
      const data = await db.collection("auth_student").get();
      if (data.length > 0) {
        setEmail(data[0].email);
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  }, []);

  const fetchStudent = useCallback(async () => {
    try {
      const response = await axiosPrivate.get(`students/${email}`);
      const studentData = response?.data;
      await db.collection("student").doc(email).set(studentData);
      setStudent(studentData);
    } catch (error) {
      console.error("Failed to fetch student data from server.");
      try {
        const localStudent = await db.collection("student").doc(email).get();
        setStudent(localStudent);
      } catch (localError) {
        console.error("Error fetching from localBase:", localError);
      }
    }
  }, [axiosPrivate, email]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail();
      } catch (error) {
        console.log("Error during initialization:", error);
      }
    };
    initialize();
  }, [fetchEmail]);

  useEffect(() => {
    if (!email) return;
    const loadStudent = async () => {
      try {
        await fetchStudent();
      } catch (error) {
        console.log("Error fetching student:", error);
      }
    };
    loadStudent();
  }, [email, fetchStudent]);

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
