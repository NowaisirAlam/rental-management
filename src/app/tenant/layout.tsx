"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TenantSidebar from "@/components/tenant/Sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";

function TenantShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="light"
      className="tenant-warm min-h-screen flex overflow-hidden"
    >
      <style jsx global>{`
        .tenant-warm {
          background: #FAF7F2;
          color: #2D2A26;
        }

        .tenant-main {
          background: #FAF7F2;
          margin-left: 224px;
          min-height: 100vh;
        }

        .tenant-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 224px;
          height: 100vh;
          background: #1A1714;
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 20px 16px;
          z-index: 20;
        }

        .tenant-sidebar svg {
          width: 20px;
          height: 20px;
          stroke-width: 2;
        }

        .tenant-logo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1A1714;
          background: #C4956A;
          box-shadow: 0 8px 20px rgba(196,149,106,0.22);
          margin-bottom: 10px;
        }

        .tenant-logo-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 4px;
          margin-bottom: 24px;
        }

        .tenant-brand {
          color: #F0EBE1;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .tenant-nav {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        .tenant-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 8px 10px;
          border-radius: 12px;
          color: rgba(255,255,255,0.62);
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s, background 0.2s;
        }

        .tenant-nav-link[data-active="true"] {
          color: #1A1714;
          background: #C4956A;
        }

        .tenant-nav-link:hover {
          color: #C4956A;
          background: rgba(196,149,106,0.12);
        }

        .tenant-nav-link[data-active="true"]:hover {
          color: #1A1714;
          background: #B07E55;
        }

        .tenant-logout {
          margin-top: 4px;
          color: rgba(255,255,255,0.55);
        }

        .tenant-logout:hover {
          color: #A04040;
          background: rgba(160,64,64,0.16);
        }

        .tenant-warm .bg-white { background-color: #FFFDF9 !important; }
        .tenant-warm .bg-slate-50 { background-color: #F0EBE1 !important; }
        .tenant-warm .bg-slate-100 { background-color: #F0EBE1 !important; }
        .tenant-warm .bg-slate-900 { background-color: #1A1714 !important; }
        .tenant-warm .bg-blue-600 { background-color: #C4956A !important; }
        .tenant-warm .bg-blue-700 { background-color: #B07E55 !important; }
        .tenant-warm .bg-amber-50 { background-color: #F8EAD4 !important; }
        .tenant-warm .bg-amber-100 { background-color: #F6E2BF !important; }
        .tenant-warm .bg-red-100 { background-color: rgba(160,64,64,0.12) !important; }
        .tenant-warm .bg-green-100 { background-color: rgba(107,143,94,0.12) !important; }

        .tenant-warm .border-slate-200 { border-color: #DDD5C8 !important; }
        .tenant-warm .border-slate-100 { border-color: #DDD5C8 !important; }
        .tenant-warm .border-dashed { border-color: #DDD5C8 !important; }

        .tenant-warm .text-slate-900 { color: #2D2A26 !important; }
        .tenant-warm .text-slate-800 { color: #2D2A26 !important; }
        .tenant-warm .text-slate-700 { color: #2D2A26 !important; }
        .tenant-warm .text-slate-600 { color: #7A7267 !important; }
        .tenant-warm .text-slate-500 { color: #7A7267 !important; }
        .tenant-warm .text-slate-400 { color: #A99E90 !important; }
        .tenant-warm .text-blue-600 { color: #C4956A !important; }
        .tenant-warm .text-blue-700 { color: #B07E55 !important; }
        .tenant-warm .text-amber-500 { color: #C47A3A !important; }
        .tenant-warm .text-amber-700 { color: #9A6435 !important; }
        .tenant-warm .text-red-600 { color: #A04040 !important; }
        .tenant-warm .text-red-700 { color: #A04040 !important; }
        .tenant-warm .text-green-600 { color: #6B8F5E !important; }

        .tenant-warm .shadow-sm { box-shadow: 0 2px 6px rgba(26,23,20,0.04) !important; }
        .tenant-warm .shadow-md { box-shadow: 0 4px 12px rgba(26,23,20,0.08) !important; }

        @media (max-width: 720px) {
          .tenant-main { margin-left: 0; }
          .tenant-sidebar {
            position: sticky;
            width: 100%;
            height: auto;
            flex-direction: row;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            overflow-x: auto;
          }
          .tenant-logo-row {
            margin-bottom: 0;
            padding: 0;
          }
          .tenant-brand {
            display: none;
          }
          .tenant-nav {
            flex-direction: row;
            width: auto;
            gap: 8px;
          }
          .tenant-nav-link {
            width: 40px;
            justify-content: center;
            padding: 8px;
          }
          .tenant-nav-link span {
            display: none;
          }
          .tenant-logout { margin-top: 0; margin-left: auto; }
        }
      `}</style>
      <TenantSidebar />
      <main className="tenant-main flex-1 min-w-0 w-full overflow-y-auto">
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
