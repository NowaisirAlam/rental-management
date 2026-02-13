"use client";

import TenantSidebar from "@/components/tenant/Sidebar";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function TenantShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <div
      data-theme={resolvedTheme}
      className="flex h-screen bg-slate-50 overflow-hidden"
    >
      <TenantSidebar />
      <main className="flex-1 overflow-y-auto">
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
