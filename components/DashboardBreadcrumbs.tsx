"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export type BreadcrumbConfig = {
  basePath: string;
  baseLabel: string;
  segmentLabels: Record<string, string>;
  /** Map segment value to label when it follows a known parent (e.g. "new" after "courses" -> "New course") */
  segmentLabelOverrides?: Record<string, string>;
};

const defaultSegmentLabels: Record<string, Record<string, string>> = {
  student: {
    courses: "My Courses",
    sessions: "Upcoming Sessions",
    messages: "Messages",
    wishlist: "Wishlist",
    settings: "Settings",
  },
  tutor: {
    courses: "My Courses",
    edit: "Edit Course",
    enrollments: "Enrollments",
    sessions: "Sessions",
    availability: "Availability",
    earnings: "Earnings",
    students: "Students",
    messages: "Messages",
    settings: "Settings",
  },
  admin: {
    courses: "Courses",
    posts: "Posts",
    students: "Students",
    tutors: "Tutors",
    admins: "Admins",
    new: "New",
    payment: "Payment",
    edit: "Edit",
  },
};

type BreadcrumbPortalType = "student" | "tutor" | "admin";

function getSegmentLabel(
  segment: string,
  segments: string[],
  index: number,
  config: BreadcrumbConfig,
  type: BreadcrumbPortalType
): string {
  const map = defaultSegmentLabels[type];
  const parent = index > 0 ? segments[index - 1] : "";
  if (type === "tutor" && segment === "new") {
    if (parent === "sessions") return "Schedule Session";
    if (parent === "courses") return "New Course";
  }
  if (type === "admin" && segment === "new") {
    if (parent === "courses") return "New Course";
    if (parent === "posts") return "New Post";
    if (parent === "admins") return "New Admin";
  }
  if (map?.[segment]) return map[segment];
  if (config.segmentLabels?.[segment]) return config.segmentLabels[segment];
  if (config.segmentLabelOverrides?.[segment]) return config.segmentLabelOverrides[segment];
  if (/^\d+$/.test(segment)) {
    const next = segments[index + 1];
    if (next === "edit") return "Course";
    if (next === "enrollments") return "Enrollments";
    if (next === "payment") return "Course";
    if (parent === "posts") return "Post";
    return "Course";
  }
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

function buildCrumbs(
  pathname: string,
  config: BreadcrumbConfig,
  type: BreadcrumbPortalType
): { href: string; label: string }[] {
  const basePath = config.basePath.replace(/\/$/, "");
  if (!pathname.startsWith(basePath)) return [];

  const rest = pathname.slice(basePath.length).replace(/^\//, "") || "";
  const segments = rest ? rest.split("/") : [];

  const crumbs: { href: string; label: string }[] = [
    { href: basePath, label: config.baseLabel },
  ];

  if (segments.length === 0) {
    crumbs.push({ href: basePath, label: "Dashboard" });
    return crumbs;
  }

  let path = basePath;
  segments.forEach((seg, i) => {
    path = path + "/" + seg;
    const label = getSegmentLabel(seg, segments, i, config, type);
    crumbs.push({ href: path, label });
  });

  return crumbs;
}

interface DashboardBreadcrumbsProps {
  config: BreadcrumbConfig;
  type: "student" | "tutor";
}

export function DashboardBreadcrumbs({ config, type }: DashboardBreadcrumbsProps) {
  const pathname = usePathname() ?? "";
  const crumbs = config ? buildCrumbs(pathname, config, type) : [];

  if (crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 flex-wrap"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden />
            )}
            {isLast ? (
              <span className="font-medium text-gray-900" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-gray-900 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
