"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TenantSidebar from "@/components/tenant/Sidebar";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

// Inner shell: consumes theme and applies data-theme to the root div.
// Must be a child of ThemeProvider — a component can't consume its own context.
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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "TENANT") {
      router.replace("/login");
    }
  }, [status, session, router]);

  if (status === "loading" || !session || session.user.role !== "TENANT") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <TenantShell>{children}</TenantShell>
    </ThemeProvider>
  );
}
