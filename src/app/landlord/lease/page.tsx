"use client";

import { useState } from "react";
import { FileText, Download, CheckCircle2, X, Plus, Trash2, Pencil, ChevronDown } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Utility  = { name: string; included: boolean };
type Occupant = { id: number; name: string; role: string };

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultUtilities: Utility[] = [
  { name: "Heat",        included: true  },
  { name: "Water",       included: true  },
  { name: "Electricity", included: false },
  { name: "Internet",    included: false },
  { name: "Gas",         included: true  },
  { name: "Trash",       included: true  },
];

const defaultOccupants: Occupant[] = [
  { id: 1, name: "Sarah Johnson", role: "Primary Tenant" },
  { id: 2, name: "James Johnson", role: "Co-Occupant"    },
];

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputClass  = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const selectClass = "mt-1.5 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const labelClass  = "text-xs font-medium text-slate-400 uppercase tracking-wide";
const inlineInput = "w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <div className="flex-1 border-t border-slate-200" />
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
      <div className="flex-1 border-t border-slate-200" />
    </div>
  );
}

function EditField({
  label, value, onChange, type = "text", placeholder = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </div>
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-white shadow-xl">
      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition"><X className="h-4 w-4" /></button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandlordLeasePage() {

  // ── Lease Summary ────────────────────────────────────────────────────────
  const [tenantName,      setTenantName]      = useState("Sarah Johnson");
  const [landlordManager, setLandlordManager] = useState("Michael Chen — Chen Property Group");
  const [propertyAddress, setPropertyAddress] = useState("742 Maplewood Drive, Unit 4B");
  const [cityProvince,    setCityProvince]    = useState("Toronto, ON  M5V 2T6");
  const [leaseStatus,     setLeaseStatus]     = useState("Active");

  // ── Lease Duration ───────────────────────────────────────────────────────
  const [startDate,    setStartDate]    = useState("2024-09-01");
  const [endDate,      setEndDate]      = useState("2026-08-31");
  const [termLength,   setTermLength]   = useState("24 months");
  const [noticePeriod, setNoticePeriod] = useState("60 days");

  // ── Financials ───────────────────────────────────────────────────────────
  const [monthlyRent, setMonthlyRent] = useState("1850");
  const [deposit,     setDeposit]     = useState("1850");
  const [dueDay,      setDueDay]      = useState("1st");
  const [grace,       setGrace]       = useState("5 days");
  const [lateFee,     setLateFee]     = useState("$50");
  const [parking,     setParking]     = useState("$75 / month");
  const [petFee,      setPetFee]      = useState("None");

  // ── Lease Type ───────────────────────────────────────────────────────────
  const [agreementType, setAgreementType] = useState("Fixed-term");
  const [furnished,     setFurnished]     = useState("Unfurnished");

  // ── Utilities ────────────────────────────────────────────────────────────
  const [utilities, setUtilities] = useState<Utility[]>(defaultUtilities);

  // ── Occupants ────────────────────────────────────────────────────────────
  const [occupants,  setOccupants]  = useState<Occupant[]>(defaultOccupants);
  const [newOccName, setNewOccName] = useState("");
  const [newOccRole, setNewOccRole] = useState("");

  // ── Policies ─────────────────────────────────────────────────────────────
  const [smoking,    setSmoking]    = useState("Not permitted");
  const [noise,      setNoise]      = useState("Quiet hours 10 PM – 8 AM");
  const [subletting, setSubletting] = useState("Not permitted");
  const [guests,     setGuests]     = useState("Max 14 consecutive days");

  // ── UI ───────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const toggleUtility = (name: string) =>
    setUtilities((prev) => prev.map((u) => u.name === name ? { ...u, included: !u.included } : u));

  const updateOccupant = (id: number, field: "name" | "role", val: string) =>
    setOccupants((prev) => prev.map((o) => o.id === id ? { ...o, [field]: val } : o));

  const addOccupant = () => {
    if (!newOccName.trim()) return;
    setOccupants((prev) => [...prev, { id: Date.now(), name: newOccName.trim(), role: newOccRole.trim() || "Occupant" }]);
    setNewOccName(""); setNewOccRole("");
  };

  const removeOccupant = (id: number) => setOccupants((prev) => prev.filter((o) => o.id !== id));

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast("Lease details saved.");
  };

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">

      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Lease Details</h1>
        <p className="mt-1 text-sm text-slate-500">Edit and manage all lease agreement details.</p>
      </div>

      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
        <Pencil className="h-3 w-3" /> All fields are editable
      </div>

      <form onSubmit={handleSave}>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          {/* Lease Summary */}
          <SectionTitle title="Lease Summary" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <EditField label="Tenant Name"        value={tenantName}      onChange={setTenantName}      />
            <EditField label="Landlord / Manager" value={landlordManager} onChange={setLandlordManager} />
            <EditField label="Property Address"   value={propertyAddress} onChange={setPropertyAddress} />
            <EditField label="City / Province"    value={cityProvince}    onChange={setCityProvince}    />
            <SelectField
              label="Lease Status"
              value={leaseStatus}
              onChange={setLeaseStatus}
              options={["Active", "Pending", "Expired", "Terminated"]}
            />
          </div>

          {/* Lease Duration */}
          <SectionTitle title="Lease Duration" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <EditField label="Start Date"    value={startDate}    onChange={setStartDate}    type="date" />
            <EditField label="End Date"      value={endDate}      onChange={setEndDate}      type="date" />
            <EditField label="Term Length"   value={termLength}   onChange={setTermLength}   placeholder="e.g. 24 months" />
            <EditField label="Notice Period" value={noticePeriod} onChange={setNoticePeriod} placeholder="e.g. 60 days" />
          </div>

          {/* Financials */}
          <SectionTitle title="Financials" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className={labelClass}>Monthly Rent ($)</p>
              <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} min="0" placeholder="1850" className={inputClass} />
            </div>
            <div>
              <p className={labelClass}>Security Deposit ($)</p>
              <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} min="0" placeholder="1850" className={inputClass} />
            </div>
            <EditField label="Due Day"      value={dueDay}   onChange={setDueDay}   placeholder="e.g. 1st" />
            <EditField label="Grace Period" value={grace}    onChange={setGrace}    placeholder="e.g. 5 days" />
            <EditField label="Late Fee"     value={lateFee}  onChange={setLateFee}  placeholder="e.g. $50" />
            <EditField label="Parking"      value={parking}  onChange={setParking}  placeholder="e.g. $75 / month" />
            <EditField label="Pet Fee"      value={petFee}   onChange={setPetFee}   placeholder="e.g. None" />
          </div>

          {/* Lease Type */}
          <SectionTitle title="Lease Type" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Agreement Type"
              value={agreementType}
              onChange={setAgreementType}
              options={["Fixed-term", "Month-to-month", "Week-to-week", "Year-to-year"]}
            />
            <SelectField
              label="Furnished"
              value={furnished}
              onChange={setFurnished}
              options={["Furnished", "Unfurnished", "Semi-furnished"]}
            />
          </div>

          {/* Utilities Included */}
          <SectionTitle title="Utilities Included" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {utilities.map((u) => (
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

            {/* Existing occupant rows */}
            {occupants.map((o) => (
              <div key={o.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                  {o.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </div>
                <div className="flex-1 grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={o.name}
                    onChange={(e) => updateOccupant(o.id, "name", e.target.value)}
                    placeholder="Full name"
                    className={inlineInput}
                  />
                  <input
                    type="text"
                    value={o.role}
                    onChange={(e) => updateOccupant(o.id, "role", e.target.value)}
                    placeholder="Role"
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

            {/* Add new occupant row */}
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 px-4 py-3">
              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Plus className="h-4 w-4" />
              </div>
              <div className="flex-1 grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={newOccName}
                  onChange={(e) => setNewOccName(e.target.value)}
                  placeholder="Full name"
                  className={inlineInput}
                />
                <input
                  type="text"
                  value={newOccRole}
                  onChange={(e) => setNewOccRole(e.target.value)}
                  placeholder="Role (e.g. Co-Occupant)"
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

          {/* Policies */}
          <SectionTitle title="Policies" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <EditField label="Smoking"    value={smoking}    onChange={setSmoking}    placeholder="e.g. Not permitted" />
            <EditField label="Noise"      value={noise}      onChange={setNoise}      placeholder="e.g. Quiet hours 10 PM – 8 AM" />
            <EditField label="Subletting" value={subletting} onChange={setSubletting} placeholder="e.g. Not permitted" />
            <EditField label="Guests"     value={guests}     onChange={setGuests}     placeholder="e.g. Max 14 consecutive days" />
          </div>

          {/* Documents */}
          <SectionTitle title="Documents" />
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95">
              <FileText className="h-4 w-4" /> View Lease PDF
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95">
              <Download className="h-4 w-4" /> Download Lease PDF
            </button>
          </div>

        </div>

        {/* Save bar */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </form>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
