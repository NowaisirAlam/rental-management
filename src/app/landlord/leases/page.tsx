"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, FileText, X, CheckCircle2, ChevronDown,
  MoreVertical, Eye, Pencil, Trash2, AlertTriangle, Loader2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ParsedUtility  = { name: string; included: boolean };
type ParsedOccupant = { name: string; role: string };

type Lease = {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string | null;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  depositAmount: number;
  status: string;
  utilities: ParsedUtility[];
  occupants: ParsedOccupant[];
};

type ApiTenant = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  propertyId: string | null;
};

type ApiProperty = {
  id: string;
  name: string;
  address: string;
};

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_UTILITIES: ParsedUtility[] = [
  { name: "Heat",        included: false },
  { name: "Water",       included: false },
  { name: "Electricity", included: false },
  { name: "Internet",    included: false },
  { name: "Gas",         included: false },
  { name: "Trash",       included: false },
];

const STATUS_OPTIONS = ["ACTIVE", "PENDING", "EXPIRED", "TERMINATED"];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) : "—";

function parseApiLease(raw: Record<string, unknown>): Lease {
  const includedNames: string[] = (() => {
    try { return JSON.parse(raw.utilities as string) as string[]; } catch { return []; }
  })();
  const rawOccupants: ParsedOccupant[] = (() => {
    try { return JSON.parse(raw.occupants as string) as ParsedOccupant[]; } catch { return []; }
  })();
  const tenant = raw.tenant as { id: string; name: string; email: string; phone: string | null };
  const property = raw.property as { name: string; address: string };
  return {
    id: raw.id as string,
    tenantId: raw.tenantId as string,
    tenantName: tenant?.name ?? "",
    tenantEmail: tenant?.email ?? "",
    tenantPhone: tenant?.phone ?? null,
    propertyId: raw.propertyId as string,
    propertyName: property?.name ?? "",
    propertyAddress: property?.address ?? "",
    startDate: (raw.startDate as string).slice(0, 10),
    endDate: (raw.endDate as string).slice(0, 10),
    rentAmount: raw.rentAmount as number,
    depositAmount: raw.depositAmount as number,
    status: raw.status as string,
    utilities: DEFAULT_UTILITIES.map((u) => ({ ...u, included: includedNames.includes(u.name) })),
    occupants: rawOccupants,
  };
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputClass  = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const selectClass = "mt-1.5 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const labelClass  = "block text-xs font-medium uppercase tracking-wide text-slate-400";
const inlineInput = "w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

// ── Section title ─────────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <div className="flex-1 border-t border-slate-200" />
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
      <div className="flex-1 border-t border-slate-200" />
    </div>
  );
}

// ── EditField ─────────────────────────────────────────────────────────────────

