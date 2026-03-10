"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Plus,
  X,
  CheckCircle2,
  MoreVertical,
  Eye,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type ApiRequest = {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  property: { name: string } | null;
};

type DisplayStatus = "Submitted" | "In Progress" | "Completed";

// ── Style maps ─────────────────────────────────────────────────────────────────

const statusConfig: Record<DisplayStatus, { badge: string; bar: string }> = {
  "Submitted":   { badge: "bg-blue-100  text-blue-700",  bar: "bg-blue-500"  },
  "In Progress": { badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
  "Completed":   { badge: "bg-green-100 text-green-700", bar: "bg-green-500" },
};

const progressWidth: Record<DisplayStatus, string> = {
  "Submitted":   "20%",
  "In Progress": "60%",
  "Completed":   "100%",
};

function toDisplayStatus(s: ApiRequest["status"]): DisplayStatus {
  if (s === "IN_PROGRESS") return "In Progress";
  if (s === "RESOLVED" || s === "CLOSED") return "Completed";
  return "Submitted";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Toast ──────────────────────────────────────────────────────────────────────

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

// ── Actions dropdown ───────────────────────────────────────────────────────────

function ActionsMenu({ onView }: { onView: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const item = "flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-lg";

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          <button className={item} onClick={() => { setOpen(false); onView(); }}>
            <Eye className="h-4 w-4 text-slate-400" /> View request
          </button>
        </div>
      )}
    </div>
  );
}

// ── View modal ─────────────────────────────────────────────────────────────────

function ViewModal({ req, onClose }: { req: ApiRequest; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const ds  = toDisplayStatus(req.status);
  const cfg = statusConfig[ds];

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="w-32 flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="flex-1 text-sm text-slate-800">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-6 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Maintenance Request</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900 leading-snug">{req.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 pb-2">
          {row("Status",
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
              {ds}
            </span>
          )}
          {row("Property",   req.property?.name ?? "—")}
          {row("Submitted",  fmtDate(req.createdAt))}
          {row("Description", <span className="leading-relaxed">{req.description}</span>)}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function MaintenancePage() {
  const [requests,   setRequests]   = useState<ApiRequest[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast,      setToast]      = useState<string | null>(null);

  const [showForm,    setShowForm]    = useState(false);
  const [title,       setTitle]       = useState("");
  const [issueType,   setIssueType]   = useState("");
  const [urgency,     setUrgency]     = useState("");
  const [description, setDescription] = useState("");

  const [viewReq, setViewReq] = useState<ApiRequest | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const loadRequests = async () => {
    try {
      const data = await fetch("/api/maintenance").then((r) => r.json()) as ApiRequest[];
      setRequests(data);
    } catch {
      setError("Could not load maintenance requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 15000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      const fullDescription = [
        issueType  ? `Category: ${issueType}`  : null,
        urgency    ? `Urgency: ${urgency}`      : null,
        description,
      ].filter(Boolean).join("\n\n");

      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: fullDescription }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        showToast(err.error ?? "Failed to submit request.");
        return;
      }

      await loadRequests();
      showToast("Maintenance request submitted successfully.");
      setTitle(""); setIssueType(""); setUrgency(""); setDescription("");
      setShowForm(false);
    } catch {
      showToast("Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectBase = "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none";

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">

      {/* Page header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance Requests</h1>
          <p className="mt-1 text-sm text-slate-500">Track and submit maintenance issues for your unit.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadRequests()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button
            onClick={() => { setTitle(""); setIssueType(""); setUrgency(""); setDescription(""); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            <Plus className="h-4 w-4" /> New Request
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-5">New Maintenance Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Kitchen faucet dripping"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Issue Type</label>
                <div className="relative">
                  <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className={selectBase}>
                    <option value="">Select category…</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>HVAC / Heating</option>
                    <option>Appliances</option>
                    <option>Structural / Windows</option>
                    <option>Pest Control</option>
                    <option>Common Areas</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Urgency</label>
                <div className="relative">
                  <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className={selectBase}>
                    <option value="">Select urgency…</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Emergency</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Describe the issue in detail…"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {requests.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No maintenance requests yet</p>
          <p className="mt-1 text-xs text-slate-400">Click &ldquo;New Request&rdquo; to report an issue.</p>
        </div>
      )}

      {/* Request cards */}
      <div className="space-y-4">
        {requests.map((req) => {
          const ds  = toDisplayStatus(req.status);
          const cfg = statusConfig[ds];
          return (
            <div key={req.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900">{req.title}</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
                      {ds}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">{req.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-slate-400 mr-1">{fmtDate(req.createdAt)}</p>
                    <ActionsMenu onView={() => setViewReq(req)} />
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-1.5 rounded-full transition-all ${cfg.bar}`}
                    style={{ width: progressWidth[ds] }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {viewReq && <ViewModal req={viewReq} onClose={() => setViewReq(null)} />}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
