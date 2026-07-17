"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { setAuthSessionCookie } from "@/utils/authCookie";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHome,
  FaPhone,
  FaImage,
  FaCheckCircle,
  FaRegCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import { Label } from "@/components/ui/label";

const DPDefault = "/images/navpages/person_profile.jpg";

const NAME_REGEX = /[A-z-]{3,20}$/;
const PHONE_REGEX = /[0-9]{11}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Signup = () => {
  const router = useRouter();
  const { setAuth } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validName = NAME_REGEX.test(name);
  const validPhone = PHONE_REGEX.test(phone);
  const validEmail = EMAIL_REGEX.test(email);
  const validPassword = PASSWORD_REGEX.test(password);
  const validConfirm = password === confirmPassword && confirmPassword !== "";
  const validAddress = NAME_REGEX.test(address);

  const pwChecks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Upper & lowercase letters", ok: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "One number", ok: /[0-9]/.test(password) },
    { label: "One special character (!@#$%)", ok: /[!@#$%]/.test(password) },
  ];

  useEffect(() => {
    setErrMsg("");
  }, [name, phone, email, password, confirmPassword, address]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageFile(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!validEmail || !validPassword || !validName || !validPhone || !validAddress) {
      setErrMsg("Please fill every field correctly before continuing.");
      setLoading(false);
      return;
    }
    if (!validConfirm) {
      setErrMsg("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!image) {
      setErrMsg("A profile image is required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phoneNumber", phone);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("address", address);
      formData.append("image", image);

      const response = await axios.post("auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const data = response?.data;
      if (!data?.email || data?.role !== "STUDENT") {
        throw new Error("Invalid response from server");
      }

      setAuth({ email: data.email, role: data.role });
      setAuthSessionCookie(data.role);

      Swal.fire({
        icon: "success",
        title: "Welcome to Nerdified!",
        text: "Your account has been created.",
        confirmButtonText: "OK",
      });

      startTransition(() => router.push("/student"));
    } catch (err: any) {
      let errorMessage = "Registration Failed";
      if (!err?.response) {
        errorMessage = "No Server Response - check your connection.";
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || "Check all fields are filled correctly.";
      } else if (err.response?.status === 409) {
        errorMessage = "An account with this email already exists.";
      } else {
        errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      }
      setErrMsg(errorMessage);
    }
    setLoading(false);
  };

  const canSubmit =
    validName && validPhone && validEmail && validPassword && validConfirm && validAddress && !!image;

  return (
    <AuthShell altText="Already have an account?" altLabel="Sign in" altHref="/signin" wide>
      <div>
        <Link href="/signup" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <FaArrowLeft className="h-3 w-3" /> Change account type
        </Link>
        <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          Create your student account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Learn new skills and advance your career with live, expert-led classes.
        </p>

        {errMsg && (
          <p aria-live="assertive" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {errMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 grid gap-5 md:grid-cols-2">
          {/* Left: fields */}
          <div className="space-y-2.5">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full name</Label>
              <AuthField
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<FaUser className="h-4 w-4" />}
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
              <AuthField
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<FaEnvelope className="h-4 w-4" />}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <AuthField
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<FaLock className="h-4 w-4" />}
                autoComplete="new-password"
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
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1">
                {pwChecks.map(({ label, ok }) => (
                  <span
                    key={label}
                    className={`flex items-center gap-1.5 text-[11px] ${ok ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {ok ? <FaCheckCircle className="h-3 w-3" /> : <FaRegCircle className="h-3 w-3" />}
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirm" className="text-sm font-medium text-slate-700">Confirm password</Label>
              <AuthField
                id="confirm"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<FaLock className="h-4 w-4" />}
                autoComplete="new-password"
                required
                className={confirmPassword && !validConfirm ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
              {confirmPassword && !validConfirm && (
                <p className="text-[11px] text-red-500">Passwords don&apos;t match.</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="address" className="text-sm font-medium text-slate-700">Address</Label>
              <AuthField
                id="address"
                placeholder="City, State & Country"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                icon={<FaHome className="h-4 w-4" />}
                autoComplete="street-address"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone number</Label>
              <AuthField
                id="phone"
                type="tel"
                placeholder="11-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<FaPhone className="h-4 w-4" />}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          {/* Right: image + submit */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium text-slate-700">Profile image</Label>
            <div className="relative mt-1 h-36 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <Image
                src={imagePreview || DPDefault}
                alt="Profile preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-input"
              className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 p-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              <FaImage className="h-4 w-4 text-indigo-500" />
              <span className="truncate">{imageFile || "Choose a profile image"}</span>
            </label>

            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <SyncLoader size={8} color="#ffffff" /> : "Create Account"}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-indigo-600 hover:underline">Terms</Link> and{" "}
                <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </form>
      </div>
    </AuthShell>
  );
};

export default Signup;
