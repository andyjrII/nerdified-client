import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SessionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Upcoming Sessions</h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              No upcoming sessions. Sessions will appear here when you book them.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
