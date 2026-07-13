"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SyncLoader } from "react-spinners";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "@/lib/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Status = "verifying" | "success" | "error";

/** Landing page for the verification link sent by email. */
function VerifyEmail() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const [email, setEmail] = useState<string>("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }
    (async () => {
      try {
        const res = await axios.get(
          `auth/verify-email?token=${encodeURIComponent(token)}`,
        );
        setEmail(res?.data?.email ?? "");
        setStatus(res?.data?.verified ? "success" : "error");
      } catch {
        setStatus("error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="py-10 text-center space-y-4">
          {status === "verifying" && (
            <>
              <SyncLoader size={10} color="#1e3a8a" className="mx-auto" />
              <p className="text-gray-600">Verifying your email…</p>
            </>
          )}
          {status === "success" && (
            <>
              <FaCheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <h1 className="text-xl font-bold text-gray-900">Email verified!</h1>
              <p className="text-gray-600 text-sm">
                {email ? (
                  <>
                    <span className="font-medium">{email}</span> is now verified.
                  </>
                ) : (
                  "Your email address is now verified."
                )}
              </p>
              <Link href="/signin">
                <Button className="bg-blue-900 hover:bg-blue-800 mt-2">
                  Continue to sign in
                </Button>
              </Link>
            </>
          )}
          {status === "error" && (
            <>
              <FaTimesCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h1 className="text-xl font-bold text-gray-900">
                Verification failed
              </h1>
              <p className="text-gray-600 text-sm">
                This verification link is invalid or has expired. Sign in and use
                the &quot;Resend verification email&quot; button to get a new one.
              </p>
              <Link href="/signin">
                <Button variant="outline" className="mt-2">
                  Go to sign in
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
