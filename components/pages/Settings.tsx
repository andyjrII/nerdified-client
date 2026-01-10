"use client";

import StudentInfo from "@/components/StudentInfo";
import ImageChange from "@/components/forms/ImageChange";
import PasswordChange from "@/components/forms/PasswordChange";
import { Card } from "@/components/ui/card";

const Settings = () => {
  return (
    <section className="border-t border-b bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-6">
        <StudentInfo />
        <div className="text-center my-6">
          <h1 className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-2xl font-bold">
            Settings
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
          <ImageChange />
          <PasswordChange />
        </div>
      </main>
    </section>
  );
};

export default Settings;
