"use client";

import { Input } from "@/components/ui/input";
import { FaSearch, FaFilter } from "react-icons/fa";
import type { StatusFilter } from "./types";

interface TutorCoursesFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  counts: { all: number; draft: number; published: number };
  onClearAll: () => void;
}

export function TutorCoursesFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
  onClearAll,
}: TutorCoursesFiltersProps) {
  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-700 font-medium">
        <FaFilter className="w-4 h-4 text-indigo-600" />
        Filters
      </div>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white border-slate-200"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {[
          { value: "all" as const, label: "All", count: counts.all },
          { value: "draft" as const, label: "Draft", count: counts.draft },
          { value: "published" as const, label: "Published", count: counts.published },
        ].map(({ value, label, count }) => (
          <button
            key={value}
            type="button"
            onClick={() => onStatusFilterChange(value)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === value
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
            <span
              className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs ${
                statusFilter === value ? "bg-white/20" : "bg-slate-200 text-slate-600"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
