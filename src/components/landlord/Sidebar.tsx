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
  CreditCard,
  Power,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/landlord/dashboard",     icon: LayoutDashboard, label: "Dashboard"     },
  { href: "/landlord/payments",      icon: DollarSign,      label: "Payments"      },
  { href: "/landlord/maintenance",   icon: Wrench,          label: "Maintenance"   },
  { href: "/landlord/properties",    icon: Home,            label: "Properties"    },
  { href: "/landlord/leases",        icon: FileText,        label: "Leases"        },
  { href: "/landlord/announcements", icon: Bell,            label: "Announcements" },
  { href: "/landlord/billing",       icon: CreditCard,      label: "Billing"       },
  { href: "/landlord/profile",       icon: User,            label: "Profile"       },
];

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
    <Link
      href={href}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[15px] font-medium transition-all duration-150 ${
        isActive
          ? "bg-[#C4956A] text-[#1A1714]"
          : "text-[#A99E90] hover:bg-[rgba(196,149,106,0.12)] hover:text-[#C4956A]"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={isActive ? 2.5 : 2} />
      {label}
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
      <aside className="flex h-screen w-56 shrink-0 flex-col bg-[#1A1714] pt-12 pb-4 px-3">

        {/* Logo */}
        <Link href="/landlord/dashboard" className="flex items-center gap-3 px-2 mb-12">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C4956A] shadow-md">
            <Building2 className="h-6 w-6 text-[#1A1714]" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold text-[#F0EBE1]">PropManager</span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 w-full">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}

          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[15px] font-medium text-[#8a8a8e] hover:bg-[#2a1515] hover:text-[#ff453a] transition-all duration-150"
          >
            <Power className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            Log out
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
