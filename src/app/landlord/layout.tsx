"use client";

import LandlordSidebar from "@/components/landlord/sidebar";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function LandlordShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <div
      data-theme={resolvedTheme}
      className="flex h-screen bg-slate-50 overflow-hidden"
    >
      <LandlordSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LandlordShell>{children}</LandlordShell>
    </ThemeProvider>
  );
}