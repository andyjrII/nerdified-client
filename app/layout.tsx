import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { AuthProvider } from "@/context/AuthProvider";
import { AdminProvider } from "@/context/AdminProvider";
import { StudentProvider } from "@/context/StudentProvider";
import { TutorProvider } from "@/context/TutorProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nerdified - Learn Live. Learn Better.",
  description: "A commercial, instructor-led learning platform focused on live, interactive education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdminProvider>
            <StudentProvider>
              <TutorProvider>
                {children}
              </TutorProvider>
            </StudentProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
