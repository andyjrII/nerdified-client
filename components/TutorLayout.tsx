"use client";

import TutorSidebar from "./navigation/TutorSidebar";
import { DashboardBreadcrumbs } from "./DashboardBreadcrumbs";

export const TutorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TutorSidebar />
      <main className="flex-1 ml-64 overflow-y-auto h-screen pl-6 pr-4">
        <div className="pt-6 pb-0">
          <DashboardBreadcrumbs
            type="tutor"
            config={{
              basePath: "/tutor",
              baseLabel: "Tutor Portal",
              segmentLabels: {},
            }}
          />
        </div>
        {children}
      </main>
    </div>
  );
};