function EditField({
  label, value, onChange, type = "text", placeholder = "", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required} className={inputClass}
      />
    </div>
  );
}

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

  const row = (label: string, value: string) => value ? (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="w-32 flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="flex-1 text-sm text-slate-800">{value}</span>
    </div>
  ) : null;

  const includedUtils = lease.utilities.filter((u) => u.included).map((u) => u.name);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between gap-4 p-6 pb-4 flex-shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Lease Agreement</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900 leading-snug">{lease.tenantName}</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 pb-2 overflow-y-auto flex-1">
          {row("Property",  lease.propertyName)}
          {row("Address",   lease.propertyAddress)}
          {row("Status",    lease.status)}
          {row("Tenant",    lease.tenantName)}
          {row("Email",     lease.tenantEmail)}
          {lease.tenantPhone ? row("Phone", lease.tenantPhone) : null}
          {row("Lease",     `${fmt(lease.startDate)} – ${fmt(lease.endDate)}`)}
          {row("Rent",      `$${lease.rentAmount.toLocaleString()} / month`)}
          {lease.depositAmount > 0 ? row("Deposit", `$${lease.depositAmount.toLocaleString()}`) : null}
          {includedUtils.length > 0 ? row("Utilities", includedUtils.join(", ")) : null}
          {lease.occupants.length > 0 ? row("Occupants",
            lease.occupants.map((o) => `${o.name} (${o.role})`).join(", ")
          ) : null}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 flex-shrink-0">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95">
            Close
          </button>
          <button onClick={() => { onClose(); onEdit(); }} className="rounded-lg bg-[#1e1e2e] px-4 py-2 text-sm font-semibold text-[#818cf8] transition hover:bg-[#252535] active:scale-95">
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
  const [leases,         setLeases]         = useState<Lease[]>([]);
  const [tenants,        setTenants]        = useState<ApiTenant[]>([]);
  const [properties,     setProperties]     = useState<ApiProperty[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState<string | null>(null);
  const [showForm,       setShowForm]       = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [editingId,      setEditingId]      = useState<string | null>(null);
  const [viewLease,      setViewLease]      = useState<Lease | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toast,          setToast]          = useState<string | null>(null);

  // ── Form state ────────────────────────────────────────────────────────────
  const [tenantId,      setTenantId]      = useState("");
  const [propertyId,    setPropertyId]    = useState("");
  const [startDate,     setStartDate]     = useState("");
  const [endDate,       setEndDate]       = useState("");
  const [termLength,    setTermLength]    = useState("");
  const [rentAmount,    setRentAmount]    = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [status,        setStatus]        = useState("ACTIVE");
  const [formUtilities, setFormUtilities] = useState<ParsedUtility[]>(DEFAULT_UTILITIES.map((u) => ({ ...u })));
  const [formOccupants, setFormOccupants] = useState<ParsedOccupant[]>([]);
  const [newOccName,    setNewOccName]    = useState("");
  const [newOccRole,    setNewOccRole]    = useState("");

  // ── Data fetching ─────────────────────────────────────────────────────────
  const fetchLeases = async () => {
    const res = await fetch("/api/leases");
    if (!res.ok) throw new Error("Failed to load leases");
    const data = await res.json() as Record<string, unknown>[];
    setLeases(data.map(parseApiLease));
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [leasesRes, tenantsRes, propertiesRes] = await Promise.all([
          fetch("/api/leases"),
          fetch("/api/tenants"),
          fetch("/api/properties"),
        ]);
        if (!leasesRes.ok || !tenantsRes.ok || !propertiesRes.ok) throw new Error("Failed to load data");
        const [leasesData, tenantsData, propertiesData] = await Promise.all([
          leasesRes.json() as Promise<Record<string, unknown>[]>,
          tenantsRes.json() as Promise<ApiTenant[]>,
          propertiesRes.json() as Promise<ApiProperty[]>,
        ]);
        setLeases(leasesData.map(parseApiLease));
        setTenants(tenantsData);
        setProperties(propertiesData);
      } catch {
        setError("Could not load leases. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Auto-calc term length ─────────────────────────────────────────────────
  useEffect(() => {
    if (!startDate || !endDate) return;
    const s = new Date(startDate), e = new Date(endDate);
    const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    if (months > 0) setTermLength(`${months} month${months !== 1 ? "s" : ""}`);
  }, [startDate, endDate]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const resetForm = () => {
    setTenantId(""); setPropertyId(""); setStartDate(""); setEndDate("");
    setTermLength(""); setRentAmount(""); setDepositAmount(""); setStatus("ACTIVE");
    setFormUtilities(DEFAULT_UTILITIES.map((u) => ({ ...u })));
    setFormOccupants([]); setNewOccName(""); setNewOccRole("");
  };

  const openEditForm = (l: Lease) => {
    setEditingId(l.id);
    setTenantId(l.tenantId); setPropertyId(l.propertyId);
    setStartDate(l.startDate); setEndDate(l.endDate);
    setTermLength("");
    setRentAmount(String(l.rentAmount)); setDepositAmount(String(l.depositAmount));
    setStatus(l.status);
    setFormUtilities(l.utilities.map((u) => ({ ...u })));
    setFormOccupants(l.occupants.map((o) => ({ ...o })));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleUtility = (name: string) =>
    setFormUtilities((prev) => prev.map((u) => u.name === name ? { ...u, included: !u.included } : u));

  const addOccupant = () => {
    if (!newOccName.trim()) return;
    setFormOccupants((prev) => [...prev, { name: newOccName.trim(), role: newOccRole.trim() || "Occupant" }]);
    setNewOccName(""); setNewOccRole("");
  };

  const removeOccupant = (idx: number) =>
    setFormOccupants((prev) => prev.filter((_, i) => i !== idx));

  const updateOccupant = (idx: number, field: "name" | "role", val: string) =>
    setFormOccupants((prev) => prev.map((o, i) => i === idx ? { ...o, [field]: val } : o));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        propertyId,
        tenantId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        rentAmount: Number(rentAmount),
        depositAmount: Number(depositAmount) || 0,
        status,
        utilities: formUtilities.filter((u) => u.included).map((u) => u.name),
        occupants: formOccupants,
      };

      if (editingId !== null) {
        const res = await fetch(`/api/leases/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) { const d = await res.json() as { error: string }; throw new Error(d.error); }
        showToast("Lease updated.");
      } else {
        const res = await fetch("/api/leases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) { const d = await res.json() as { error: string }; throw new Error(d.error); }
        // Also assign the tenant to the property
        await fetch(`/api/tenants/${tenantId}/assign`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });
        showToast("Lease created and tenant assigned.");
      }

      await fetchLeases();
      resetForm(); setEditingId(null); setShowForm(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/leases/${deleteTargetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setDeleteTargetId(null);
      await fetchLeases();
      showToast("Lease deleted.");
    } catch {
      showToast("Could not delete lease.");
    }
  };

  const daysUntil = (d: string) =>
    Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#5e6ad2]" />
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

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leases &amp; Tenant Assignment</h1>
          <p className="mt-1 text-sm text-slate-500">Assign tenants to units and manage lease agreements.</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingId(null); setShowForm((v) => !v); }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1e1e2e] px-4 py-2.5 text-sm font-semibold text-[#818cf8] transition hover:bg-[#252535] active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Lease
        </button>
      </div>

      {/* ── Create / Edit Form ──────────────────────────────────────────────── */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              {editingId !== null ? "Edit Lease" : "New Lease"}
            </h2>

            {/* Tenant & Property */}
            <SectionTitle title="Lease Summary" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Tenant</label>
                <div className="relative">
                  <select value={tenantId} onChange={(e) => setTenantId(e.target.value)} required disabled={editingId !== null} className={selectClass}>
                    <option value="" disabled>Select tenant…</option>
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.email}){t.propertyId ? " — assigned" : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Property</label>
                <div className="relative">
                  <select value={propertyId} onChange={(e) => setPropertyId(e.target.value)} required disabled={editingId !== null} className={selectClass}>
                    <option value="" disabled>Select property…</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Lease Status</label>
                <div className="relative">
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                    {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Lease Duration */}
            <SectionTitle title="Lease Duration" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <EditField label="Start Date" value={startDate} onChange={setStartDate} type="date" required />
              <EditField label="End Date"   value={endDate}   onChange={setEndDate}   type="date" required />
              <div>
                <label className={labelClass}>Term Length</label>
                <input type="text" value={termLength} readOnly placeholder="Auto-calculated"
                  className={`${inputClass} bg-slate-50 text-slate-500`} />
              </div>
            </div>

            {/* Financials */}
            <SectionTitle title="Financials" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Monthly Rent ($)</label>
                <input type="number" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} required min="0" placeholder="1800" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Security Deposit ($)</label>
                <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} min="0" placeholder="3600" className={inputClass} />
              </div>
            </div>

            {/* Utilities */}
            <SectionTitle title="Utilities Included" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {formUtilities.map((u) => (
                <button
                  key={u.name} type="button" onClick={() => toggleUtility(u.name)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                    u.included
                      ? "bg-green-50 ring-1 ring-green-200 hover:bg-green-100"
                      : "bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm font-medium text-slate-700">{u.name}</span>
                  <span className={`text-xs font-semibold ${u.included ? "text-green-600" : "text-slate-400"}`}>
                    {u.included ? "Included" : "Not included"}
                  </span>
                </button>
              ))}
            </div>

            {/* Occupants */}
            <SectionTitle title="Occupants" />
            <div className="mt-5 space-y-3">
              {formOccupants.map((o, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                    {o.name.split(" ").map((n) => n[0]).join("").toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <input type="text" value={o.name} placeholder="Full name"
                      onChange={(e) => updateOccupant(idx, "name", e.target.value)} className={inlineInput} />
                    <input type="text" value={o.role} placeholder="Role"
                      onChange={(e) => updateOccupant(idx, "role", e.target.value)} className={inlineInput} />
                  </div>
                  <button type="button" onClick={() => removeOccupant(idx)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 px-4 py-3">
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="flex-1 grid gap-3 sm:grid-cols-2">
                  <input type="text" value={newOccName} placeholder="Full name"
                    onChange={(e) => setNewOccName(e.target.value)} className={inlineInput} />
                  <input type="text" value={newOccRole} placeholder="Role (e.g. Co-Occupant)"
                    onChange={(e) => setNewOccRole(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOccupant(); } }}
                    className={inlineInput} />
                </div>
                <button type="button" onClick={addOccupant}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#1e1e2e] text-[#818cf8] transition hover:bg-[#252535] active:scale-95">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="mt-5 flex items-center gap-3">
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1e1e2e] px-6 py-2.5 text-sm font-semibold text-[#818cf8] transition hover:bg-[#252535] active:scale-95 disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId !== null ? "Save Changes" : "Create Lease"}
            </button>
            <button type="button" onClick={() => { resetForm(); setEditingId(null); setShowForm(false); }}
              className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Lease cards ─────────────────────────────────────────────────────── */}
      {leases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <FileText className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No leases yet</p>
          <p className="mt-1 text-xs text-slate-400">Click &ldquo;Add Lease&rdquo; to create your first lease agreement.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leases.map((l) => {
            const days = daysUntil(l.endDate);
            const expiringSoon = days >= 0 && days <= 60;
            const expired = days < 0;
            return (
              <div key={l.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <FileText className="h-5 w-5 text-[#5e6ad2]" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">{l.tenantName}</p>
                        {expiringSoon && !expired && (
                          <span className="rounded-full bg-[#2a1e00] px-2.5 py-0.5 text-xs font-semibold text-[#ff9f0a]">Expires in {days}d</span>
                        )}
                        {expired && (
                          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Expired</span>
                        )}
                        {!expiringSoon && !expired && (
                          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">{l.status}</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">{l.propertyName}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>{l.tenantEmail}</span>
                        {l.tenantPhone && <span>{l.tenantPhone}</span>}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span><span className="font-medium text-slate-700">Lease:</span> {fmt(l.startDate)} – {fmt(l.endDate)}</span>
                        <span><span className="font-medium text-slate-700">Rent:</span> ${l.rentAmount.toLocaleString()}/mo</span>
                        {l.depositAmount > 0 && <span><span className="font-medium text-slate-700">Deposit:</span> ${l.depositAmount.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
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
      )}

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
