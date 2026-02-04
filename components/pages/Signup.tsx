"use client";

import { useRef, useState, useEffect, startTransition } from "react";
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
  FcHome,
  FcPhone,
  FcImageFile,
} from "react-icons/fc";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { setAuthStudent } from "@/utils/authStorage";
import { useAuth } from "@/hooks/useAuth";
import { setAuthSessionCookie } from "@/utils/authCookie";
import Swal from "sweetalert2";
import Image from "next/image";
const DPDefault = "/images/navpages/person_profile.jpg";
import { SyncLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const NAME_REGEX = /[A-z-]{3,20}$/;
const PHONE_REGEX = /[0-9]{11}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Signup = () => {
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

  const [address, setAddress] = useState("");
  const [validAddress, setValidAddress] = useState(false);
  const [addressFocus, setAddressFocus] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phone));
  }, [phone]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidConfirm(password === confirmPassword && confirmPassword !== "");
  }, [password, confirmPassword]);

  useEffect(() => {
    setValidAddress(NAME_REGEX.test(address));
  }, [address]);

  useEffect(() => {
    setErrMsg("");
  }, [name, phone, email, password, confirmPassword, address]);

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
    const v4 = PHONE_REGEX.test(phone);
    const v5 = NAME_REGEX.test(address);

    if (!v1 || !v2 || !v3 || !v4 || !v5) {
      setErrMsg("Invalid Entry");
      errRef.current?.focus();
      setLoading(false);
      return;
    }

    // Validate image is provided
    if (!image) {
      setErrMsg("Profile image is required");
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Profile image is required",
        confirmButtonText: "OK",
        showConfirmButton: true,
        confirmButtonColor: "#ef4444",
      });
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting signup for:", email);
      console.log("API Base URL:", process.env.NEXT_PUBLIC_BASE_URL);
      console.log("Image file:", image?.name, image?.size);
      
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

      console.log("Signup response:", response);

      // Validate response has access_token
      if (!response?.data?.access_token) {
        console.error("No access_token in response:", response?.data);
        throw new Error("Invalid response from server - no access token received");
      }

      const accessToken = response.data.access_token;
      setAuthStudent({ email, accessToken });
      setAuth({ email, accessToken });

      // Set frontend-domain cookie so middleware allows access when API is on another origin (e.g. Render)
      setAuthSessionCookie();

      Swal.fire({
        icon: "success",
        title: "Signup Success",
        text: "You have successfully signed up!",
        confirmButtonText: "OK",
      });

      startTransition(() => router.push("/student"));
    } catch (err: any) {
      console.error("Signup error:", err);
      let errorMessage = "Registration Failed";
      
      if (!err?.response) {
        errorMessage = "No Server Response - Check your connection and backend server";
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || "Invalid request - " + (err.response?.data?.message || "Check all fields are filled correctly");
      } else if (err.response?.status === 409) {
        errorMessage = "Email Already Exists";
      } else if (err.response?.status === 500) {
        errorMessage = "Server Error - " + (err.response?.data?.message || "Please try again later");
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
            <div className="mx-auto w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <FcBusinessman className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Student Registration
            </CardTitle>
            <p
              ref={errRef}
              className={`text-center text-sm text-red-600 mt-2 ${
                errMsg ? "block" : "hidden"
              }`}
              aria-live="assertive"
            >
              {errMsg}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FcBusinessman className="w-5 h-5" />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Names"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setNameFocus(true)}
                        onBlur={() => setNameFocus(false)}
                        autoComplete="off"
                        required
                        className={`pl-10 ${
                          name && (validName ? "border-green-500" : "border-red-500")
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validName ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : name ? (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    {nameFocus && name && !validName && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Last Name followed by Other Names e.g. Andy James
                      </p>
                    )}
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
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        autoComplete="off"
                        required
                        className={`pl-10 ${
                          email && (validEmail ? "border-green-500" : "border-red-500")
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validEmail ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : email ? (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    {emailFocus && email && !validEmail && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Enter a valid Email address e.g. andyjames@gmail.com
                      </p>
                    )}
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
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        required
                        className={`pl-10 ${
                          password &&
                          (validPassword ? "border-green-500" : "border-red-500")
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validPassword ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : password ? (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    {passwordFocus && !validPassword && password && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters. Must include uppercase, lowercase, number and special
                        character (!@#$%)
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FcLock className="w-5 h-5" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setConfirmFocus(true)}
                        onBlur={() => setConfirmFocus(false)}
                        required
                        className={`pl-10 ${
                          confirmPassword &&
                          (validConfirm ? "border-green-500" : "border-red-500")
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validConfirm && confirmPassword ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : confirmPassword ? (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    {confirmFocus && !validConfirm && confirmPassword && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FcHome className="w-5 h-5" />
                      </div>
                      <Input
                        id="address"
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onFocus={() => setAddressFocus(true)}
                        onBlur={() => setAddressFocus(false)}
                        autoComplete="off"
                        required
                        className={`pl-10 ${
                          address &&
                          (validAddress ? "border-green-500" : "border-red-500")
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validAddress ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : address ? (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    {addressFocus && address && !validAddress && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Enter a valid Address - City, State & Country.
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FcPhone className="w-5 h-5" />
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setPhoneFocus(true)}
                        onBlur={() => setPhoneFocus(false)}
                        autoComplete="off"
                        required
                        className={`pl-10 ${
                          phone && (validPhone ? "border-green-500" : "border-red-500")
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validPhone ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : phone ? (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    {phoneFocus && phone && !validPhone && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Enter a valid Phone Number.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                      <Image
                        src={imagePreview || DPDefault}
                        alt="Profile Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type="file"
                        id="file-input"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="hidden"
                      />
                      <Label
                        htmlFor="file-input"
                        className="cursor-pointer flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <FcImageFile className="w-5 h-5" />
                        <span>{imageFile || "Choose an image"}</span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  type="submit"
                  className="w-full md:w-1/2 bg-blue-900 hover:bg-blue-800"
                  disabled={
                    !validName ||
                    !validPhone ||
                    !validEmail ||
                    !validPassword ||
                    !validConfirm ||
                    !validAddress ||
                    loading
                  }
                >
                  {loading ? (
                    <SyncLoader size={8} color="#ffffff" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Signup;
