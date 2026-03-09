"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  DollarSign,
  Wrench,
  Home,
  FileText,
  Bell,
  User,
  Power,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/landlord/dashboard",     icon: LayoutDashboard, label: "Dashboard"    },
  { href: "/landlord/payments",      icon: DollarSign,      label: "Payments"     },
  { href: "/landlord/maintenance",   icon: Wrench,          label: "Maintenance"  },
  { href: "/landlord/properties",    icon: Home,            label: "Properties"   },
  { href: "/landlord/leases",        icon: FileText,        label: "Leases"       },
  { href: "/landlord/announcements", icon: Bell,            label: "Announcements"},
  { href: "/landlord/profile",       icon: User,            label: "Profile"      },
];

// ── Tooltip ──────────────────────────────────────────────────────────────────

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

// ── Nav link ─────────────────────────────────────────────────────────────────

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
            ? "bg-[#1e1e2e] text-[#5e6ad2]"
            : "text-[#8a8a8e] hover:bg-[#1c1c1e] hover:text-[#f2f2f7]"
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <Tooltip label={label} />
    </Link>
  );
}

// ── Logout modal ─────────────────────────────────────────────────────────────

function LogoutModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-50 w-full max-w-sm rounded-2xl bg-[#1c1c1e] p-6 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-[#5a5a5e] transition hover:bg-[#2a2a2c] hover:text-[#f2f2f7]"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2a2a2c]">
            <Power className="h-5 w-5 text-[#aeaeb2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#f2f2f7]">Log out?</h3>
            <p className="mt-1.5 text-sm text-[#8a8a8e] leading-relaxed">
              Are you sure you want to log out of PropManager?
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-[#3a3a3c] bg-[#1c1c1e] px-4 py-2 text-sm font-semibold text-[#d1d1d6] transition hover:bg-[#2a2a2c] active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-[#2a2a2c] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3a3a3c] active:scale-95"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function LandlordSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("landlordOnboarded");
    router.push("/");
  };

  return (
    <>
      <aside className="flex h-screen w-16 shrink-0 flex-col items-center border-r border-[#2a2a2c] bg-[#141415] py-4">

        {/* Logo */}
        <Link href="/landlord/dashboard" className="group relative flex items-center justify-center mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#5e6ad2] to-[#4a54b8] shadow-md transition-all group-hover:shadow-lg">
            <Building2 className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <Tooltip label="PropManager" />
        </Link>

        <div className="w-8 border-t border-[#2a2a2c] mb-4" />

        {/* Nav */}
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
            <div className="flex items-center justify-center w-10 h-10 rounded-xl text-[#8a8a8e] hover:bg-[#2a1515] hover:text-[#ff453a] transition-all duration-200">
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
