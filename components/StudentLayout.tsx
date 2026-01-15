"use client";

import StudentSidebar from "./navigation/StudentSidebar";

export const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="flex-1 ml-64 overflow-y-auto h-screen">{children}</main>
    </div>
  );
};
