"use client";

import { useEffect, useState } from "react";
import { AxiosInstance } from "axios";
import { FaEnvelope, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

/**
 * Amber banner shown on dashboards while the user's email is unverified,
 * with a one-click resend. Renders nothing while loading or once verified.
 */
const EmailVerificationBanner = ({
  axiosPrivate,
}: {
  axiosPrivate: AxiosInstance;
}) => {
  const [unverified, setUnverified] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axiosPrivate.get("auth/me");
        if (!cancelled && res?.data?.emailVerified === false) {
          setUnverified(true);
        }
      } catch {
        // Can't determine status — show nothing.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [axiosPrivate]);

  if (!unverified) return null;

  const resend = async () => {
    setSending(true);
    try {
      await axiosPrivate.post("auth/verify-email/resend");
      setSent(true);
    } catch (error) {
      console.error("Error resending verification email:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 px-4 py-3 flex flex-wrap items-center gap-3">
      <FaExclamationTriangle className="w-4 h-4 text-amber-600 shrink-0" />
      <p className="text-sm text-amber-900 dark:text-amber-100 flex-1 min-w-[200px]">
        {sent
          ? "Verification email sent — check your inbox and click the link."
          : "Your email address isn't verified yet. Please verify it to secure your account."}
      </p>
      {!sent && (
        <Button
          size="sm"
          variant="outline"
          onClick={resend}
          disabled={sending}
          className="border-amber-400 text-amber-800 hover:bg-amber-100 dark:text-amber-200"
        >
          <FaEnvelope className="w-3 h-3 mr-1.5" />
          {sending ? "Sending…" : "Resend verification email"}
        </Button>
      )}
    </div>
  );
};

export default EmailVerificationBanner;
