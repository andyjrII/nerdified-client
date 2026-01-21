"use client";

import TutorSidebar from "./navigation/TutorSidebar";

export const TutorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TutorSidebar />
      <main className="flex-1 ml-64 overflow-y-auto h-screen">{children}</main>
    </div>
  );
};
