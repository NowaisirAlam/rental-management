"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Paperclip,
  Plus,
  X,
  CheckCircle2,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Status   = "Submitted" | "In Progress" | "Completed";
type Request  = {
  id:          number;
  title:       string;
  type:        string;
  urgency:     string;
  status:      Status;
  date:        string;
  description: string;
};

// ── Dummy data ─────────────────────────────────────────────────────────────────

const initialRequests: Request[] = [
  { id: 1, title: "Kitchen faucet dripping",   type: "Plumbing",            urgency: "Medium", status: "In Progress", date: "Jan 28, 2026", description: "The kitchen faucet drips constantly even when fully turned off." },
  { id: 2, title: "Bathroom light flickering", type: "Electrical",          urgency: "Low",    status: "Submitted",   date: "Jan 30, 2026", description: "Bathroom overhead light flickers intermittently." },
  { id: 3, title: "Bedroom window seal gap",   type: "Structural / Windows",urgency: "Low",    status: "Completed",   date: "Jan 10, 2026", description: "Cold air was coming through the bedroom window seal." },
];

// ── Style maps ─────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { badge: string; bar: string }> = {
  "Submitted":   { badge: "bg-blue-100  text-blue-700",  bar: "bg-blue-500"  },
  "In Progress": { badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
  "Completed":   { badge: "bg-green-100 text-green-700", bar: "bg-green-500" },
};

const urgencyConfig: Record<string, string> = {
  "Low":       "bg-slate-100  text-slate-600",
  "Medium":    "bg-amber-100  text-amber-700",
  "High":      "bg-orange-100 text-orange-700",
  "Emergency": "bg-red-100    text-red-700",
};

const progressWidth: Record<Status, string> = {
  "Submitted":   "20%",
  "In Progress": "60%",
  "Completed":   "100%",
};

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

function ActionsMenu({
  onView, onEdit, onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Esc
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
        aria-label="Request actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          <button className={item} onClick={() => { setOpen(false); onView(); }}>
            <Eye    className="h-4 w-4 text-slate-400" /> View request
          </button>
          <button className={item} onClick={() => { setOpen(false); onEdit(); }}>
            <Pencil className="h-4 w-4 text-slate-400" /> Edit request
          </button>
          <div className="my-1 border-t border-slate-100" />
          <button
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
            onClick={() => { setOpen(false); onDelete(); }}
          >
            <Trash2 className="h-4 w-4" /> Delete request
          </button>
        </div>
      )}
    </div>
  );
}

// ── View modal ─────────────────────────────────────────────────────────────────

