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
    <Link
      href={href}
      className="tenant-nav-link"
      data-active={isActive ? "true" : "false"}
    >
      <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
      <span>{label}</span>
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
            className="rounded-lg bg-[#C4956A] px-4 py-2 text-sm font-semibold text-[#1A1714] shadow-sm transition hover:bg-[#B07E55] active:scale-95"
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
      <aside className="tenant-sidebar">

        {/* Logo */}
        <Link href="/tenant/dashboard" className="tenant-logo-row">
          <div className="tenant-logo">
            <Building2 className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="tenant-brand">PropManager</span>
        </Link>

        {/* Main nav */}
        <nav className="tenant-nav">
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
            className="tenant-nav-link tenant-logout"
          >
            <Power className="h-5 w-5" strokeWidth={2} />
            <span>Log out</span>
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
