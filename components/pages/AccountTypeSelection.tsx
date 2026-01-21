"use client";

import { useRouter } from "next/navigation";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AccountTypeSelection = () => {
  const router = useRouter();

  const handleSelection = (accountType: "student" | "tutor") => {
    if (accountType === "student") {
      router.push("/signup/student");
    } else {
      router.push("/signup/tutor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            SELECT YOUR ACCOUNT TYPE
          </h1>
          <p className="text-blue-200 text-lg">
            Choose the account type that best fits you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Card */}
          <Card
            className="bg-gray-900 border-2 border-gray-700 hover:border-blue-500 transition-all cursor-pointer transform hover:scale-105 shadow-2xl"
            onClick={() => handleSelection("student")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <FaUserGraduate className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Student
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-300 text-sm">
                Join courses, attend live sessions, and learn from expert tutors
              </p>
              <ul className="text-left text-gray-400 text-sm space-y-2 mt-4">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> Enroll in courses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> Book live sessions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> Access course materials
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> Interact with tutors
                </li>
              </ul>
              <Button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection("student");
                }}
              >
                Continue as Student →
              </Button>
            </CardContent>
          </Card>

          {/* Tutor Card */}
          <Card
            className="bg-gray-900 border-2 border-gray-700 hover:border-purple-500 transition-all cursor-pointer transform hover:scale-105 shadow-2xl"
            onClick={() => handleSelection("tutor")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <FaChalkboardTeacher className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Tutor
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-300 text-sm">
                Teach courses, create live sessions, and earn from your expertise
              </p>
              <ul className="text-left text-gray-400 text-sm space-y-2 mt-4">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Create courses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Schedule live sessions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Earn commissions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span> Manage students
                </li>
              </ul>
              <Button
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection("tutor");
                }}
              >
                Continue as Tutor →
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-blue-200">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/signin")}
              className="text-white font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelection;
