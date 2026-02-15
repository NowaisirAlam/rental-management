"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CreditCard,
  Calendar,
  Clock,
  Wrench,
  Bell,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  CircleDot,
} from "lucide-react";

// ── Dummy data ─────────────────────────────────────────────────────────────────

const tenant = { name: "Sarah Johnson", unit: "Unit 4B", building: "Maplewood Residences" };

const rentInfo = { amount: 1850, dueDate: "Feb 1, 2026", daysUntilDue: 3, status: "Due Soon" as const };

const leaseEnd = "Aug 31, 2026";

const maintenanceRequests = [
  { id: 1, title: "Kitchen faucet dripping",   status: "In Progress", date: "Jan 28, 2026" },
  { id: 2, title: "Bathroom light flickering", status: "Submitted",   date: "Jan 30, 2026" },
];

const announcements = [
  {
    id: 1,
    title: "Scheduled water shut-off — Feb 3",
    body: "Building maintenance will shut off water from 9 AM – 12 PM on Feb 3.",
    priority: "warning" as const,
    date: "Jan 29, 2026",
  },
  {
    id: 2,
    title: "Lobby renovation complete",
    body: "The lobby renovation is finished. Enjoy the new look!",
    priority: "info" as const,
    date: "Jan 25, 2026",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const statusConfig = {
  "Paid":      { color: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  "Due Soon":  { color: "bg-amber-100 text-amber-700",  icon: Clock        },
  "Overdue":   { color: "bg-red-100   text-red-700",    icon: AlertCircle  },
};

const maintenanceStatusConfig: Record<string, string> = {
  "Submitted":   "bg-blue-100  text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Completed":   "bg-green-100 text-green-700",
};

const priorityConfig: Record<string, string> = {
  warning: "bg-amber-100 text-amber-700",
  info:    "bg-blue-100  text-blue-700",
  urgent:  "bg-red-100   text-red-700",
};

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session } = useSession();
  const displayName = session?.user?.name?.trim() || "there";
  const statusCfg = statusConfig[rentInfo.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8 lg:px-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {displayName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {tenant.unit} &middot; {tenant.building}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* Rent Due */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rent Due</p>
            <CreditCard className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">${rentInfo.amount.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <StatusIcon className="h-3.5 w-3.5" />
            <span className={`text-xs font-semibold ${statusCfg.color.split(" ")[1]}`}>
              {rentInfo.status}
            </span>
          </div>
        </div>

        {/* Due Date */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Due Date</p>
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 text-xl font-bold text-slate-900">{rentInfo.dueDate}</p>
          <p className="mt-1 text-xs text-slate-500">{rentInfo.daysUntilDue} days away</p>
        </div>

        {/* Lease Ends */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lease Ends</p>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 text-xl font-bold text-slate-900">{leaseEnd}</p>
          <p className="mt-1 text-xs text-slate-500">Fixed-term</p>
        </div>

        {/* Open Requests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Maintenance</p>
            <Wrench className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{maintenanceRequests.length}</p>
          <p className="mt-1 text-xs text-slate-500">Open requests</p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/tenant/payments"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            <CreditCard className="h-4 w-4" /> Pay Rent
          </Link>
          <Link
            href="/tenant/maintenance"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            <Wrench className="h-4 w-4" /> New Maintenance Request
          </Link>
          <Link
            href="/tenant/lease"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            View Lease
          </Link>
        </div>
      </div>

      {/* Two-column lower section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* Recent Maintenance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Recent Maintenance</h2>
            <Link href="/tenant/maintenance" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {maintenanceRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{req.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{req.date}</p>
                </div>
                <Badge label={req.status} className={maintenanceStatusConfig[req.status]} />
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Announcements</h2>
            <Link href="/tenant/announcements" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800 leading-snug">{a.title}</p>
                  <Badge label={a.priority} className={priorityConfig[a.priority]} />
                </div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">{a.body}</p>
                <p className="mt-1.5 text-xs text-slate-400">{a.date}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
