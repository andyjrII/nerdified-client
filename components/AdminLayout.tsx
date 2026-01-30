"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./navigation/AdminSidebar";
import {
  DashboardBreadcrumbs,
  getBreadcrumbConfigForPath,
  type BreadcrumbConfig,
} from "./DashboardBreadcrumbs";

const adminConfig: BreadcrumbConfig = {
  basePath: "/admin",
  baseLabel: "Admin",
  segmentLabels: {},
};

const adminsConfig: BreadcrumbConfig = {
  basePath: "/admins",
  baseLabel: "Admins",
  segmentLabels: {},
};

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() ?? "";
  const config = getBreadcrumbConfigForPath(pathname, [
    { basePath: "/admins", config: adminsConfig },
    { basePath: "/admin", config: adminConfig },
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto h-screen">
        <div className="p-6">
          {config && (
            <DashboardBreadcrumbs type="admin" config={config} />
          )}
          {children}
        </div>
      </main>
    </div>
  );
};
