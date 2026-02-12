"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  LayoutDashboard,
  Users,
  DollarSign,
  Wrench,
  DoorOpen,
  Settings,
  X,
  Menu,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/landlord/dashboard", icon: LayoutDashboard },
  { label: "Properties", href: "/landlord/properties", icon: Building2 },
  { label: "Tenants", href: "/landlord/tenants", icon: Users },
  { label: "Rent", href: "/landlord/rent", icon: DollarSign },
  { label: "Maintenance", href: "/landlord/maintenance", icon: Wrench },
  { label: "Vacancies", href: "/landlord/vacancies", icon: DoorOpen },
  { label: "Settings", href: "/landlord/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-accent lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-6">
          <Building2 className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold text-white">PropManager</span>
        </div>
        <div className="mt-4 flex-1 overflow-y-auto">{nav}</div>
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-accent">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
              <div className="flex items-center gap-2.5">
                <Building2 className="h-7 w-7 text-primary" />
                <span className="text-lg font-bold text-white">PropManager</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/60 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto">{nav}</div>
          </aside>
        </div>
      )}
    </>
  );
}
