import { Suspense } from "react";
import AdminSignin from "@/components/pages/AdminSignin";

export default function AdminSigninPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AdminSignin />
    </Suspense>
  );
}