function ViewModal({
  req,
  onClose,
  onEdit,
}: {
  req: Request;
  onClose: () => void;
  onEdit: () => void;
}) {
  // Close on Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const cfg = statusConfig[req.status];

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="w-32 flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="flex-1 text-sm text-slate-800">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
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

        {/* Details */}
        <div className="px-6 pb-2">
          {row("Status",
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
              {req.status}
            </span>
          )}
          {row("Urgency",
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${urgencyConfig[req.urgency]}`}>
              {req.urgency}
            </span>
          )}
          {row("Category",    req.type)}
          {row("Submitted",   req.date)}
          {row("Description", <span className="leading-relaxed">{req.description}</span>)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            Close
          </button>
          <button
            onClick={() => { onClose(); onEdit(); }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            Edit request
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm delete modal ───────────────────────────────────────────────────────

function ConfirmDeleteModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-50 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Delete request?</h3>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              Are you sure you want to delete this maintenance request? This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function MaintenancePage() {
  const [requests, setRequests]         = useState<Request[]>(initialRequests);
  const [toast, setToast]               = useState<string | null>(null);

  // Form
  const [showForm, setShowForm]         = useState(false);
  const [editingId, setEditingId]       = useState<number | null>(null);
  const [issueType, setIssueType]       = useState("");
  const [urgency, setUrgency]           = useState("");
  const [description, setDescription]   = useState("");
  const [fileName, setFileName]         = useState<string | null>(null);

  // Modals
  const [viewReq, setViewReq]           = useState<Request | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ── Open form for NEW request ──
  const openCreateForm = () => {
    setEditingId(null);
    setIssueType(""); setUrgency(""); setDescription(""); setFileName(null);
    setShowForm(true);
  };

  // ── Open form for EDIT ──
  const openEditForm = (req: Request) => {
    setEditingId(req.id);
    setIssueType(req.type);
    setUrgency(req.urgency);
    setDescription(req.description);
    setFileName(null);
    setShowForm(true);
    // Scroll form into view
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Save (create or update) ──
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType || !urgency || !description.trim()) return;

    if (editingId !== null) {
      // Update existing
      setRequests((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, type: issueType, urgency, description, title: description.slice(0, 50) + (description.length > 50 ? "…" : "") }
            : r
        )
      );
      showToast("Request updated.");
    } else {
      // Create new
      const newReq: Request = {
        id: Date.now(),
        title: description.slice(0, 50) + (description.length > 50 ? "…" : ""),
        type: issueType,
        urgency,
        status: "Submitted",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        description,
      };
      setRequests((prev) => [newReq, ...prev]);
      showToast("Maintenance request submitted successfully.");
    }

    setShowForm(false);
    setEditingId(null);
    setIssueType(""); setUrgency(""); setDescription(""); setFileName(null);
  };

  // ── Confirm delete ──
  const handleDeleteConfirm = () => {
    if (deleteTargetId === null) return;
    setRequests((prev) => prev.filter((r) => r.id !== deleteTargetId));
    setDeleteTargetId(null);
    showToast("Request deleted.");
  };

  const selectBase = "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none";

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">

      {/* Page header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance Requests</h1>
          <p className="mt-1 text-sm text-slate-500">Track and submit maintenance issues for your unit.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" /> New Request
        </button>
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-5">
            {editingId !== null ? "Edit Maintenance Request" : "New Maintenance Request"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">

            <div className="grid gap-4 md:grid-cols-2">
              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Issue Type</label>
                <div className="relative">
                  <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required className={selectBase}>
                    <option value="" disabled>Select category…</option>
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
                  <select value={urgency} onChange={(e) => setUrgency(e.target.value)} required className={selectBase}>
                    <option value="" disabled>Select urgency…</option>
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

            {/* File upload (mock) */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Attach Photo (optional)</label>
              <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 transition hover:border-blue-400 hover:bg-blue-50">
                <Paperclip className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">{fileName ?? "Click to attach a file"}</span>
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
              </label>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
              >
                {editingId !== null ? "Save Changes" : "Submit Request"}
              </button>
              <button type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Request cards */}
      <div className="space-y-4">
        {requests.map((req) => {
          const cfg = statusConfig[req.status];
          return (
            <div key={req.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">

                {/* Left content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900">{req.title}</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
                      {req.status}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${urgencyConfig[req.urgency]}`}>
                      {req.urgency}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{req.description}</p>
                </div>

                {/* Right — date + category + 3-dot menu */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <div className="text-right mr-1">
                      <p className="text-xs text-slate-400">{req.date}</p>
                      <p className="mt-0.5 text-xs font-medium text-slate-500">{req.type}</p>
                    </div>
                    <ActionsMenu
                      onView={() => setViewReq(req)}
                      onEdit={() => openEditForm(req)}
                      onDelete={() => setDeleteTargetId(req.id)}
                    />
                  </div>
                </div>

              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-1.5 rounded-full transition-all ${cfg.bar}`}
                    style={{ width: progressWidth[req.status] }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View modal */}
      {viewReq && (
        <ViewModal
          req={viewReq}
          onClose={() => setViewReq(null)}
          onEdit={() => { setViewReq(null); openEditForm(viewReq); }}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTargetId !== null && (
        <ConfirmDeleteModal
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
