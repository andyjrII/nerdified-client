"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FcLock, FcAddressBook, FcBusinessman } from "react-icons/fc";
import db from "@/utils/localBase";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const NAME_REGEX = /[A-z-]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const CreateAdmin = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const router = useRouter();
  const errRef = useRef<HTMLParagraphElement>(null);

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirm, setValidConfirm] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [role, setRole] = useState<string>("SUB");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await db.collection("auth_admin").get();
        if (data.length > 0) {
          setRole(data[0].role || "SUB");
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    fetchRole();
  }, []);

  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidConfirm(password === confirmPassword && confirmPassword !== "");
  }, [password, confirmPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [name, email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const v1 = EMAIL_REGEX.test(email);
    const v2 = PASSWORD_REGEX.test(password);
    const v3 = NAME_REGEX.test(name);

    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      errRef.current?.focus();
      return;
    }

    try {
      await axiosPrivate.post(
        "admin/register",
        JSON.stringify({
          name,
          email,
          password,
          role,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Admin Created",
        text: `Admin Created! Name: ${name}, Email: ${email}`,
        confirmButtonText: "OK",
      });

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.push("/admins");
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Email Already Exists");
      } else {
        setErrMsg("Registration Failed");
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errMsg || "Registration Failed!",
        confirmButtonText: "OK",
      });
      errRef.current?.focus();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Add Admin</h1>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <FcBusinessman className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Admin Registration
            </CardTitle>
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
                      email &&
                      (validEmail ? "border-green-500" : "border-red-500")
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
                    8 to 24 characters. Must include uppercase & lowercase
                    letters, a number & a special character. Allowed special
                    characters: ! @ # $ %
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

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800"
                disabled={!validName || !validEmail || !validPassword || !validConfirm}
              >
                Submit Form
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAdmin;
