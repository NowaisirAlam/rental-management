"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TenantSidebar from "@/components/tenant/Sidebar";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function TenantShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <div
      data-theme={resolvedTheme}
      className="min-h-screen flex bg-slate-50 overflow-hidden"
    >
      <TenantSidebar />
      <main className="flex-1 min-w-0 w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TenantShell>{children}</TenantShell>
    </ThemeProvider>
  );
}
