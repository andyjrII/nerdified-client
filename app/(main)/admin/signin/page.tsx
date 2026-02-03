import { Suspense } from "react";
import AdminSignin from "@/components/pages/AdminSignin";

export default function AdminSigninPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading...</div>}>
      <AdminSignin />
    </Suspense>
  );
}
