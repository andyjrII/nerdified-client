import { Suspense } from "react";
import SessionBookings from "@/components/sessions/SessionBookings";

export default function SessionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-full space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sessions</h1>
          <p className="text-gray-600">
            Browse and book live sessions for your enrolled courses.
          </p>
        </div>

        <Suspense fallback={
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-400">Loading sessions...</div>
          </div>
        }>
          <SessionBookings />
        </Suspense>
      </div>
    </div>
  );
}
