"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { SyncLoader } from "react-spinners";
import { axiosPrivate } from "@/lib/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { setAuthSessionCookie } from "@/utils/authCookie";

/**
 * Landing page for the Google OAuth redirect. The API has already set the
 * auth cookies; we fetch auth/me to hydrate client auth state, then route by
 * role (mirroring the regular sign-in flow).
 */
function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const res = await axiosPrivate.get("auth/me");
        const email: string | undefined = res?.data?.email;
        const role = String(res?.data?.role ?? "").toUpperCase();
        if (!email || (role !== "STUDENT" && role !== "TUTOR")) {
          throw new Error("Invalid session");
        }

        setAuth({ email, role: role as "STUDENT" | "TUTOR" });

        // Unapproved tutors get the same pending-approval stop as password sign-in.
        if (role === "TUTOR" && searchParams.get("approved") === "false") {
          await Swal.fire({
            icon: "warning",
            title: "Account Pending Approval",
            text: "Your tutor account is pending admin approval. You'll be notified once approved.",
            confirmButtonText: "OK",
          });
          router.replace("/signin");
          return;
        }

        setAuthSessionCookie(role);
        router.replace(role === "STUDENT" ? "/student" : "/tutor");
      } catch (error) {
        console.error("OAuth callback error:", error);
        router.replace("/signin?oauth_error=session_failed");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <SyncLoader size={10} color="#1e3a8a" />
      <p className="text-gray-600 text-sm">Completing sign-in with Google…</p>
    </section>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <OAuthCallback />
    </Suspense>
  );
}
