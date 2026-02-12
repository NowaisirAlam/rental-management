"use client";

import { useState } from "react";
import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-react";

// ── Dummy data ─────────────────────────────────────────────────────────────────

type Priority = "urgent" | "warning" | "info";

const initialAnnouncements = [
  {
    id: 1,
    title: "Emergency: Gas Line Inspection — Feb 5",
    body: "A mandatory gas line safety inspection will be conducted on Feb 5 from 8 AM – 4 PM. Please ensure someone is home or contact management to make arrangements.",
    priority: "urgent" as Priority,
    date: "Jan 31, 2026",
    unread: true,
  },
  {
    id: 2,
    title: "Scheduled Water Shut-Off — Feb 3",
    body: "Building maintenance will temporarily shut off water to all units on Feb 3, 2026 between 9 AM and 12 PM for pipe repairs in the main line. We apologize for the inconvenience.",
    priority: "warning" as Priority,
    date: "Jan 29, 2026",
    unread: true,
  },
  {
    id: 3,
    title: "Lobby Renovation Complete",
    body: "We're thrilled to announce that the lobby renovation project is officially complete! The new seating area, lighting, and mail room are now open for residents.",
    priority: "info" as Priority,
    date: "Jan 25, 2026",
    unread: false,
  },
  {
    id: 4,
    title: "Parking Lot Resurfacing — Jan 20–21",
    body: "The visitor parking lot will be closed on Jan 20–21 for resurfacing. Resident parking will remain unaffected. Please plan accordingly.",
    priority: "warning" as Priority,
    date: "Jan 18, 2026",
    unread: false,
  },
  {
    id: 5,
    title: "Rent Payment Reminder",
    body: "This is a friendly reminder that monthly rent is due on the 1st of each month. A grace period of 5 days applies before late fees are assessed.",
    priority: "info" as Priority,
    date: "Jan 1, 2026",
    unread: false,
  },
];

// ── Priority config ────────────────────────────────────────────────────────────

const priorityCfg: Record<Priority, { badge: string; icon: React.ElementType; border: string; iconColor: string }> = {
  urgent:  { badge: "bg-red-100    text-red-700",    icon: AlertCircle,  border: "border-red-200",    iconColor: "text-red-500"    },
  warning: { badge: "bg-amber-100  text-amber-700",  icon: AlertTriangle, border: "border-amber-200", iconColor: "text-amber-500"  },
  info:    { badge: "bg-blue-100   text-blue-700",   icon: Info,          border: "border-slate-200",  iconColor: "text-blue-500"   },
};

const priorityLabel: Record<Priority, string> = {
  urgent:  "Urgent",
  warning: "Notice",
  info:    "Info",
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AnnouncementsPage() {
  const [items, setItems] = useState(initialAnnouncements);

  const unreadCount = items.filter((a) => a.unread).length;

  const markAllRead = () => setItems((prev) => prev.map((a) => ({ ...a, unread: false })));

  const markRead = (id: number) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, unread: false } : a)));

  return (
    <div className="px-8 py-8 max-w-3xl mx-auto">

      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">Building updates and important notices from management.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {items.map((a) => {
          const cfg = priorityCfg[a.priority];
          const Icon = cfg.icon;
          return (
            <div
              key={a.id}
              onClick={() => markRead(a.id)}
              className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                a.unread ? `${cfg.border} ring-1 ring-inset ring-current/10` : "border-slate-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 flex-shrink-0 ${cfg.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                        {a.title}
                      </h3>
                      {a.unread && (
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
                        {priorityLabel[a.priority]}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.body}</p>
                  <p className="mt-3 text-xs text-slate-400">{a.date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {unreadCount === 0 && items.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-4 text-sm text-slate-500">
          <Bell className="h-4 w-4" /> You&apos;re all caught up.
        </div>
      )}
    </div>
  );
}
