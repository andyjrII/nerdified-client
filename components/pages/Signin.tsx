"use client";

import { useRef, useState, useEffect, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { useTutorAuth } from "@/hooks/useTutorAuth";
import { FcLock, FcAddressBook } from "react-icons/fc";
import {
  setAuthStudent,
  setAuthTutor,
  clearAuthStudent,
  clearStudentProfile,
  clearAuthTutor,
  clearTutorProfile,
} from "@/utils/authStorage";
import { setAuthSessionCookie } from "@/utils/authCookie";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

type UserRole = "student" | "tutor";

const Signin = () => {
  const { setAuth } = useAuth();
  const { setAuth: setTutorAuth } = useTutorAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    // Validate inputs
    if (!email || !password) {
      setErrMsg("Email and password are required");
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Email and password are required",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#3b82f6",
      });
      setLoading(false);
      return;
    }

    try {
      console.log(`Attempting ${role} signin for:`, email);
      console.log("API Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

      // Unified sign-in: single endpoint with role in body
      const apiRole = role === "student" ? "STUDENT" : "TUTOR";
      const response = await axios.post(
        "auth/signin",
        { email, password, role: apiRole },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Signin response:", response);

      const data = response?.data;
      const accessToken = data?.access_token;
      const isApproved = data?.approved !== false;

      if (!accessToken) {
        console.error("No access_token in response:", response?.data);
        throw new Error("Invalid response from server - no access token received");
      }

      if (role === "student") {
        setAuthStudent({ email, accessToken });
        setAuth({ email, accessToken });
      } else {
        setAuthTutor({ email, accessToken });
        setTutorAuth({ email, accessToken });

        // Show approval status message for tutors
        if (!isApproved) {
          Swal.fire({
            icon: "warning",
            title: "Account Pending Approval",
            text: "Your tutor account is pending admin approval. You'll be notified once approved.",
            confirmButtonText: "OK",
          });
          setLoading(false);
          return;
        }
      }

      // Set frontend-domain cookie so middleware allows access when API is on another origin (e.g. Render)
      setAuthSessionCookie();

      // Handle redirect
      const course = searchParams.get("course")
        ? JSON.parse(searchParams.get("course")!)
        : null;

      if (course) {
        router.back();
      } else {
        Swal.fire({
          icon: "success",
          title: "Signin Success",
          text: `You have successfully signed in as a ${role}!`,
          confirmButtonText: "OK",
          showConfirmButton: true,
          confirmButtonColor: "#3b82f6",
        });
        
        // Redirect based on role (startTransition keeps UI responsive)
        startTransition(() => {
          if (role === "student") {
            router.push("/student");
          } else {
            router.push("/tutor");
          }
        });
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      let errorMessage = "Signin Failed";

      if (!err?.response) {
        errorMessage = "No Server Response - Check your connection";
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response?.data?.message || "Missing Email or Password";
      } else if (err.response?.status === 401) {
        errorMessage =
          err.response?.data?.message || "Invalid email or password";
      } else if (err.response?.status === 404) {
        errorMessage = `${role === "student" ? "Student" : "Tutor"} not found`;
      } else {
        errorMessage = err.response?.data?.message || "Signin Failed";
      }

      setErrMsg(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Signin Failed",
        text: errorMessage,
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
      errRef.current?.focus();
      // Clear any stale auth so nav shows Sign In instead of profile
      if (role === "student") {
        setAuth({ email: null, accessToken: null });
        clearAuthStudent();
        clearStudentProfile();
      } else {
        setTutorAuth({ email: null, accessToken: null });
        clearAuthTutor();
        clearTutorProfile();
      }
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <FcLock className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <p className="text-sm text-gray-600">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent>
            <p
              ref={errRef}
              className={`text-center text-sm text-red-600 mb-4 ${
                errMsg ? "block" : "hidden"
              }`}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector */}
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <FaUserGraduate className="w-4 h-4" />
                        <span>Student</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="tutor">
                      <div className="flex items-center gap-2">
                        <FaChalkboardTeacher className="w-4 h-4" />
                        <span>Tutor</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <FcAddressBook className="w-5 h-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    ref={emailRef}
                    autoComplete="off"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <FcLock className="w-5 h-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="text-right">
                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800"
                disabled={loading}
              >
                {loading ? (
                  <SyncLoader size={8} color="#ffffff" />
                ) : (
                  `Sign in as ${role === "student" ? "Student" : "Tutor"}`
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                  Register
                </Link>
              </p>
              {role === "tutor" && (
                <Badge variant="outline" className="mt-2 text-xs">
                  ⓘ Tutor accounts require admin approval
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Signin;
