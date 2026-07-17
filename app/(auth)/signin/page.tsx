import { Suspense } from "react";
import Signin from "@/components/pages/Signin";

export default function SigninPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <Signin />
    </Suspense>
  );
}
