import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { AuthProvider } from "@/context/AuthProvider";
import { AdminProvider } from "@/context/AdminProvider";
import { StudentProvider } from "@/context/StudentProvider";
import { TutorProvider } from "@/context/TutorProvider";
import { ThemeProvider } from "@/context/ThemeProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nerdified - Learn Live. Learn Better.",
  description: "A commercial, instructor-led learning platform focused on live, interactive education",
};

/** Inline script to set theme class before first paint to avoid flash (runs before React hydrates). */
const themeInitScript = `
(function(){
  var k='nerdified-theme';
  var s=typeof localStorage!='undefined'?localStorage.getItem(k):null;
  var d=typeof window!='undefined'&&window.matchMedia('(prefers-color-scheme: dark)').matches;
  var t=s==='light'||s==='dark'?s:(d?'dark':'light');
  document.documentElement.classList.toggle('dark',t==='dark');
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <AuthProvider>
            <AdminProvider>
              <StudentProvider>
                <TutorProvider>
                  {children}
                </TutorProvider>
              </StudentProvider>
            </AdminProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
