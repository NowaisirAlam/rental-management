"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  DollarSign,
  Clock,
  Home,
  Wrench,
  Plus,
  Users,
  Bell,
  CreditCard,
  Loader2,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type DashboardData = {
  role: string;
  stats: {
    totalProperties: number;
    totalRevenue: number;
    pendingPayments: number;
    openMaintenance: number;
  };
  recentPayments: {
    id: string;
    amount: number;
    status: string;
    dueDate: string;
    property: { name: string };
  }[];
  recentMaintenance: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    property: { name: string };
    createdBy: { name: string };
  }[];
};

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  helper,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{helper}</p>
        </div>
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

// ── Status helpers ───────────────────────────────────────────────────────────

const paymentStatusColor: Record<string, string> = {
  PAID: "bg-[#0d2818] text-[#30d158]",
  PENDING: "bg-[#2a1e00] text-[#ff9f0a]",
  LATE: "bg-[#2a0d0d] text-[#ff453a]",
};

const maintenanceStatusColor: Record<string, string> = {
  OPEN: "bg-[#0d1829] text-[#5e6ad2]",
  IN_PROGRESS: "bg-[#2a1e00] text-[#ff9f0a]",
  RESOLVED: "bg-[#0d2818] text-[#30d158]",
  CLOSED: "bg-[#1c1c1e] text-[#8a8a8e]",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandlordDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500">Loading dashboard...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32">
        <p className="text-sm text-red-600 mb-3">{error ?? "Failed to load"}</p>
        <button onClick={() => window.location.reload()} className="text-sm text-blue-600 hover:underline">
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentPayments, recentMaintenance } = data;
  const userName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8 lg:px-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {userName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s an overview of your properties for {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={DollarSign}
          iconBg="bg-[#0d2818]"
          iconColor="text-[#30d158]"
          label="Rent Received"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          helper="Total collected"
        />
        <StatCard
          icon={Clock}
          iconBg="bg-[#2a1e00]"
          iconColor="text-[#ff9f0a]"
          label="Pending Payments"
          value={String(stats.pendingPayments)}
          helper="Awaiting payment"
        />
        <StatCard
          icon={Home}
          iconBg="bg-[#0d1829]"
          iconColor="text-[#5e6ad2]"
          label="Properties"
          value={String(stats.totalProperties)}
          helper="Total properties"
        />
        <StatCard
          icon={Wrench}
          iconBg="bg-[#2a0d0d]"
          iconColor="text-[#ff453a]"
          label="Open Tickets"
          value={String(stats.openMaintenance)}
          helper="Active requests"
        />
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 mb-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/landlord/properties"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1e1e2e] px-4 py-2.5 text-sm font-semibold text-[#818cf8] transition hover:bg-[#252535] active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add New Property
          </Link>
          <Link
            href="/landlord/leases"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            <Users className="h-4 w-4" /> Add Tenant
          </Link>
          <Link
            href="/landlord/announcements"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            <Bell className="h-4 w-4" /> Create Announcement
          </Link>
          <Link
            href="/landlord/payments"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            <CreditCard className="h-4 w-4" /> View Payments
          </Link>
        </div>
      </div>

      {/* Lower two-column */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent payments */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Recent Payments</h2>
            <Link href="/landlord/payments" className="text-xs font-medium text-[#5e6ad2] hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentPayments.length === 0 && (
              <p className="text-sm text-slate-400 py-4 text-center">No payments yet.</p>
            )}
            {recentPayments.map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{row.property.name}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(row.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">${row.amount.toLocaleString()}</span>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${paymentStatusColor[row.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent maintenance */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Recent Maintenance</h2>
            <Link href="/landlord/maintenance" className="text-xs font-medium text-[#5e6ad2] hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentMaintenance.length === 0 && (
              <p className="text-sm text-slate-400 py-4 text-center">No maintenance requests yet.</p>
            )}
            {recentMaintenance.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{t.title}</p>
                  <p className="text-xs text-slate-400">{t.property.name}</p>
                </div>
                <span className={`flex-shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${maintenanceStatusColor[t.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}