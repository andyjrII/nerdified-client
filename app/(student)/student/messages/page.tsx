import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Direct Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              Your messages with tutors will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
