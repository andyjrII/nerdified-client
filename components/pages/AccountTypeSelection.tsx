"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserGraduate, FaChalkboardTeacher, FaArrowRight } from "react-icons/fa";
import { AuthShell } from "@/components/auth/AuthShell";

type AccountType = "student" | "tutor";

const options: {
  value: AccountType;
  title: string;
  body: string;
  icon: typeof FaUserGraduate;
  tint: string;
}[] = [
  {
    value: "student",
    title: "Student",
    body: "Learn new skills and advance your career",
    icon: FaUserGraduate,
    tint: "bg-indigo-100 text-indigo-600",
  },
  {
    value: "tutor",
    title: "Tutor",
    body: "Teach, inspire and grow your impact",
    icon: FaChalkboardTeacher,
    tint: "bg-emerald-100 text-emerald-600",
  },
];

const AccountTypeSelection = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<AccountType>("student");

  const proceed = () => router.push(`/signup/${selected}`);

  return (
    <AuthShell altText="Already have an account?" altLabel="Sign in" altHref="/signin">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Create an account
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Join thousands of learners and expert tutors on Nerdified.
        </p>

        <p className="mt-6 text-sm font-semibold text-slate-700">I&apos;m joining as a:</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map(({ value, title, body, icon: Icon, tint }) => {
            const active = selected === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                  active
                    ? "border-indigo-500 bg-indigo-50/50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className={`absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                    active ? "border-indigo-600" : "border-slate-300"
                  }`}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
                </span>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-bold text-slate-900">{title}</p>
                <p className="mt-0.5 text-xs leading-snug text-slate-500">{body}</p>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={proceed}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Continue as {selected === "student" ? "Student" : "Tutor"}
          <FaArrowRight className="h-3.5 w-3.5" />
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          By creating an account, you agree to our{" "}
          <span className="text-indigo-600">Terms of Service</span> and{" "}
          <span className="text-indigo-600">Privacy Policy</span>.
        </p>
      </div>
    </AuthShell>
  );
};

export default AccountTypeSelection;
