"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, FileText, X, CheckCircle2, ChevronDown,
  MoreVertical, Eye, Pencil, Trash2, AlertTriangle,
} from "lucide-react";

type Lease = {
  id: number;
  property: string;
  unit: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  startDate: string;
  endDate: string;
  rent: string;
  deposit: string;
};

const initialLeases: Lease[] = [
  { id: 1, property: "Maplewood Residences", unit: "Unit 2A", tenantName: "Marcus Reid",   tenantEmail: "marcus@email.com",  tenantPhone: "+1 416 555-0101", startDate: "2024-09-01", endDate: "2026-08-31", rent: "1800", deposit: "3600" },
  { id: 2, property: "Maplewood Residences", unit: "Unit 3C", tenantName: "Priya Sharma",  tenantEmail: "priya@email.com",   tenantPhone: "+1 416 555-0202", startDate: "2025-01-01", endDate: "2026-12-31", rent: "2200", deposit: "4400" },
  { id: 3, property: "Oakview Apartments",   unit: "Unit 1B", tenantName: "Tom Eriksson",  tenantEmail: "tom@email.com",     tenantPhone: "+1 905 555-0303", startDate: "2024-06-01", endDate: "2026-05-31", rent: "1400", deposit: "2800" },
  { id: 4, property: "Oakview Apartments",   unit: "Unit 4D", tenantName: "Lena Kowalski", tenantEmail: "lena@email.com",    tenantPhone: "+1 905 555-0404", startDate: "2023-03-01", endDate: "2026-02-28", rent: "1400", deposit: "2800" },
];

const PROPERTIES = ["Maplewood Residences", "Oakview Apartments"];

// ── Shared helpers ────────────────────────────────────────────────────────────

const inputClass  = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const selectClass = "mt-1.5 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const labelClass  = "block text-xs font-medium uppercase tracking-wide text-slate-400";
const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) : "—";

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-white shadow-xl">
      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition"><X className="h-4 w-4" /></button>
    </div>
  );
}

// ── Actions menu ──────────────────────────────────────────────────────────────

function ActionsMenu({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
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
        aria-label="Lease actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          <button className={item} onClick={() => { setOpen(false); onView(); }}>
            <Eye className="h-4 w-4 text-slate-400" /> View Lease
          </button>
          <button className={item} onClick={() => { setOpen(false); onEdit(); }}>
            <Pencil className="h-4 w-4 text-slate-400" /> Edit Lease
          </button>
          <div className="my-1 border-t border-slate-100" />
          <button
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
            onClick={() => { setOpen(false); onDelete(); }}
          >
            <Trash2 className="h-4 w-4" /> Delete Lease
          </button>
        </div>
      )}
    </div>
  );
}

// ── View lease modal ──────────────────────────────────────────────────────────

