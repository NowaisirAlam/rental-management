"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LandlordSidebar from "@/components/landlord/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";

function LandlordShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="dark"
      className="landlord-warm min-h-screen flex overflow-hidden"
    >
      <style jsx global>{`
        .landlord-warm {
          background: #141210;
          color: #F0EBE1;
        }

        .landlord-warm main {
          background: #141210;
        }

        .landlord-warm .bg-white { background-color: #1D1915 !important; }
        .landlord-warm .bg-slate-50 { background-color: #1D1915 !important; }
        .landlord-warm .bg-slate-100 { background-color: #2A241E !important; }
        .landlord-warm .bg-slate-900 { background-color: #1A1714 !important; }

        .landlord-warm .border-slate-200 { border-color: #2E281F !important; }
        .landlord-warm .border-slate-100 { border-color: #2E281F !important; }

        .landlord-warm .text-slate-900 { color: #F0EBE1 !important; }
        .landlord-warm .text-slate-800 { color: #F0EBE1 !important; }
        .landlord-warm .text-slate-700 { color: #E5D9C7 !important; }
        .landlord-warm .text-slate-600 { color: #BDAF9F !important; }
        .landlord-warm .text-slate-500 { color: #A99E90 !important; }
        .landlord-warm .text-slate-400 { color: #8E8276 !important; }

        .landlord-warm .text-blue-600 { color: #C4956A !important; }
        .landlord-warm .text-blue-700 { color: #B07E55 !important; }
        .landlord-warm .bg-blue-600 { background-color: #C4956A !important; }
        .landlord-warm .bg-blue-700 { background-color: #B07E55 !important; }
        .landlord-warm .bg-blue-500 { background-color: #C4956A !important; }
        .landlord-warm .bg-blue-100 { background-color: rgba(196,149,106,0.18) !important; }
        .landlord-warm .bg-blue-50 { background-color: rgba(196,149,106,0.12) !important; }
        .landlord-warm .text-blue-500 { color: #C4956A !important; }
        .landlord-warm .border-blue-500 { border-color: #C4956A !important; }
        .landlord-warm .ring-blue-500\/20 { --tw-ring-color: rgba(196,149,106,0.2) !important; }
        .landlord-warm .border-\[\#5e6ad2\] { border-color: #C4956A !important; }
        .landlord-warm .bg-\[\#5e6ad2\] { background-color: #C4956A !important; }
        .landlord-warm .bg-\[\#4a54b8\] { background-color: #B07E55 !important; }

        .landlord-warm .text-\[\#5e6ad2\] { color: #C4956A !important; }
        .landlord-warm .text-\[\#818cf8\] { color: #C4956A !important; }
        .landlord-warm .text-\[\#f2f2f7\] { color: #F0EBE1 !important; }
        .landlord-warm .text-\[\#8a8a8e\] { color: #A99E90 !important; }
        .landlord-warm .text-\[\#7c7c80\] { color: #A99E90 !important; }

        .landlord-warm .bg-\[\#1e1e2e\] { background-color: #2A241E !important; }
        .landlord-warm .bg-\[\#252535\] { background-color: #322B24 !important; }
        .landlord-warm .bg-\[\#0d1829\] { background-color: #2A241E !important; }
        .landlord-warm .bg-\[\#0f0f10\] { background-color: #1A1714 !important; }

        .landlord-warm .bg-amber-50 { background-color: #F8EAD4 !important; }
        .landlord-warm .bg-amber-100 { background-color: #F6E2BF !important; }
        .landlord-warm .bg-red-100 { background-color: rgba(160,64,64,0.12) !important; }
        .landlord-warm .bg-green-100 { background-color: rgba(107,143,94,0.12) !important; }

        .landlord-warm .text-amber-700 { color: #9A6435 !important; }
        .landlord-warm .text-red-600 { color: #A04040 !important; }
        .landlord-warm .text-red-700 { color: #A04040 !important; }
        .landlord-warm .text-green-600 { color: #6B8F5E !important; }

        .landlord-warm .shadow-sm { box-shadow: 0 2px 6px rgba(10,8,6,0.3) !important; }
        .landlord-warm .shadow-md { box-shadow: 0 8px 20px rgba(10,8,6,0.28) !important; }
      `}</style>
      <LandlordSidebar />
      <main className="flex-1 min-w-0 w-full overflow-y-auto pt-12">
        {children}
      </main>
    </div>
  );
}

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "LANDLORD") {
      router.replace("/login");
    }
  }, [status, session, router]);

  if (status === "loading" || !session || session.user.role !== "LANDLORD") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0f10]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5e6ad2] border-t-transparent" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LandlordShell>{children}</LandlordShell>
    </ThemeProvider>
  );
}