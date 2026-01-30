"use client";

import StudentSidebar from "./navigation/StudentSidebar";
import { DashboardBreadcrumbs } from "./DashboardBreadcrumbs";

export const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="flex-1 ml-64 overflow-y-auto h-screen pl-6 pr-4">
        <div className="pt-6 pb-0">
          <DashboardBreadcrumbs
            type="student"
            config={{
              basePath: "/student",
              baseLabel: "Student Portal",
              segmentLabels: {},
            }}
          />
        </div>
        {children}
      </main>
    </div>
  );
};
