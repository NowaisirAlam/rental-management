"use client";

import { useState, useEffect } from "react";
import { Plus, Bell, Trash2, X, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Priority = "INFO" | "WARNING" | "URGENT";

type Announcement = {
  id: string;
  title: string;
  message: string;
  priority: Priority;
  propertyId: string | null;
  property: { name: string } | null;
  createdAt: string;
};

type Property = { id: string; name: string };

// ── Config ─────────────────────────────────────────────────────────────────────

const priorityConfig: Record<Priority, { badge: string; dot: string; label: string }> = {
  INFO:    { badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-500",   label: "Info"    },
  WARNING: { badge: "bg-[#2a1e00] text-[#ff9f0a]", dot: "bg-[#ff9f0a]",  label: "Warning" },
  URGENT:  { badge: "bg-red-100 text-red-700",     dot: "bg-red-500",    label: "Urgent"  },
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ── Helpers ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-white shadow-xl">
      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

const inputClass  = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const selectClass = "mt-1.5 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const labelClass  = "block text-xs font-medium uppercase tracking-wide text-slate-400";

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LandlordAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [properties,    setProperties]    = useState<Property[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [showForm,      setShowForm]      = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [toast,         setToast]         = useState<string | null>(null);

  const [title,      setTitle]      = useState("");
  const [message,    setMessage]    = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [priority,   setPriority]   = useState<Priority>("INFO");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const resetForm = () => { setTitle(""); setMessage(""); setPropertyId(""); setPriority("INFO"); };

  useEffect(() => {
    const load = async () => {
      try {
        const [anns, props] = await Promise.all([
          fetch("/api/announcements").then((r) => r.json()),
          fetch("/api/properties").then((r) => r.json()),
        ]);
        setAnnouncements(anns);
        setProperties(props);
      } catch {
        setError("Could not load announcements. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          priority,
          propertyId: propertyId || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        showToast(err.error ?? "Failed to publish.");
        return;
      }
      const updated = await fetch("/api/announcements").then((r) => r.json()) as Announcement[];
      setAnnouncements(updated);
      showToast("Announcement published.");
      resetForm();
      setShowForm(false);
    } catch {
      showToast("Failed to publish announcement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      if (!res.ok) { showToast("Failed to delete."); return; }
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      showToast("Announcement deleted.");
    } catch {
      showToast("Failed to delete announcement.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#5e6ad2]" />
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

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="mt-1 text-sm text-slate-500">Post updates and notices for your tenants.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1e1e2e] px-4 py-2.5 text-sm font-semibold text-[#818cf8] transition hover:bg-[#252535] active:scale-95"
        >
          <Plus className="h-4 w-4" /> New Announcement
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-slate-900">Create Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Water Shutoff Notice"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Write the full announcement for tenants…"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            <div>
              <label className={labelClass}>Property</label>
              <div className="relative">
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className={selectClass}
                >
                  <option value="">All Properties</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div>
              <label className={`${labelClass} mb-2`}>Priority</label>
              <div className="flex gap-2">
                {(["INFO", "WARNING", "URGENT"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition ${
                      priority === p
                        ? `${priorityConfig[p].badge} border-transparent`
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#1e1e2e] px-5 py-2.5 text-sm font-semibold text-[#818cf8] transition hover:bg-[#252535] active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Publishing…" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Empty state */}
      {announcements.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Bell className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No announcements yet</p>
          <p className="mt-1 text-xs text-slate-400">Click &ldquo;New Announcement&rdquo; to post your first notice.</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {announcements.map((a) => {
          const cfg = priorityConfig[a.priority];
          return (
            <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${cfg.dot}`} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{a.title}</p>
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{a.property?.name ?? "All Properties"}</p>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.message}</p>
                    <p className="mt-2 text-xs text-slate-400">{fmt(a.createdAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