function ViewLeaseModal({ lease, onClose, onEdit }: { lease: Lease; onClose: () => void; onEdit: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const row = (label: string, value: string) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="w-28 flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="flex-1 text-sm text-slate-800">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-6 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Lease Agreement</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900 leading-snug">{lease.tenantName}</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 pb-2">
          {row("Property",  lease.property)}
          {row("Unit",      lease.unit)}
          {row("Email",     lease.tenantEmail)}
          {lease.tenantPhone && row("Phone", lease.tenantPhone)}
          {row("Lease",     `${fmt(lease.startDate)} – ${fmt(lease.endDate)}`)}
          {row("Rent",      `$${Number(lease.rent).toLocaleString()} / month`)}
          {lease.deposit && row("Deposit", `$${Number(lease.deposit).toLocaleString()}`)}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95">
            Close
          </button>
          <button onClick={() => { onClose(); onEdit(); }} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95">
            Edit Lease
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm delete modal ──────────────────────────────────────────────────────

function ConfirmDeleteModal({ title, onCancel, onConfirm }: { title: string; onCancel: () => void; onConfirm: () => void }) {
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
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">This action cannot be undone.</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandlordLeases() {
  const [leases, setLeases]             = useState<Lease[]>(initialLeases);
  const [showForm, setShowForm]         = useState(false);
  const [editingId, setEditingId]       = useState<number | null>(null);
  const [viewLease, setViewLease]       = useState<Lease | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [toast, setToast]               = useState<string | null>(null);

  const [property,    setProperty]    = useState("");
  const [unit,        setUnit]        = useState("");
  const [tenantName,  setTenantName]  = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [startDate,   setStartDate]   = useState("");
  const [endDate,     setEndDate]     = useState("");
  const [rent,        setRent]        = useState("");
  const [deposit,     setDeposit]     = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const resetForm = () => {
    setProperty(""); setUnit(""); setTenantName(""); setTenantEmail("");
    setTenantPhone(""); setStartDate(""); setEndDate(""); setRent(""); setDeposit("");
  };

  const openEditForm = (l: Lease) => {
    setEditingId(l.id);
    setProperty(l.property); setUnit(l.unit); setTenantName(l.tenantName);
    setTenantEmail(l.tenantEmail); setTenantPhone(l.tenantPhone);
    setStartDate(l.startDate); setEndDate(l.endDate); setRent(l.rent); setDeposit(l.deposit);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId !== null) {
      setLeases((prev) =>
        prev.map((l) => l.id === editingId
          ? { ...l, property, unit, tenantName, tenantEmail, tenantPhone, startDate, endDate, rent, deposit }
          : l
        )
      );
      showToast("Lease updated.");
    } else {
      const lease: Lease = { id: Date.now(), property, unit, tenantName, tenantEmail, tenantPhone, startDate, endDate, rent, deposit };
      setLeases((prev) => [lease, ...prev]);
      showToast("Lease created successfully.");
    }
    resetForm();
    setEditingId(null);
    setShowForm(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId === null) return;
    setLeases((prev) => prev.filter((l) => l.id !== deleteTargetId));
    setDeleteTargetId(null);
    showToast("Lease deleted.");
  };

  const daysUntil = (d: string) => {
    if (!d) return null;
    return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  };

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leases &amp; Tenant Assignment</h1>
          <p className="mt-1 text-sm text-slate-500">Assign tenants to units and manage lease agreements.</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingId(null); setShowForm((v) => !v); }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Lease
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-slate-900">
            {editingId !== null ? "Edit Lease" : "New Lease"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600">Step 1 — Select Property &amp; Unit</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Property</label>
                  <div className="relative">
                    <select value={property} onChange={(e) => setProperty(e.target.value)} required className={selectClass}>
                      <option value="" disabled>Select property…</option>
                      {PROPERTIES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Unit</label>
                  <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required placeholder="e.g. Unit 2A" className={inputClass} />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600">Step 2 — Tenant Details</p>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required placeholder="Jane Doe" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={tenantEmail} onChange={(e) => setTenantEmail(e.target.value)} required placeholder="jane@email.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" value={tenantPhone} onChange={(e) => setTenantPhone(e.target.value)} placeholder="+1 416 555-0000" className={inputClass} />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600">Step 3 — Lease Terms</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Monthly Rent ($)</label>
                  <input type="number" value={rent} onChange={(e) => setRent(e.target.value)} required min="0" placeholder="1800" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Security Deposit ($)</label>
                  <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} min="0" placeholder="3600" className={inputClass} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95">
                {editingId !== null ? "Save Changes" : "Create Lease"}
              </button>
              <button type="button" onClick={() => { resetForm(); setEditingId(null); setShowForm(false); }} className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lease cards */}
      <div className="space-y-4">
        {leases.map((l) => {
          const days = daysUntil(l.endDate);
          const expiringSoon = days !== null && days >= 0 && days <= 60;
          const expired      = days !== null && days < 0;
          return (
            <div key={l.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{l.tenantName}</p>
                      {expiringSoon && !expired && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Expires in {days}d</span>
                      )}
                      {expired && (
                        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Expired</span>
                      )}
                      {!expiringSoon && !expired && (
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">Active</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">{l.unit} · {l.property}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>{l.tenantEmail}</span>
                      {l.tenantPhone && <span>{l.tenantPhone}</span>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span><span className="font-medium text-slate-700">Lease:</span> {fmt(l.startDate)} – {fmt(l.endDate)}</span>
                      <span><span className="font-medium text-slate-700">Rent:</span> ${Number(l.rent).toLocaleString()}/mo</span>
                      {l.deposit && <span><span className="font-medium text-slate-700">Deposit:</span> ${Number(l.deposit).toLocaleString()}</span>}
                    </div>
                  </div>
                </div>

                {/* 3-dot actions menu */}
                <ActionsMenu
                  onView={() => setViewLease(l)}
                  onEdit={() => openEditForm(l)}
                  onDelete={() => setDeleteTargetId(l.id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {viewLease && (
        <ViewLeaseModal
          lease={viewLease}
          onClose={() => setViewLease(null)}
          onEdit={() => { setViewLease(null); openEditForm(viewLease); }}
        />
      )}

      {deleteTargetId !== null && (
        <ConfirmDeleteModal
          title="Delete lease?"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
