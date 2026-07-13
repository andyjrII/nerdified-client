"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Moment from "react-moment";
import { FaEdit, FaUsers, FaCalendarAlt, FaExternalLinkAlt, FaCopy, FaTrash, FaComments } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import type { Course, CourseEnrollment, SessionStub } from "./types";

type DetailTab = "details" | "enrollments" | "sessions";

interface TutorCourseDetailPanelProps {
  course: Course;
  /** Full course with sessions (fetched when selected). Undefined while loading. */
  courseDetail: Course | null | undefined;
  enrollments: CourseEnrollment[];
  onClose?: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  duplicating: boolean;
}

function getCourseTypeLabel(courseType: string): string {
  if (courseType === "ONE_ON_ONE") return "One-on-One";
  if (courseType === "BOTH") return "Group & 1:1";
  return "Group Class";
}

export function TutorCourseDetailPanel({
  course,
  courseDetail,
  enrollments,
  onClose,
  onDuplicate,
  onDelete,
  duplicating,
}: TutorCourseDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("details");
  const sessions: SessionStub[] = courseDetail?.sessions ?? [];

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "details", label: "Details" },
    { id: "enrollments", label: `Enrollments (${enrollments.length})` },
    { id: "sessions", label: "Sessions" },
  ];

  return (
    <Card className="border-t-2 border-indigo-200 shadow-md">
      <div className="border-b border-slate-200 px-4 py-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/tutor/courses/${course.id}/edit`}>
            <Button variant="outline" size="sm" className="bg-white">
              <FaEdit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </Link>
          <Link href={`/tutor/courses/${course.id}/chat`}>
            <Button variant="outline" size="sm" className="bg-white">
              <FaComments className="w-3 h-3 mr-1" />
              Chat
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={onDuplicate}
            disabled={duplicating}
            className="bg-white"
          >
            <FaCopy className="w-3 h-3 mr-1" />
            {duplicating ? "Duplicating…" : "Duplicate"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="bg-white text-red-600 border-red-200 hover:bg-red-50"
          >
            <FaTrash className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {course.status === "DRAFT" ? (
            <Badge className="bg-amber-100 text-amber-800">Draft</Badge>
          ) : (
            <Badge className="bg-green-100 text-green-800">Published</Badge>
          )}
          <Badge variant="outline">{getCourseTypeLabel(course.courseType)}</Badge>
        </div>
      </div>
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-2 flex flex-wrap items-center gap-2">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              activeTab === id
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        ))}
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto">
            Close
          </Button>
        )}
      </div>
      <CardContent className="p-4">
        {activeTab === "details" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900">{course.title}</h3>
            </div>
            {course.description && (
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{course.description}</p>
            )}
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-slate-500">Price</dt>
              <dd className="font-medium">{formatCurrency(course.price)}</dd>
              {course.maxStudents != null && (
                <>
                  <dt className="text-slate-500">Max students</dt>
                  <dd className="font-medium">{course.maxStudents}</dd>
                </>
              )}
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium">
                <Moment format="MMM D, YYYY">{course.createdAt}</Moment>
              </dd>
            </dl>
          </div>
        )}

        {activeTab === "enrollments" && (
          <div className="space-y-3">
            {enrollments.length === 0 ? (
              <p className="text-slate-500 text-sm">No enrollments yet.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {enrollments.map((e) => (
                  <li key={e.id} className="py-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{e.student?.name ?? "—"}</p>
                      <p className="text-xs text-slate-500">{e.student?.email}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{formatCurrency(e.paidAmount)}</p>
                      <p className="text-xs text-slate-500">
                        <Moment format="MMM D, YYYY">{e.dateEnrolled}</Moment>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href={`/tutor/courses/${course.id}/enrollments`}>
              <Button variant="outline" size="sm">
                <FaUsers className="w-3 h-3 mr-2" />
                View full enrollments
                <FaExternalLinkAlt className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="space-y-3">
            {courseDetail === undefined ? (
              <p className="text-slate-500 text-sm">Loading sessions…</p>
            ) : sessions.length === 0 ? (
              <p className="text-slate-500 text-sm">No sessions yet. Add them on the edit page.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {sessions.map((s) => (
                  <li key={s.id} className="py-2 flex flex-wrap items-center gap-2">
                    <span className="font-medium">{s.title || "Session"}</span>
                    <span className="text-sm text-slate-500">
                      <Moment format="MMM D, YYYY • h:mm A">{s.startTime}</Moment>
                      {" → "}
                      <Moment format="h:mm A">{s.endTime}</Moment>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link href={`/tutor/courses/${course.id}/edit`}>
              <Button variant="outline" size="sm">
                <FaCalendarAlt className="w-3 h-3 mr-2" />
                Manage sessions
                <FaExternalLinkAlt className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
