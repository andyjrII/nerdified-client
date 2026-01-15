import EnrolledCourses from "@/components/EnrolledCourses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyCoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Courses</h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <EnrolledCourses />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
