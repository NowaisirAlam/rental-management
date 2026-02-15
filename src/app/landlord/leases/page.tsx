"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, FileText, X, CheckCircle2, ChevronDown,
  MoreVertical, Eye, Pencil, Trash2, AlertTriangle,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Utility  = { name: string; included: boolean };
type Occupant = { id: number; name: string; role: string };

type Lease = {
  id: number;
  // Summary
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  landlordManager: string;
  property: string;
  unit: string;
  cityProvince: string;
  leaseStatus: string;
  // Duration
  startDate: string;
  endDate: string;
  termLength: string;
  noticePeriod: string;
  // Financials
  rent: string;
  deposit: string;
  dueDay: string;
  grace: string;
  lateFee: string;
  parking: string;
  petFee: string;
  // Type
  agreementType: string;
  furnished: string;
  // Utilities & Occupants
  utilities: Utility[];
  occupants: Occupant[];
};

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_UTILITIES: Utility[] = [
  { name: "Heat",        included: false },
  { name: "Water",       included: false },
  { name: "Electricity", included: false },
  { name: "Internet",    included: false },
  { name: "Gas",         included: false },
  { name: "Trash",       included: false },
];

const initialLeases: Lease[] = [
  {
    id: 1,
    tenantName: "Marcus Reid", tenantEmail: "marcus@email.com", tenantPhone: "+1 416 555-0101",
    landlordManager: "Michael Chen — Chen Property Group",
    property: "Maplewood Residences", unit: "Unit 2A", cityProvince: "Toronto, ON  M5V 2T6",
    leaseStatus: "Active",
    startDate: "2024-09-01", endDate: "2026-08-31", termLength: "24 months", noticePeriod: "60 days",
    rent: "1800", deposit: "3600", dueDay: "1st", grace: "5 days", lateFee: "$50", parking: "$75 / month", petFee: "None",
    agreementType: "Fixed-term", furnished: "Unfurnished",
    utilities: [
      { name: "Heat", included: true }, { name: "Water", included: true },
      { name: "Electricity", included: false }, { name: "Internet", included: false },
      { name: "Gas", included: true }, { name: "Trash", included: true },
    ],
    occupants: [
      { id: 1, name: "Marcus Reid", role: "Primary Tenant" },
    ],
  },
  {
    id: 2,
    tenantName: "Priya Sharma", tenantEmail: "priya@email.com", tenantPhone: "+1 416 555-0202",
    landlordManager: "Michael Chen — Chen Property Group",
    property: "Maplewood Residences", unit: "Unit 3C", cityProvince: "Toronto, ON  M5V 2T6",
    leaseStatus: "Active",
    startDate: "2025-01-01", endDate: "2026-12-31", termLength: "24 months", noticePeriod: "60 days",
    rent: "2200", deposit: "4400", dueDay: "1st", grace: "5 days", lateFee: "$50", parking: "None", petFee: "None",
    agreementType: "Fixed-term", furnished: "Furnished",
    utilities: [
      { name: "Heat", included: true }, { name: "Water", included: true },
      { name: "Electricity", included: true }, { name: "Internet", included: false },
      { name: "Gas", included: true }, { name: "Trash", included: true },
    ],
    occupants: [
      { id: 1, name: "Priya Sharma", role: "Primary Tenant" },
      { id: 2, name: "Rohan Sharma", role: "Co-Occupant" },
    ],
  },
  {
    id: 3,
    tenantName: "Tom Eriksson", tenantEmail: "tom@email.com", tenantPhone: "+1 905 555-0303",
    landlordManager: "Michael Chen — Chen Property Group",
    property: "Oakview Apartments", unit: "Unit 1B", cityProvince: "Mississauga, ON  L5B 4T3",
    leaseStatus: "Active",
    startDate: "2024-06-01", endDate: "2026-05-31", termLength: "24 months", noticePeriod: "60 days",
    rent: "1400", deposit: "2800", dueDay: "1st", grace: "5 days", lateFee: "$50", parking: "$50 / month", petFee: "$30 / month",
    agreementType: "Fixed-term", furnished: "Unfurnished",
    utilities: [
      { name: "Heat", included: true }, { name: "Water", included: true },
      { name: "Electricity", included: false }, { name: "Internet", included: false },
      { name: "Gas", included: false }, { name: "Trash", included: true },
    ],
    occupants: [
      { id: 1, name: "Tom Eriksson", role: "Primary Tenant" },
    ],
  },
  {
    id: 4,
    tenantName: "Lena Kowalski", tenantEmail: "lena@email.com", tenantPhone: "+1 905 555-0404",
    landlordManager: "Michael Chen — Chen Property Group",
    property: "Oakview Apartments", unit: "Unit 4D", cityProvince: "Mississauga, ON  L5B 4T3",
    leaseStatus: "Expired",
    startDate: "2023-03-01", endDate: "2026-02-28", termLength: "36 months", noticePeriod: "60 days",
    rent: "1400", deposit: "2800", dueDay: "1st", grace: "5 days", lateFee: "$50", parking: "None", petFee: "None",
    agreementType: "Fixed-term", furnished: "Unfurnished",
    utilities: [
      { name: "Heat", included: true }, { name: "Water", included: true },
      { name: "Electricity", included: false }, { name: "Internet", included: false },
      { name: "Gas", included: false }, { name: "Trash", included: true },
    ],
    occupants: [
      { id: 1, name: "Lena Kowalski", role: "Primary Tenant" },
      { id: 2, name: "Pawel Kowalski", role: "Co-Occupant" },
    ],
  },
];

