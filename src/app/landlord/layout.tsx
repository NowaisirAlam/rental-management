"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LandlordSidebar from "@/components/landlord/Sidebar";
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
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "landlord") {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LandlordShell>{children}</LandlordShell>
    </ThemeProvider>
  );
}
