"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FcLock,
  FcAddressBook,
  FcBusinessman,
  FcPhone,
  FcImageFile,
  FcDocument,
} from "react-icons/fc";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import db from "@/utils/localBase";
import { useAuth } from "@/hooks/useAuth";
import Swal from "sweetalert2";
import Image from "next/image";
const DPDefault = "/images/navpages/person_profile.jpg";
import { SyncLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const NAME_REGEX = /[A-z-]{3,20}$/;
const PHONE_REGEX = /[0-9]{11}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const TutorSignup = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const errRef = useRef<HTMLParagraphElement>(null);

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirm, setValidConfirm] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidPhone(phone ? PHONE_REGEX.test(phone) : true); // Optional for tutors
  }, [phone]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidConfirm(password === confirmPassword && confirmPassword !== "");
  }, [password, confirmPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [name, phone, email, password, confirmPassword]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageFile(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const v1 = EMAIL_REGEX.test(email);
    const v2 = PASSWORD_REGEX.test(password);
    const v3 = NAME_REGEX.test(name);
    const v4 = !phone || PHONE_REGEX.test(phone); // Phone is optional

    if (!v1 || !v2 || !v3 || !v4) {
      setErrMsg("Invalid Entry");
      errRef.current?.focus();
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrMsg("Passwords do not match");
      errRef.current?.focus();
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting tutor signup for:", email);
      console.log("API Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (phone) {
        formData.append("phoneNumber", phone);
      }
      if (bio) {
        formData.append("bio", bio);
      }
      if (qualifications) {
        formData.append("qualifications", qualifications);
      }
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post("auth/tutor/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log("Tutor signup response:", response);

      // Validate response has access_token
      // Tutor signup returns Tokens object (not [Tokens, boolean] like signin)
      if (!response?.data?.access_token) {
        console.error("No access_token in response:", response?.data);
        throw new Error("Invalid response from server - no access token received");
      }

      const accessToken = response.data.access_token;
      // Tutors start with approved: false (need admin approval)
      const isApproved = false;

      // Save to local storage
      await db
        .collection("auth_tutor")
        .doc(email)
        .set({ email, accessToken });
      setAuth({ email, accessToken });

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: isApproved
          ? "Your tutor account has been created and approved!"
          : "Your tutor account has been created and is pending admin approval. You'll be notified once approved.",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#a855f7",
      });

      if (isApproved) {
        router.push("/tutor");
      } else {
        router.push("/signin"); // Redirect to signin if pending approval
      }
    } catch (err: any) {
      console.error("Tutor signup error:", err);
      let errorMessage = "Registration Failed";

      if (!err?.response) {
        errorMessage = "No Server Response - Check your connection and backend server";
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response?.data?.message ||
          "Invalid request - Check all fields are filled correctly";
      } else if (err.response?.status === 409) {
        errorMessage = "Email Already Exists";
      } else if (err.response?.status === 500) {
        errorMessage =
          "Server Error - " +
          (err.response?.data?.message || "Please try again later");
      } else {
        errorMessage = err.response?.data?.message || "Registration Failed";
      }

      setErrMsg(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        confirmButtonText: "OK",
      });
      errRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <FcBusinessman className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Tutor Registration</CardTitle>
            <p className="text-gray-600 mt-2">
              Create your tutor account to start teaching
            </p>
            <Badge variant="outline" className="mt-2 mx-auto w-fit">
              ⓘ Account requires admin approval
            </Badge>
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

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                      {validName && name && (
                        <span className="text-green-600 ml-2">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                      {(name && !validName) && (
                        <span className="text-red-600 ml-2">
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FcBusinessman className="w-5 h-5" />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setNameFocus(true)}
                        onBlur={() => setNameFocus(false)}
                        required
                        className="pl-10"
                      />
                    </div>
                    {nameFocus && name && !validName && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        3-20 characters, letters and hyphens only
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                      {validEmail && email && (
                        <span className="text-green-600 ml-2">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                      {email && !validEmail && (
                        <span className="text-red-600 ml-2">
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FcAddressBook className="w-5 h-5" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        required
                        className="pl-10"
                      />
                    </div>
                    {emailFocus && email && !validEmail && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must be a valid email address
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FcPhone className="w-5 h-5" />
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number (11 digits)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setPhoneFocus(true)}
                        onBlur={() => setPhoneFocus(false)}
                        className="pl-10"
                      />
                    </div>
                    {phoneFocus && phone && !validPhone && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        11 digits required if provided
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                      {validPassword && password && (
                        <span className="text-green-600 ml-2">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                      {password && !validPassword && (
                        <span className="text-red-600 ml-2">
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FcLock className="w-5 h-5" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        required
                        className="pl-10"
                      />
                    </div>
                    {passwordFocus && password && !validPassword && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8-24 characters, must include uppercase, lowercase, number, and special
                        character
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                      {validConfirm && confirmPassword && (
                        <span className="text-green-600 ml-2">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                      {confirmPassword && !validConfirm && (
                        <span className="text-red-600 ml-2">
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FcLock className="w-5 h-5" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setConfirmFocus(true)}
                        onBlur={() => setConfirmFocus(false)}
                        required
                        className="pl-10"
                      />
                    </div>
                    {confirmFocus && confirmPassword && !validConfirm && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match password
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className="space-y-4">
                  {/* Image */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Profile Picture (Optional)</Label>
                    <div className="relative">
                      <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 mb-4">
                        <Image
                          src={imagePreview || DPDefault}
                          alt="Profile preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="image"
                        className="cursor-pointer flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <FcImageFile className="w-5 h-5" />
                        <span>{imageFile || "Choose an image"}</span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio - Spans Both Columns */}
              <div className="mt-6 space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself and your teaching experience..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="resize-none w-full"
                />
              </div>

              {/* Qualifications - Spans Both Columns */}
              <div className="mt-6 space-y-2 md:col-span-2">
                <Label htmlFor="qualifications">Qualifications (Optional)</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3">
                    <FcDocument className="w-5 h-5" />
                  </div>
                  <Textarea
                    id="qualifications"
                    placeholder="List your qualifications, certifications, degrees..."
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    rows={3}
                    className="resize-none pl-10 w-full"
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  type="submit"
                  className="w-full md:w-1/2 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={loading || !validName || !validEmail || !validPassword || !validConfirm}
                >
                  {loading ? (
                    <SyncLoader size={8} color="#ffffff" />
                  ) : (
                    "Register as Tutor"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/signin" className="text-purple-600 hover:text-purple-800 font-medium">
                  Sign In
                </Link>
              </p>
              <p className="text-gray-600 mt-2">
                Want to learn instead?{" "}
                <Link href="/signup/student" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign up as Student
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TutorSignup;
