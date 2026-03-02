"use client";

import { useState, useEffect } from "react";
import { Lock, Download, FileText, Loader2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ParsedUtility  = { name: string; included: boolean };
type ParsedOccupant = { name: string; role: string };

type Lease = {
  id: string;
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

const ALL_UTILITIES = ["Heat", "Water", "Electricity", "Internet", "Gas", "Trash"];

const fmt = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) : "—";

// ── Helpers ────────────────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <div className="flex-1 border-t border-slate-200" />
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
      <div className="flex-1 border-t border-slate-200" />
    </div>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <p className="text-sm font-medium text-slate-800">{value}</p>
        <Lock className="h-3 w-3 text-slate-300 flex-shrink-0" />
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function TenantLeasePage() {
  const [lease,   setLease]   = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/leases");
        if (!res.ok) throw new Error("Failed to load lease");
        const data = await res.json() as Record<string, unknown>[];
        if (data.length === 0) { setLease(null); return; }

        const raw = data[0];
        const includedNames: string[] = (() => {
          try { return JSON.parse(raw.utilities as string) as string[]; } catch { return []; }
        })();
        const rawOccupants: ParsedOccupant[] = (() => {
          try { return JSON.parse(raw.occupants as string) as ParsedOccupant[]; } catch { return []; }
        })();
        const property = raw.property as { name: string; address: string };

        setLease({
          id: raw.id as string,
          propertyName: property?.name ?? "",
          propertyAddress: property?.address ?? "",
          startDate: (raw.startDate as string).slice(0, 10),
          endDate: (raw.endDate as string).slice(0, 10),
          rentAmount: raw.rentAmount as number,
          depositAmount: raw.depositAmount as number,
          status: raw.status as string,
          utilities: ALL_UTILITIES.map((name) => ({ name, included: includedNames.includes(name) })),
          occupants: rawOccupants,
        });
      } catch {
        setError("Could not load your lease. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
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

  if (!lease) {
    return (
      <div className="px-8 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900">Lease Info</h1>
        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <FileText className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No lease on file</p>
          <p className="mt-1 text-xs text-slate-400">Contact your landlord to set up your lease agreement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">

      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Lease Info</h1>
        <p className="mt-1 text-sm text-slate-500">Read-only view of your lease agreement details.</p>
      </div>

      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
        <Lock className="h-3 w-3" /> All fields are read-only
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        {/* Lease summary */}
        <SectionTitle title="Lease Summary" />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <ReadField label="Property"      value={lease.propertyName} />
          <ReadField label="Address"       value={lease.propertyAddress} />
          <ReadField label="Lease Status"  value={lease.status} />
        </div>

        {/* Lease duration */}
        <SectionTitle title="Lease Duration" />
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ReadField label="Start Date" value={fmt(lease.startDate)} />
          <ReadField label="End Date"   value={fmt(lease.endDate)} />
        </div>

        {/* Financials */}
        <SectionTitle title="Financials" />
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ReadField label="Monthly Rent"     value={`$${lease.rentAmount.toLocaleString()}`} />
          {lease.depositAmount > 0 && (
            <ReadField label="Security Deposit" value={`$${lease.depositAmount.toLocaleString()}`} />
          )}
        </div>

        {/* Utilities */}
        <SectionTitle title="Utilities Included" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lease.utilities.map((u) => (
            <div key={u.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm font-medium text-slate-700">{u.name}</span>
              <span className={`text-xs font-semibold ${u.included ? "text-green-600" : "text-slate-400"}`}>
                {u.included ? "Included" : "Not included"}
              </span>
            </div>
          ))}
        </div>

        {/* Occupants */}
        {lease.occupants.length > 0 && (
          <>
            <SectionTitle title="Occupants" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {lease.occupants.map((o, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                    {o.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{o.name}</p>
                    <p className="text-xs text-slate-500">{o.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Documents */}
        <SectionTitle title="Documents" />
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95">
            <FileText className="h-4 w-4" /> View Lease PDF
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95">
            <Download className="h-4 w-4" /> Download Lease PDF
          </button>
        </div>

      </div>
    </div>
  );
}
