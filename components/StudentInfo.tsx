"use client";

import { useEffect, useState } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import Moment from "react-moment";
import { FaClock, FaEnvelope, FaPhone } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import db from "@/utils/localBase";
import Welcome from "./Welcome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Student {
  email?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: string;
  name?: string;
}

const StudentInfo = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState<string>("");
  const [student, setStudent] = useState<Student>({});

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail();
        if (email) {
          await fetchStudent();
        }
      } catch (error) {
        console.log("Error during initialization:", error);
      }
    };
    initialize();
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

  const fetchStudent = async () => {
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
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {student.email && (
            <Button variant="outline" className="flex items-center gap-2">
              {student.email}
              <Badge className="bg-blue-900 text-white">
                <FaEnvelope className="h-3 w-3" />
              </Badge>
            </Button>
          )}
          {student.phoneNumber && (
            <Button variant="outline" className="flex items-center gap-2">
              {student.phoneNumber}
              <Badge className="bg-blue-900 text-white">
                <FaPhone className="h-3 w-3" />
              </Badge>
            </Button>
          )}
          {student.address && (
            <Button variant="outline" className="flex items-center gap-2">
              {student.address}
              <Badge className="bg-blue-900 text-white">
                <IoLocation className="h-3 w-3" />
              </Badge>
            </Button>
          )}
          {student.createdAt && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              title="Date Joined"
            >
              <Moment format="MMMM D, YYYY">{student.createdAt}</Moment>
              <Badge className="bg-blue-900 text-white">
                <FaClock className="h-3 w-3" />
              </Badge>
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl px-4">
          <Welcome name={student.name} />
        </div>
      </div>
    </>
  );
};

export default StudentInfo;
