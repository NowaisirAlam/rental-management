"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Calendar,
  Clock,
  Wrench,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ── DB status → display status ──────────────────────────────────────────────

const dbToDisplay: Record<string, string> = {
  OPEN: "Submitted",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Completed",
  CLOSED: "Completed",
};

const maintenanceStatusConfig: Record<string, string> = {
  "Submitted":   "bg-blue-100  text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Completed":   "bg-green-100 text-green-700",
};

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

// ── Helpers ──────────────────────────────────────────────────────────────────

function getRentStatus(dueDate: string | null, status: string | null) {
  if (status === "PAID") return "Paid" as const;
  if (!dueDate) return "Due Soon" as const;
  const diff = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Overdue" as const;
  return "Due Soon" as const;
}

const statusConfig = {
  "Paid":     { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  "Due Soon": { color: "bg-amber-100 text-amber-700", icon: Clock },
  "Overdue":  { color: "bg-red-100   text-red-700",   icon: AlertCircle },
};

// ── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
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
        <button onClick={() => window.location.reload()} className="text-sm text-blue-600 hover:underline">Retry</button>
      </div>
    );
  }

  const { stats, recentMaintenance } = data;
  const rentStatus = getRentStatus(stats.rentDueDate, stats.rentStatus);
  const statusCfg = statusConfig[rentStatus];
  const StatusIcon = statusCfg.icon;

  const dueDate = stats.rentDueDate
    ? new Date(stats.rentDueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";

  const daysUntilDue = stats.rentDueDate
    ? Math.ceil((new Date(stats.rentDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          {stats.propertyName ?? "No property assigned"}
          {stats.propertyAddress ? ` · ${stats.propertyAddress}` : ""}
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
          <p className="mt-3 text-3xl font-extrabold text-slate-900">${(stats.rentAmount ?? 0).toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <StatusIcon className="h-3.5 w-3.5" />
            <span className={`text-xs font-semibold ${statusCfg.color.split(" ")[1]}`}>
              {rentStatus}
            </span>
          </div>
        </div>

        {/* Due Date */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Due Date</p>
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 text-xl font-bold text-slate-900">{dueDate}</p>
          <p className="mt-1 text-xs text-slate-500">
            {daysUntilDue > 0 ? `${daysUntilDue} days away` : daysUntilDue === 0 ? "Due today" : `${Math.abs(daysUntilDue)} days overdue`}
          </p>
        </div>

        {/* Lease Ends */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lease Ends</p>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 text-xl font-bold text-slate-900">—</p>
          <p className="mt-1 text-xs text-slate-500">Not available</p>
        </div>

        {/* Open Requests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Maintenance</p>
            <Wrench className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{stats.openMaintenance ?? 0}</p>
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
            {(!recentMaintenance || recentMaintenance.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">No maintenance requests yet.</p>
            )}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {recentMaintenance?.map((req: any) => {
              const displayStatus = dbToDisplay[req.status] ?? req.status;
              return (
                <div key={req.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{req.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <Badge label={displayStatus} className={maintenanceStatusConfig[displayStatus] ?? "bg-slate-100 text-slate-600"} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements (static for now) */}
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