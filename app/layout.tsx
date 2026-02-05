import type { Metadata } from "next";
import "./globals.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { AuthProvider } from "@/context/AuthProvider";
import { AdminProvider } from "@/context/AdminProvider";
import { StudentProvider } from "@/context/StudentProvider";
import { TutorProvider } from "@/context/TutorProvider";

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
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning: avoids hydration errors when browser extensions (e.g. Dark Reader) modify DOM before React hydrates, especially in __next_metadata_boundary__ */}
      <body className="font-sans antialiased" suppressHydrationWarning>
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
