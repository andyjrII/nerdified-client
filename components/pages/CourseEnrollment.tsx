"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FcGlobe, FcCalendar } from "react-icons/fc";
import { FaClock } from "react-icons/fa";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { unformatCurrency } from "@/utils/unformatCurrency";
import PaystackPop from "@paystack/inline-js";
import Missing from "./Missing";
import { getAuthStudent } from "@/utils/authStorage";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const publicKey = "pk_test_244916c0bd11624711bdab398418c05413687296";

const CLASS_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

type ClassDay = (typeof CLASS_DAYS)[number];

const CourseEnrollment = () => {
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const errRef = useRef<HTMLParagraphElement>(null);
  const [selectedDays, setSelectedDays] = useState<ClassDay[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("MORNING");
  const [selectedMode, setSelectedMode] = useState<string>("ONLINE");
  const [errMsg, setErrMsg] = useState<string>("");
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const data = getAuthStudent();
    if (data?.email) setEmail(data.email);
    if (typeof window !== "undefined") {
      const storedCourse = localStorage.getItem("NERDVILLE_COURSE");
      if (storedCourse) setCourse(JSON.parse(storedCourse));
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [selectedDays]);

  const handleCheckboxChange = (day: ClassDay, checked: boolean) => {
    if (checked && selectedDays.length < 3) {
      setSelectedDays([...selectedDays, day]);
    } else if (!checked) {
      setSelectedDays(selectedDays.filter((item) => item !== day));
    } else {
      setErrMsg("Number of days should not be more than 3");
    }
  };

  const savePaymentInfo = async (reference: string) => {
    if (!course) return;

    try {
      const amount = unformatCurrency(String(course.price));
      await axiosPrivate.post(
        `students/enroll`,
        JSON.stringify({
          email,
          courseId: course.id,
          amount,
          reference,
          classDays: selectedDays,
          preferredTime: selectedTime,
          mode: selectedMode,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Credentials");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Enrollment Failed");
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errMsg || "Something went wrong!",
        confirmButtonText: "OK",
      });
      errRef.current?.focus();
    }
  };

  const handlePayment = async () => {
    if (!course || !email) return;

    const paystack = new PaystackPop();
    const amount = unformatCurrency(String(course.price));
    const courseTitle = course.title;

    paystack.newTransaction({
      key: publicKey,
      email,
      amount: amount * 100,
      metadata: {
        "Course Title": courseTitle,
      },
      onSuccess: async (response: any) => {
        const message =
          courseTitle +
          " payment complete! Thanks for enrolling with us! Check out our Other Courses!!";
        if (typeof window !== "undefined") {
          localStorage.setItem("PAYMENT_REFERENCE", response.reference);
        }
        await savePaymentInfo(response.reference);
        Swal.fire({
          icon: "success",
          title: "Payment Success",
          text: message,
          confirmButtonText: "OK",
        });
        router.push("/courses");
      },
      onClose: () => {
        Swal.fire({
          icon: "warning",
          title: "Wait",
          text: "You need this Course! Don't go!!",
          confirmButtonText: "OK",
        });
      },
    });
  };

  if (!course) {
    return <Missing />;
  }

  return (
    <main>
      <header className="py-6 border-b bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-2xl font-bold">
              {course.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <FcCalendar className="w-8 h-8" />
              </div>
              <CardTitle className="text-center text-2xl">PAYMENT</CardTitle>
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

              {/* Class Days Selection */}
              <div className="space-y-4 mb-6">
                <Label className="flex items-center gap-2 text-lg">
                  <FcCalendar className="w-5 h-5" />
                  Number of Sessions Per Week
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {CLASS_DAYS.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={day.toLowerCase()}
                        checked={selectedDays.includes(day)}
                        onChange={(e) =>
                          handleCheckboxChange(day, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label
                        htmlFor={day.toLowerCase()}
                        className="cursor-pointer"
                      >
                        {day.charAt(0) + day.slice(1).toLowerCase()}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Select Maximum of 3 days
                </p>
              </div>

              <hr className="my-6" />

              {/* Time of Day */}
              <div className="space-y-4 mb-6">
                <Label className="flex items-center gap-2 text-lg">
                  <FaClock className="w-5 h-5 text-blue-900" />
                  Time of Day
                </Label>
                <RadioGroup
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                  className="flex gap-4"
                >
                  {["MORNING", "AFTERNOON", "EVENING"].map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <RadioGroupItem value={time} id={time.toLowerCase()} />
                      <Label
                        htmlFor={time.toLowerCase()}
                        className="cursor-pointer"
                      >
                        {time.charAt(0) + time.slice(1).toLowerCase()}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Select time of the day you will be available for your classes
                </p>
              </div>

              <hr className="my-6" />

              {/* Mode of Learning */}
              <div className="space-y-4 mb-6">
                <Label className="flex items-center gap-2 text-lg">
                  <FcGlobe className="w-5 h-5" />
                  Mode of Learning
                </Label>
                <RadioGroup
                  value={selectedMode}
                  onValueChange={setSelectedMode}
                  className="flex gap-4"
                >
                  {["ONLINE", "ONSITE"].map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <RadioGroupItem value={mode} id={mode.toLowerCase()} />
                      <Label
                        htmlFor={mode.toLowerCase()}
                        className="cursor-pointer"
                      >
                        {mode.charAt(0) + mode.slice(1).toLowerCase()}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Onsite venue is at Lokogoma, Abuja, Nigeria.
                </p>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!selectedDays.length || !selectedTime || !selectedMode}
                className="w-full bg-blue-900 hover:bg-blue-800 text-lg py-6"
                size="lg"
              >
                Pay Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default CourseEnrollment;
