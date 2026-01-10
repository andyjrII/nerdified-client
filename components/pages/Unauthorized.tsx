"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Unauthorized = () => {
  const router = useRouter();
  const goBack = () => router.back();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="py-6 border-b bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-2xl font-bold">
              Unauthorized Page
            </h1>
          </div>
        </div>
      </header>
      <section className="flex items-center justify-center min-h-[70vh] p-8">
        <Card className="max-w-2xl text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <Image
                src="/images/bg/unauthorized-bg.png"
                alt="Unauthorized"
                width={400}
                height={300}
                className="mx-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Unauthorized Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6 text-lg">
              You do not have access to the requested page!
            </p>
            <Button
              onClick={goBack}
              className="bg-gray-900 hover:bg-gray-800 text-white"
              size="lg"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Unauthorized;
