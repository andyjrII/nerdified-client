"use client";

import EnrolledCourses from "@/components/EnrolledCourses";
import NewestCourses from "@/components/NewestCourses";
import MostEnrolled from "@/components/MostEnrolled";
import CourseTotals from "@/components/CourseTotals";
import StudentInfo from "@/components/StudentInfo";
import { Card, CardContent } from "@/components/ui/card";

const Student = () => {
  return (
    <section className="border-t border-b bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-6">
        <StudentInfo />

        <CourseTotals />

        <Card className="p-6 mb-6 shadow-lg">
          <CardContent>
            <EnrolledCourses />
          </CardContent>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <CardContent>
            <MostEnrolled />
          </CardContent>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <CardContent>
            <NewestCourses />
          </CardContent>
        </Card>
      </main>
    </section>
  );
};

export default Student;