const PROPERTIES       = ["Maplewood Residences", "Oakview Apartments"];
const STATUS_OPTIONS   = ["Active", "Pending", "Expired", "Terminated"];
const AGREEMENT_TYPES  = ["Fixed-term", "Month-to-month", "Week-to-week", "Year-to-year"];
const FURNISHED_OPTIONS = ["Furnished", "Unfurnished", "Semi-furnished"];

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputClass  = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const selectClass = "mt-1.5 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const labelClass  = "block text-xs font-medium uppercase tracking-wide text-slate-400";
const inlineInput = "w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) : "—";

// ── Section title (same as tenant lease page) ─────────────────────────────────

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

// ── SelectField ───────────────────────────────────────────────────────────────

function SelectField({
  label, value, onChange, options, required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} required={required} className={selectClass}>
          {!options.includes(value) && <option value="" disabled>Select…</option>}
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </div>
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
          {row("Property",  `${lease.property} — ${lease.unit}`)}
          {row("Address",   lease.cityProvince)}
          {row("Status",    lease.leaseStatus)}
          {row("Tenant",    lease.tenantName)}
          {row("Email",     lease.tenantEmail)}
          {lease.tenantPhone && row("Phone", lease.tenantPhone)}
          {row("Lease",     `${fmt(lease.startDate)} – ${fmt(lease.endDate)}`)}
          {lease.termLength && row("Term", lease.termLength)}
          {row("Rent",      `$${Number(lease.rent).toLocaleString()} / month`)}
          {lease.deposit && row("Deposit", `$${Number(lease.deposit).toLocaleString()}`)}
          {lease.dueDay && row("Due Day", lease.dueDay)}
          {lease.lateFee && row("Late Fee", lease.lateFee)}
          {lease.parking && lease.parking !== "None" && row("Parking", lease.parking)}
          {row("Agreement", `${lease.agreementType} · ${lease.furnished}`)}
          {includedUtils.length > 0 && row("Utilities", includedUtils.join(", "))}
          {lease.occupants.length > 0 && row("Occupants",
            lease.occupants.map((o) => `${o.name} (${o.role})`).join(", ")
          )}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 flex-shrink-0">
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
  const [leases,        setLeases]        = useState<Lease[]>(initialLeases);
  const [showForm,      setShowForm]      = useState(false);
  const [editingId,     setEditingId]     = useState<number | null>(null);
  const [viewLease,     setViewLease]     = useState<Lease | null>(null);
  const [deleteTargetId,setDeleteTargetId]= useState<number | null>(null);
  const [toast,         setToast]         = useState<string | null>(null);

  // ── Form: Lease Summary ───────────────────────────────────────────────────
  const [tenantName,      setTenantName]      = useState("");
  const [tenantEmail,     setTenantEmail]     = useState("");
  const [tenantPhone,     setTenantPhone]     = useState("");
  const [landlordManager, setLandlordManager] = useState("");
  const [property,        setProperty]        = useState("");
  const [unit,            setUnit]            = useState("");
  const [cityProvince,    setCityProvince]    = useState("");
  const [leaseStatus,     setLeaseStatus]     = useState("Active");

  // ── Form: Lease Duration ─────────────────────────────────────────────────
  const [startDate,    setStartDate]    = useState("");
  const [endDate,      setEndDate]      = useState("");
  const [termLength,   setTermLength]   = useState("");
  const [noticePeriod, setNoticePeriod] = useState("60 days");

  // ── Form: Financials ─────────────────────────────────────────────────────
  const [rent,    setRent]    = useState("");
  const [deposit, setDeposit] = useState("");
  const [dueDay,  setDueDay]  = useState("1st");
  const [grace,   setGrace]   = useState("5 days");
  const [lateFee, setLateFee] = useState("$50");
  const [parking, setParking] = useState("None");
  const [petFee,  setPetFee]  = useState("None");

  // ── Form: Lease Type ─────────────────────────────────────────────────────
  const [agreementType, setAgreementType] = useState("Fixed-term");
  const [furnished,     setFurnished]     = useState("Unfurnished");

  // ── Form: Utilities & Occupants ──────────────────────────────────────────
  const [formUtilities, setFormUtilities] = useState<Utility[]>(DEFAULT_UTILITIES.map((u) => ({ ...u })));
  const [formOccupants, setFormOccupants] = useState<Occupant[]>([]);
  const [newOccName,    setNewOccName]    = useState("");
  const [newOccRole,    setNewOccRole]    = useState("");

  // ── Auto-calculate term length ────────────────────────────────────────────
  useEffect(() => {
    if (!startDate || !endDate) return;
    const s = new Date(startDate), e = new Date(endDate);
    const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    if (months > 0) setTermLength(`${months} month${months !== 1 ? "s" : ""}`);
  }, [startDate, endDate]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const resetForm = () => {
    setTenantName(""); setTenantEmail(""); setTenantPhone("");
    setLandlordManager(""); setProperty(""); setUnit(""); setCityProvince(""); setLeaseStatus("Active");
    setStartDate(""); setEndDate(""); setTermLength(""); setNoticePeriod("60 days");
    setRent(""); setDeposit(""); setDueDay("1st"); setGrace("5 days");
    setLateFee("$50"); setParking("None"); setPetFee("None");
    setAgreementType("Fixed-term"); setFurnished("Unfurnished");
    setFormUtilities(DEFAULT_UTILITIES.map((u) => ({ ...u })));
    setFormOccupants([]); setNewOccName(""); setNewOccRole("");
  };

  const openEditForm = (l: Lease) => {
    setEditingId(l.id);
    setTenantName(l.tenantName); setTenantEmail(l.tenantEmail); setTenantPhone(l.tenantPhone);
    setLandlordManager(l.landlordManager); setProperty(l.property); setUnit(l.unit);
    setCityProvince(l.cityProvince); setLeaseStatus(l.leaseStatus);
    setStartDate(l.startDate); setEndDate(l.endDate); setTermLength(l.termLength); setNoticePeriod(l.noticePeriod);
    setRent(l.rent); setDeposit(l.deposit); setDueDay(l.dueDay); setGrace(l.grace);
    setLateFee(l.lateFee); setParking(l.parking); setPetFee(l.petFee);
    setAgreementType(l.agreementType); setFurnished(l.furnished);
    setFormUtilities(l.utilities.map((u) => ({ ...u })));
    setFormOccupants(l.occupants.map((o) => ({ ...o })));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleUtility = (name: string) =>
    setFormUtilities((prev) => prev.map((u) => u.name === name ? { ...u, included: !u.included } : u));

  const updateOccupant = (id: number, field: "name" | "role", val: string) =>
    setFormOccupants((prev) => prev.map((o) => o.id === id ? { ...o, [field]: val } : o));

  const addOccupant = () => {
    if (!newOccName.trim()) return;
    setFormOccupants((prev) => [...prev, { id: Date.now(), name: newOccName.trim(), role: newOccRole.trim() || "Occupant" }]);
    setNewOccName(""); setNewOccRole("");
  };

  const removeOccupant = (id: number) =>
    setFormOccupants((prev) => prev.filter((o) => o.id !== id));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      tenantName, tenantEmail, tenantPhone, landlordManager,
      property, unit, cityProvince, leaseStatus,
      startDate, endDate, termLength, noticePeriod,
      rent, deposit, dueDay, grace, lateFee, parking, petFee,
      agreementType, furnished,
      utilities: formUtilities.map((u) => ({ ...u })),
      occupants: formOccupants.map((o) => ({ ...o })),
    };
    if (editingId !== null) {
      setLeases((prev) => prev.map((l) => l.id === editingId ? { ...l, ...data } : l));
      showToast("Lease updated.");
    } else {
      setLeases((prev) => [{ id: Date.now(), ...data }, ...prev]);
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

  // ── Render ────────────────────────────────────────────────────────────────

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

      {/* ── Create / Edit Form ──────────────────────────────────────────────── */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-slate-900">
                {editingId !== null ? "Edit Lease" : "New Lease"}
              </h2>
            </div>

            {/* Lease Summary */}
            <SectionTitle title="Lease Summary" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <EditField label="Tenant Name"        value={tenantName}      onChange={setTenantName}      required placeholder="e.g. Sarah Johnson" />
              <EditField label="Landlord / Manager" value={landlordManager} onChange={setLandlordManager} placeholder="e.g. Jane Smith — Smith Properties" />
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
              <EditField label="Unit"           value={unit}         onChange={setUnit}         required placeholder="e.g. Unit 2A" />
              <EditField label="City / Province" value={cityProvince} onChange={setCityProvince} placeholder="e.g. Toronto, ON  M5V 2T6" />
              <SelectField label="Lease Status" value={leaseStatus} onChange={setLeaseStatus} options={STATUS_OPTIONS} />
            </div>

            {/* Tenant Contact */}
            <SectionTitle title="Tenant Contact" />
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <EditField label="Email" value={tenantEmail} onChange={setTenantEmail} type="email" required placeholder="jane@email.com" />
              <EditField label="Phone" value={tenantPhone} onChange={setTenantPhone} type="tel"   placeholder="+1 416 555-0000" />
            </div>

            {/* Lease Duration */}
            <SectionTitle title="Lease Duration" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <EditField label="Start Date"    value={startDate}    onChange={setStartDate}    type="date" required />
              <EditField label="End Date"      value={endDate}      onChange={setEndDate}      type="date" required />
              <div>
                <label className={labelClass}>Term Length</label>
                <input
                  type="text" value={termLength}
                  onChange={(e) => setTermLength(e.target.value)}
                  placeholder="Auto-calculated"
                  className={`${inputClass} bg-slate-50 text-slate-500`}
                />
              </div>
              <EditField label="Notice Period" value={noticePeriod} onChange={setNoticePeriod} placeholder="e.g. 60 days" />
            </div>

            {/* Financials */}
            <SectionTitle title="Financials" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass}>Monthly Rent ($)</label>
                <input type="number" value={rent} onChange={(e) => setRent(e.target.value)} required min="0" placeholder="1800" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Security Deposit ($)</label>
                <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} min="0" placeholder="3600" className={inputClass} />
              </div>
              <EditField label="Due Day"      value={dueDay}   onChange={setDueDay}   placeholder="e.g. 1st" />
              <EditField label="Grace Period" value={grace}    onChange={setGrace}    placeholder="e.g. 5 days" />
              <EditField label="Late Fee"     value={lateFee}  onChange={setLateFee}  placeholder="e.g. $50" />
              <EditField label="Parking Fee"  value={parking}  onChange={setParking}  placeholder="e.g. $75 / month" />
              <EditField label="Pet Fee"      value={petFee}   onChange={setPetFee}   placeholder="e.g. None" />
            </div>

            {/* Lease Type */}
            <SectionTitle title="Lease Type" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <SelectField label="Agreement Type" value={agreementType} onChange={setAgreementType} options={AGREEMENT_TYPES} />
              <SelectField label="Furnished"      value={furnished}     onChange={setFurnished}     options={FURNISHED_OPTIONS} />
            </div>

            {/* Utilities Included */}
            <SectionTitle title="Utilities Included" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {formUtilities.map((u) => (
                <button
                  key={u.name}
                  type="button"
                  onClick={() => toggleUtility(u.name)}
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

              {formOccupants.map((o) => (
                <div key={o.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                    {o.name.split(" ").map((n) => n[0]).join("").toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <input
                      type="text" value={o.name} placeholder="Full name"
                      onChange={(e) => updateOccupant(o.id, "name", e.target.value)}
                      className={inlineInput}
                    />
                    <input
                      type="text" value={o.role} placeholder="Role"
                      onChange={(e) => updateOccupant(o.id, "role", e.target.value)}
                      className={inlineInput}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOccupant(o.id)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Add occupant */}
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 px-4 py-3">
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="flex-1 grid gap-3 sm:grid-cols-2">
                  <input
                    type="text" value={newOccName} placeholder="Full name"
                    onChange={(e) => setNewOccName(e.target.value)}
                    className={inlineInput}
                  />
                  <input
                    type="text" value={newOccRole} placeholder="Role (e.g. Co-Occupant)"
                    onChange={(e) => setNewOccRole(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOccupant(); } }}
                    className={inlineInput}
                  />
                </div>
                <button
                  type="button"
                  onClick={addOccupant}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Form actions */}
          <div className="mt-5 flex items-center gap-3">
            <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95">
              {editingId !== null ? "Save Changes" : "Create Lease"}
            </button>
            <button
              type="button"
              onClick={() => { resetForm(); setEditingId(null); setShowForm(false); }}
              className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Lease cards ─────────────────────────────────────────────────────── */}
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
                      {l.agreementType && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{l.agreementType}</span>
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
