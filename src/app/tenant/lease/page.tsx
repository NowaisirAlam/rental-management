import { Lock, Download, FileText } from "lucide-react";

// ── Dummy lease data ───────────────────────────────────────────────────────────

const lease = {
  tenant:       { name: "Sarah Johnson", email: "sarah.johnson@email.com", phone: "+1 (416) 555-0192" },
  landlord:     { name: "Michael Chen",  company: "Chen Property Group",    email: "mchen@chenproperties.ca" },
  property:     { address: "742 Maplewood Drive", unit: "Unit 4B", city: "Toronto", province: "ON", postal: "M5V 2T6" },
  lease:        { start: "Sep 1, 2024", end: "Aug 31, 2026", term: "24 months", notice: "60 days" },
  financial:    { monthlyRent: 1850, deposit: 1850, dueDay: "1st", grace: "5 days", lateFee: "$50", parking: "$75 / month", pet: "None" },
  type:         { kind: "Fixed-term", furnished: "Unfurnished" },
  utilities:    [
    { name: "Heat",        included: true  },
    { name: "Water",       included: true  },
    { name: "Electricity", included: false },
    { name: "Internet",    included: false },
    { name: "Gas",         included: true  },
    { name: "Trash",       included: true  },
  ],
  occupants: [
    { name: "Sarah Johnson", role: "Primary Tenant" },
    { name: "James Johnson", role: "Co-Occupant"    },
  ],
  policies:     { smoking: "Not permitted", noise: "Quiet hours 10 PM – 8 AM", subletting: "Not permitted", guests: "Max 14 consecutive days" },
};

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

export default function LeasePage() {
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
          <ReadField label="Tenant Name"        value={lease.tenant.name} />
          <ReadField label="Landlord / Manager" value={`${lease.landlord.name} — ${lease.landlord.company}`} />
          <ReadField label="Property Address"   value={`${lease.property.address}, ${lease.property.unit}`} />
          <ReadField label="City / Province"    value={`${lease.property.city}, ${lease.property.province}  ${lease.property.postal}`} />
          <ReadField label="Lease Status"       value="Active" />
        </div>

        {/* Lease duration */}
        <SectionTitle title="Lease Duration" />
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ReadField label="Start Date"     value={lease.lease.start} />
          <ReadField label="End Date"       value={lease.lease.end}   />
          <ReadField label="Term Length"    value={lease.lease.term}  />
          <ReadField label="Notice Period"  value={lease.lease.notice} />
        </div>

        {/* Financials */}
        <SectionTitle title="Financials" />
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ReadField label="Monthly Rent"    value={`$${lease.financial.monthlyRent.toLocaleString()}`} />
          <ReadField label="Security Deposit" value={`$${lease.financial.deposit.toLocaleString()}`} />
          <ReadField label="Due Day"          value={lease.financial.dueDay} />
          <ReadField label="Grace Period"     value={lease.financial.grace} />
          <ReadField label="Late Fee"         value={lease.financial.lateFee} />
          <ReadField label="Parking"          value={lease.financial.parking} />
          <ReadField label="Pet Fee"          value={lease.financial.pet} />
        </div>

        {/* Lease Type */}
        <SectionTitle title="Lease Type" />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <ReadField label="Agreement Type" value={lease.type.kind}      />
          <ReadField label="Furnished"      value={lease.type.furnished} />
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
        <SectionTitle title="Occupants" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {lease.occupants.map((o) => (
            <div key={o.name} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
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

        {/* Policies */}
        <SectionTitle title="Policies" />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <ReadField label="Smoking"    value={lease.policies.smoking}    />
          <ReadField label="Noise"      value={lease.policies.noise}      />
          <ReadField label="Subletting" value={lease.policies.subletting} />
          <ReadField label="Guests"     value={lease.policies.guests}     />
        </div>

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
