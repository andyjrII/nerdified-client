"use client";

import { useRef, useState, useEffect, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/api/axios";
import { useAuth } from "@/hooks/useAuth";
import {
  clearAuthStudent,
  clearStudentProfile,
  clearAuthTutor,
  clearTutorProfile,
} from "@/utils/authStorage";
import { setAuthSessionCookie } from "@/utils/authCookie";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import { FcGoogle } from "react-icons/fc";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import { Label } from "@/components/ui/label";

type UserRole = "student" | "tutor";

const roles: { value: UserRole; label: string; icon: typeof FaUserGraduate }[] = [
  { value: "student", label: "Student", icon: FaUserGraduate },
  { value: "tutor", label: "Tutor", icon: FaChalkboardTeacher },
];

const Signin = () => {
  const { setAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [role, setRole] = useState<UserRole>("student");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Surface errors from an aborted/failed Google sign-in redirect.
  useEffect(() => {
    const oauthError = searchParams.get("oauth_error");
    if (!oauthError) return;
    const messages: Record<string, string> = {
      unavailable: "Google sign-in isn't configured yet. Please use email and password.",
      cancelled: "Google sign-in was cancelled.",
      invalid_role: "Google sign-in failed: invalid account type.",
      invalid_state: "Google sign-in expired. Please try again.",
      google_failed: "Google sign-in failed. Please try again.",
      email_unverified: "Your Google email address isn't verified.",
      session_failed: "Couldn't complete Google sign-in. Please try again.",
    };
    setErrMsg(messages[oauthError] ?? "Google sign-in failed. Please try again.");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const handleGoogleSignin = () => {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3100/api";
    const apiRole = role === "student" ? "STUDENT" : "TUTOR";
    window.location.href = `${base}/auth/google?role=${apiRole}`;
  };

  useEffect(() => {
    setErrMsg("");
  }, [email, password, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!email || !password) {
      setErrMsg("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const apiRole = role === "student" ? "STUDENT" : "TUTOR";
      const response = await axios.post(
        "auth/signin",
        { email, password, role: apiRole },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const data = response?.data;
      const isApproved = data?.approved !== false;
      const responseEmail = data?.email ?? email;
      const responseRole = data?.role === "STUDENT" ? "STUDENT" : "TUTOR";

      if (!responseEmail || !responseRole) {
        throw new Error("Invalid response from server");
      }

      setAuth({ email: responseEmail, role: responseRole });

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

      setAuthSessionCookie(responseRole);

      const course = searchParams.get("course")
        ? JSON.parse(searchParams.get("course")!)
        : null;

      if (course) {
        router.back();
      } else {
        startTransition(() => {
          router.push(role === "student" ? "/student" : "/tutor");
        });
      }
    } catch (err: any) {
      let errorMessage = "Signin Failed";
      if (!err?.response) {
        errorMessage = "No Server Response - Check your connection";
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || "Missing Email or Password";
      } else if (err.response?.status === 401) {
        errorMessage = err.response?.data?.message || "Invalid email or password";
      } else if (err.response?.status === 404) {
        errorMessage = `${role === "student" ? "Student" : "Tutor"} not found`;
      } else {
        errorMessage = err.response?.data?.message || "Signin Failed";
      }
      setErrMsg(errorMessage);
      errRef.current?.focus();
      setAuth({ email: null, role: null });
      clearAuthStudent();
      clearStudentProfile();
      clearAuthTutor();
      clearTutorProfile();
    }
    setLoading(false);
  };

  return (
    <AuthShell altText="Don't have an account?" altLabel="Sign up" altHref="/signup">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back <span className="align-middle">👋</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to continue your learning journey.
        </p>

        {/* Role toggle */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          {roles.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${
                role === value
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {errMsg && (
          <p
            ref={errRef}
            aria-live="assertive"
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {errMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email address
            </Label>
            <AuthField
              id="email"
              ref={emailRef}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<FaEnvelope className="h-4 w-4" />}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </Link>
            </div>
            <AuthField
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<FaLock className="h-4 w-4" />}
              autoComplete="current-password"
              required
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
            />
            Remember me
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-70"
          >
            {loading ? <SyncLoader size={8} color="#ffffff" /> : "Sign In"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">or continue with</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <FcGoogle className="h-5 w-5" /> Continue with Google
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </AuthShell>
  );
};

export default Signin;
