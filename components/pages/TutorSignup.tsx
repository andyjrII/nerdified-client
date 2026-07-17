"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { useTutorAuth } from "@/hooks/useTutorAuth";
import { setAuthSessionCookie } from "@/utils/authCookie";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaImage,
  FaCheckCircle,
  FaRegCircle,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DPDefault = "/images/navpages/person_profile.jpg";

const NAME_REGEX = /[A-z-]{3,20}$/;
const PHONE_REGEX = /[0-9]{11}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const TutorSignup = () => {
  const router = useRouter();
  const { setAuth } = useTutorAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validName = NAME_REGEX.test(name);
  const validPhone = !phone || PHONE_REGEX.test(phone); // optional for tutors
  const validEmail = EMAIL_REGEX.test(email);
  const validPassword = PASSWORD_REGEX.test(password);
  const validConfirm = password === confirmPassword && confirmPassword !== "";

  const pwChecks = [
    { label: "8+ chars", ok: password.length >= 8 },
    { label: "Mixed case", ok: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Symbol", ok: /[!@#$%]/.test(password) },
  ];

  useEffect(() => {
    setErrMsg("");
  }, [name, phone, email, password, confirmPassword]);

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

    if (!validEmail || !validPassword || !validName || !validPhone) {
      setErrMsg("Please fill every required field correctly.");
      setLoading(false);
      return;
    }
    if (!validConfirm) {
      setErrMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (phone) formData.append("phoneNumber", phone);
      if (bio) formData.append("bio", bio);
      if (qualifications) formData.append("qualifications", qualifications);
      if (image) formData.append("image", image);

      const response = await axios.post("auth/tutor/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const data = response?.data;
      if (!data?.email || data?.role !== "TUTOR") {
        throw new Error("Invalid response from server");
      }

      setAuth({ email: data.email, role: data.role });

      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your tutor account has been created and is pending admin approval. You'll be notified once approved.",
        confirmButtonText: "OK",
        confirmButtonColor: "#7c3aed",
      });

      // Tutors start pending approval — send them to sign in.
      startTransition(() => router.push("/signin"));
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

  const canSubmit = validName && validEmail && validPassword && validConfirm && validPhone;

  return (
    <AuthShell
      altText="Already have an account?"
      altLabel="Sign in"
      altHref="/signin"
      wide
      fitViewport
      topLeft={
        <Link href="/signup" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <FaArrowLeft className="h-3 w-3" /> Change account type
        </Link>
      }
    >
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          Create your tutor account
        </h1>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500">
          Teach live, expert-led classes.
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
            <FaInfoCircle className="h-3 w-3" /> Requires admin approval
          </span>
        </p>

        {errMsg && (
          <p aria-live="assertive" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {errMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-2">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Left: fields */}
            <div className="space-y-1">
              <div className="space-y-0.5">
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

              <div className="space-y-0.5">
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

              <div className="space-y-0.5">
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
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 pt-1">
                  {pwChecks.map(({ label, ok }) => (
                    <span
                      key={label}
                      className={`flex items-center gap-1 text-[11px] ${ok ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      {ok ? <FaCheckCircle className="h-3 w-3" /> : <FaRegCircle className="h-3 w-3" />}
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-0.5">
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
            </div>

            {/* Right: image (grows to fill) + phone pinned to the bottom, aligning with Confirm password */}
            <div className="flex flex-col">
              <Label className="text-sm font-medium text-slate-700">
                Profile picture <span className="font-normal text-slate-400">(optional)</span>
              </Label>
              <div className="relative mt-1 w-full flex-1 min-h-[7rem] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
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
                id="tutor-file-input"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="tutor-file-input"
                className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 p-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
              >
                <FaImage className="h-4 w-4 text-violet-500" />
                <span className="truncate">{imageFile || "Choose a profile picture"}</span>
              </label>

              <div className="mt-2 space-y-1">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                  Phone number <span className="font-normal text-slate-400">(optional)</span>
                </Label>
                <AuthField
                  id="phone"
                  type="tel"
                  placeholder="11-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<FaPhone className="h-4 w-4" />}
                  autoComplete="tel"
                />
              </div>
            </div>
          </div>

          {/* Bio + qualifications, optional — collapsed by default to keep the form compact */}
          {!showExtra && (
            <button
              type="button"
              onClick={() => setShowExtra(true)}
              className="mt-2 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              + Add bio &amp; qualifications <span className="font-normal text-slate-400">(optional)</span>
            </button>
          )}
          {showExtra && (
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <div className="space-y-0.5">
              <Label htmlFor="bio" className="text-sm font-medium text-slate-700">
                Bio <span className="font-normal text-slate-400">(optional)</span>
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell learners about yourself and your teaching experience…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="resize-none rounded-lg border-slate-200 text-sm"
              />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="qualifications" className="text-sm font-medium text-slate-700">
                Qualifications <span className="font-normal text-slate-400">(optional)</span>
              </Label>
              <Textarea
                id="qualifications"
                placeholder="Certifications, degrees, and relevant experience…"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                rows={2}
                className="resize-none rounded-lg border-slate-200 text-sm"
              />
            </div>
          </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <SyncLoader size={8} color="#ffffff" /> : "Create Tutor Account"}
          </button>
          <p className="mt-2 text-center text-xs text-slate-400">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-indigo-600 hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </AuthShell>
  );
};

export default TutorSignup;
