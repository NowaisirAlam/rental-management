"use client";

import Link from "next/link";
import {
  DollarSign,
  Clock,
  AlertTriangle,
  Wrench,
  Plus,
  Users,
  Bell,
  CreditCard,
} from "lucide-react";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandlordDashboard() {
  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, James</h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s an overview of your properties for {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={DollarSign}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          label="Rent Received"
          value="$18,400"
          helper="This month · 8 of 10 paid"
        />
        <StatCard
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="Pending Payments"
          value="2"
          helper="$2,800 outstanding"
        />
        <StatCard
          icon={AlertTriangle}
          iconBg="bg-red-50"
          iconColor="text-red-500"
          label="Leases Expiring"
          value="3"
          helper="Within next 60 days"
        />
        <StatCard
          icon={Wrench}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Open Tickets"
          value="5"
          helper="2 high priority"
        />
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/landlord/properties"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Recent Payments</h2>
            <Link href="/landlord/payments" className="text-xs font-medium text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { name: "Marcus Reid",    unit: "Unit 2A", amount: "$1,800", status: "Paid",    color: "bg-green-100 text-green-700" },
              { name: "Priya Sharma",   unit: "Unit 3C", amount: "$2,200", status: "Paid",    color: "bg-green-100 text-green-700" },
              { name: "Tom Eriksson",   unit: "Unit 1B", amount: "$1,400", status: "Pending", color: "bg-amber-100 text-amber-700" },
              { name: "Lena Kowalski",  unit: "Unit 4D", amount: "$1,400", status: "Overdue", color: "bg-red-100 text-red-700"   },
            ].map((row) => (
              <div key={row.name} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{row.name}</p>
                  <p className="text-xs text-slate-400">{row.unit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{row.amount}</span>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${row.color}`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent maintenance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Recent Maintenance</h2>
            <Link href="/landlord/maintenance" className="text-xs font-medium text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { title: "Leaking pipe under sink",  unit: "Unit 2A", priority: "High",   color: "bg-orange-100 text-orange-700" },
              { title: "Broken window lock",        unit: "Unit 3C", priority: "Medium", color: "bg-amber-100 text-amber-700"  },
              { title: "HVAC not working",          unit: "Unit 1B", priority: "High",   color: "bg-orange-100 text-orange-700" },
              { title: "Light bulb replacement",    unit: "Unit 4D", priority: "Low",    color: "bg-slate-100 text-slate-600"  },
            ].map((t) => (
              <div key={t.title} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{t.title}</p>
                  <p className="text-xs text-slate-400">{t.unit}</p>
                </div>
                <span className={`flex-shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.color}`}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
