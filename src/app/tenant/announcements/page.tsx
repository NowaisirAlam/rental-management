"use client";

import { useState, useEffect } from "react";
import { Bell, AlertTriangle, Info, AlertCircle, Loader2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Priority = "URGENT" | "WARNING" | "INFO";

type Announcement = {
  id: string;
  title: string;
  body: string;
  priority: Priority;
  date: string;
  unread: boolean;
};

type ApiAnnouncement = {
  id: string;
  title: string;
  message: string;
  priority: Priority;
  createdAt: string;
};

// ── Config ─────────────────────────────────────────────────────────────────────

const priorityCfg: Record<Priority, { badge: string; icon: React.ElementType; border: string; iconColor: string }> = {
  URGENT:  { badge: "bg-red-100   text-red-700",   icon: AlertCircle,   border: "border-red-200",   iconColor: "text-red-500"   },
  WARNING: { badge: "bg-amber-100 text-amber-700", icon: AlertTriangle, border: "border-amber-200", iconColor: "text-amber-500" },
  INFO:    { badge: "bg-blue-100  text-blue-700",  icon: Info,          border: "border-slate-200", iconColor: "text-blue-500"  },
};

const priorityLabel: Record<Priority, string> = {
  URGENT:  "Urgent",
  WARNING: "Notice",
  INFO:    "Info",
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AnnouncementsPage() {
  const [items,   setItems]   = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/announcements");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json() as ApiAnnouncement[];
        setItems(
          data.map((a) => ({
            id:       a.id,
            title:    a.title,
            body:     a.message,
            priority: a.priority,
            date:     fmt(a.createdAt),
            unread:   true,
          }))
        );
      } catch {
        setError("Could not load announcements. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const unreadCount = items.filter((a) => a.unread).length;

  const markAllRead = () => setItems((prev) => prev.map((a) => ({ ...a, unread: false })));
  const markRead    = (id: string) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, unread: false } : a)));

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-8 max-w-3xl mx-auto">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      </div>
    );
  }

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

      {/* Empty state */}
      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Bell className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No announcements</p>
          <p className="mt-1 text-xs text-slate-400">Your landlord hasn&apos;t posted any announcements yet.</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {items.map((a) => {
          const cfg  = priorityCfg[a.priority];
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
                      <h3 className="text-sm font-semibold text-slate-900 leading-snug">{a.title}</h3>
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
