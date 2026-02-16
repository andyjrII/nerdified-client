"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";
import Moment from "react-moment";
import type { Course } from "./types";

interface TutorCourseRowProps {
  course: Course;
  enrollmentsCount: number;
  totalRevenue: number;
  isSelected: boolean;
  onSelect: () => void;
}

function getCourseTypeLabel(courseType: string): string {
  if (courseType === "ONE_ON_ONE") return "One-on-One";
  if (courseType === "BOTH") return "Group & 1:1";
  return "Group Class";
}

function getStatusBadge(status?: string) {
  if (status === "DRAFT") {
    return <Badge className="bg-amber-100 text-amber-800 text-xs">Draft</Badge>;
  }
  return <Badge className="bg-green-100 text-green-800 text-xs">Published</Badge>;
}

export function TutorCourseRow({
  course,
  enrollmentsCount,
  totalRevenue,
  isSelected,
  onSelect,
}: TutorCourseRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
      className={`flex flex-wrap items-center gap-4 px-4 py-3 border-b border-slate-200 last:border-b-0 cursor-pointer transition-colors ${
        isSelected
          ? "bg-indigo-50/80 border-l-4 border-l-indigo-600"
          : "bg-white hover:bg-slate-50 border-l-4 border-l-transparent"
      }`}
    >
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 truncate">{course.title}</p>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            {getStatusBadge(course.status)}
            <span className="text-xs text-slate-500">
              {getCourseTypeLabel(course.courseType)}
              {enrollmentsCount >= 0 && ` · ${enrollmentsCount} enrollment${enrollmentsCount !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <p className="font-semibold text-slate-900">{formatCurrency(course.price)}</p>
          <p className="text-xs text-slate-500">
            <Moment format="MMM D, YYYY">{course.createdAt}</Moment>
          </p>
        </div>
        {totalRevenue > 0 && (
          <div className="text-right">
            <p className="font-semibold text-green-600">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-slate-500">Revenue</p>
          </div>
        )}
      </div>
    </div>
  );
}
