"use client";

import { Navigation } from "./navigation/Navigation";
import { Footer } from "./navigation/Footer";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-transparent">
      <Navigation />
      <main className="flex-1 relative bg-transparent">{children}</main>
      <Footer />
    </div>
  );
};
