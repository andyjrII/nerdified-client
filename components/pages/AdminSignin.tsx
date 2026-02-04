"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/api/axios";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { FcLock, FcAddressBook } from "react-icons/fc";
import { setAuthAdmin } from "@/utils/authStorage";
import { setAuthSessionCookie } from "@/utils/authCookie";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AdminSignin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const errRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "auth/admin/signin",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data[0]?.access_token;
      const role = response?.data[1]; // SUPER_ADMIN | SUB_ADMIN
      setAuthAdmin({ email, accessToken, role });
      setAdmin({ email, accessToken, role });

      setAuthSessionCookie();

      Swal.fire({
        icon: "success",
        title: "Signin Success",
        text: "You have successfully signed in!",
        confirmButtonText: "OK",
      });
      router.push(from);
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Incorrect Password or Email!");
      } else {
        setErrMsg("Signin Failed");
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errMsg || "Signin Failed!",
        confirmButtonText: "OK",
      });
      errRef.current?.focus();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <FcLock className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Signin</CardTitle>
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

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800"
              >
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminSignin;
