"use client";

import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FcLock } from "react-icons/fc";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useStudent } from "@/hooks/useStudent";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const PasswordChange = () => {
  const axiosPrivate = useAxiosPrivate();
  const errRef = useRef<HTMLParagraphElement>(null);
  const { student, setStudent } = useStudent();
  const studentId = student.id;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [validNewPassword, setValidNewPassword] = useState(false);
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirm, setValidConfirm] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidNewPassword(PASSWORD_REGEX.test(newPassword));
    setValidConfirm(newPassword === confirmPassword && confirmPassword !== "");
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const v1 = PASSWORD_REGEX.test(newPassword);
    if (!v1) {
      setErrMsg("Invalid Entry");
      errRef.current?.focus();
      setLoading(false);
      return;
    }

    try {
      const response = await axiosPrivate.patch(
        "auth/password",
        JSON.stringify({
          studentId,
          oldPassword,
          newPassword,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setStudent(response?.data);
      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: "Your password has been changed successfully!",
        confirmButtonText: "OK",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Invalid Credentials");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else if (err.response?.status === 403) {
        setErrMsg("Invalid Password");
      } else {
        setErrMsg("Update Failed");
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errMsg || "Something went wrong!",
        confirmButtonText: "OK",
      });
      errRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Password Change</CardTitle>
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
            <Label htmlFor="oldPassword">Old Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FcLock className="w-5 h-5" />
              </div>
              <Input
                id="oldPassword"
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FcLock className="w-5 h-5" />
              </div>
              <Input
                id="newPassword"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setNewPasswordFocus(true)}
                onBlur={() => setNewPasswordFocus(false)}
                required
                className={`pl-10 ${
                  newPassword &&
                  (validNewPassword ? "border-green-500" : "border-red-500")
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {validNewPassword ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                ) : newPassword ? (
                  <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                ) : null}
              </div>
            </div>
            {newPasswordFocus && !validNewPassword && newPassword && (
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters. Must include uppercase & lowercase letters, a
                number & a special character. Allowed special characters: ! @ #
                $ %
              </p>
            )}
          </div>

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
            disabled={!validNewPassword || !validConfirm || loading}
          >
            {loading ? <SyncLoader size={8} color="#ffffff" /> : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordChange;
