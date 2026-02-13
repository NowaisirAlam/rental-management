"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Building2,
  LayoutDashboard,
  CreditCard,
  Wrench,
  FileText,
  Bell,
  User,
  Power,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/tenant/dashboard",     icon: LayoutDashboard, label: "Dashboard"       },
  { href: "/tenant/payments",      icon: CreditCard,      label: "Rent & Payments" },
  { href: "/tenant/maintenance",   icon: Wrench,          label: "Maintenance"     },
  { href: "/tenant/lease",         icon: FileText,        label: "Lease Info"      },
  { href: "/tenant/announcements", icon: Bell,            label: "Announcements"   },
  { href: "/tenant/profile",       icon: User,            label: "Profile"         },
];

// ── Tooltip ─────────────────────────────────────────────────────────────────────

function Tooltip({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute left-full ml-3 z-50 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <div className="relative flex items-center">
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
        <div className="bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          {label}
        </div>
      </div>
    </div>
  );
}

// ── Nav link ─────────────────────────────────────────────────────────────────────

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link href={href} className="group relative flex items-center justify-center w-full py-0.5">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <Tooltip label={label} />
    </Link>
  );
}

// ── Logout confirmation modal ─────────────────────────────────────────────────────

function LogoutModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  // Close on Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Panel */}
      <div className="relative z-50 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close icon */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon + title */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
            <Power className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Log out?</h3>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              Are you sure you want to log out of PropManager?
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────────

export default function TenantSidebar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <aside className="flex flex-col items-center w-16 h-screen bg-white border-r border-slate-200 py-4 flex-shrink-0">

        {/* Logo */}
        <Link href="/tenant/dashboard" className="group relative flex items-center justify-center mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md transition-all group-hover:shadow-lg">
            <Building2 className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <Tooltip label="PropManager" />
        </Link>

        <div className="w-8 border-t border-slate-100 mb-4" />

        {/* Main nav */}
        <nav className="flex flex-col items-center gap-1 flex-1 w-full px-3">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}

          {/* Power / logout — sits directly below Profile */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="group relative flex items-center justify-center w-full py-0.5"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
              <Power className="h-5 w-5" strokeWidth={2} />
            </div>
            <Tooltip label="Log out" />
          </button>
        </nav>

      </aside>

      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}
    </>
  );
}
