"use client";

import { useState, useEffect } from "react";
import { ChevronDown, CheckCircle2, X, AlertTriangle, Loader2 } from "lucide-react";

type TicketStatus = "Submitted" | "In Progress" | "Completed";

// Map DB statuses ↔ display statuses
const dbToDisplay: Record<string, TicketStatus> = {
  OPEN: "Submitted",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Completed",
  CLOSED: "Completed",
};
const displayToDb: Record<TicketStatus, string> = {
  Submitted: "OPEN",
  "In Progress": "IN_PROGRESS",
  Completed: "RESOLVED",
};

type Ticket = {
  id: string;
  tenant: string;
  property: string;
  title: string;
  description: string;
  date: string;
  status: TicketStatus;
  urgent: boolean;
  contractor: string;
  notes: string;
};

const statusConfig: Record<TicketStatus, { badge: string; bar: string }> = {
  Submitted:     { badge: "bg-blue-100 text-blue-700",   bar: "bg-blue-500"  },
  "In Progress": { badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
  Completed:     { badge: "bg-green-100 text-green-700", bar: "bg-green-500" },
};

const progressWidth: Record<TicketStatus, string> = {
  Submitted:     "20%",
  "In Progress": "60%",
  Completed:     "100%",
};

// ── Toast ────────────────────────────────────────────────────────────────────

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

// ── Notes modal ──────────────────────────────────────────────────────────────

function NotesModal({
  ticket,
  onClose,
  onSave,
}: {
  ticket: Ticket;
  onClose: () => void;
  onSave: (notes: string, contractor: string) => void;
}) {
  const [notes, setNotes]           = useState(ticket.notes);
  const [contractor, setContractor] = useState(ticket.contractor);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Ticket Details</p>
            <h2 className="mt-1 text-base font-bold text-slate-900">{ticket.title}</h2>
            <p className="text-xs text-slate-500">{ticket.tenant} · {ticket.property}</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Assign Contractor</label>
            <input
              type="text"
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
              placeholder="e.g. Mike's Handyman"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Internal Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add notes for your records…"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition resize-none"
            />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95">
            Cancel
          </button>
          <button onClick={() => { onSave(notes, contractor); onClose(); }} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-95">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandlordMaintenance() {
  const [tickets, setTickets]   = useState<Ticket[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [toast, setToast]       = useState<string | null>(null);
  const [notesTicket, setNotesTicket] = useState<Ticket | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetch("/api/maintenance")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Ticket[] = data.map((r: any) => ({
          id: r.id,
          tenant: r.createdBy?.name ?? "Unknown",
          property: r.property?.name ?? "Unknown",
          title: r.title,
          description: r.description,
          date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          status: dbToDisplay[r.status] ?? "Submitted",
          urgent: false,
          contractor: "",
          notes: "",
        }));
        setTickets(mapped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const updateStatus = async (id: string, status: TicketStatus) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    try {
      const res = await fetch(`/api/maintenance/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: displayToDb[status] }),
      });
      if (!res.ok) throw new Error("Failed to update");
      showToast(`Status updated to "${status}".`);
    } catch {
      showToast("Failed to update status.");
    }
  };

  const toggleUrgent = (id: string) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, urgent: !t.urgent } : t));
  };

  const saveNotes = (id: string, notes: string, contractor: string) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, notes, contractor } : t));
    showToast("Ticket updated.");
  };

  const filtered = filterStatus === "All"
    ? tickets
    : tickets.filter((t) => t.status === filterStatus);

  const selectBase = "appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500">Loading tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32">
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button onClick={() => window.location.reload()} className="text-sm text-blue-600 hover:underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance Tickets</h1>
          <p className="mt-1 text-sm text-slate-500">Review and manage tenant-submitted maintenance requests.</p>
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectBase}>
            {["All", "Submitted", "In Progress", "Completed"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-16">No maintenance tickets found.</p>
      )}

      {/* Ticket cards */}
      <div className="space-y-4">
        {filtered.map((t) => {
          const cfg = statusConfig[t.status];
          return (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">

                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>{t.status}</span>
                    {t.urgent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                        <AlertTriangle className="h-3 w-3" /> Urgent
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{t.tenant} · {t.property}</p>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{t.description}</p>
                  {t.contractor && (
                    <p className="mt-1 text-xs text-blue-600 font-medium">Assigned: {t.contractor}</p>
                  )}
                  {t.notes && (
                    <p className="mt-1 text-xs text-slate-400 italic">{t.notes}</p>
                  )}
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="text-xs text-slate-400">{t.date}</p>

                  {/* Status dropdown */}
                  <div className="relative">
                    <select
                      value={t.status}
                      onChange={(e) => updateStatus(t.id, e.target.value as TicketStatus)}
                      className="appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none transition"
                    >
                      <option>Submitted</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNotesTicket(t)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Notes
                    </button>
                    <button
                      onClick={() => toggleUrgent(t.id)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                        t.urgent
                          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {t.urgent ? "Unmark" : "Mark Urgent"}
                    </button>
                  </div>
                </div>

              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div className={`h-1.5 rounded-full transition-all ${cfg.bar}`} style={{ width: progressWidth[t.status] }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {notesTicket && (
        <NotesModal
          ticket={notesTicket}
          onClose={() => setNotesTicket(null)}
          onSave={(notes, contractor) => saveNotes(notesTicket.id, notes, contractor)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}