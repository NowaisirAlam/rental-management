"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type PayStatus = "Paid" | "Pending" | "Overdue";

type Payment = {
  id: number;
  tenant: string;
  unit: string;
  property: string;
  amount: string;
  dueDate: string;
  status: PayStatus;
};

const ALL_PAYMENTS: Payment[] = [
  { id: 1,  tenant: "Marcus Reid",    unit: "Unit 2A", property: "Maplewood Residences", amount: "$1,800", dueDate: "Feb 1, 2026",  status: "Paid"    },
  { id: 2,  tenant: "Priya Sharma",   unit: "Unit 3C", property: "Maplewood Residences", amount: "$2,200", dueDate: "Feb 1, 2026",  status: "Paid"    },
  { id: 3,  tenant: "Tom Eriksson",   unit: "Unit 1B", property: "Oakview Apartments",   amount: "$1,400", dueDate: "Feb 1, 2026",  status: "Pending" },
  { id: 4,  tenant: "Lena Kowalski",  unit: "Unit 4D", property: "Oakview Apartments",   amount: "$1,400", dueDate: "Jan 1, 2026",  status: "Overdue" },
  { id: 5,  tenant: "Ahmed Siddiqui", unit: "Unit 5A", property: "Maplewood Residences", amount: "$1,600", dueDate: "Feb 1, 2026",  status: "Paid"    },
  { id: 6,  tenant: "Sofia Moretti",  unit: "Unit 6B", property: "Maplewood Residences", amount: "$1,750", dueDate: "Feb 1, 2026",  status: "Paid"    },
  { id: 7,  tenant: "Jake Park",      unit: "Unit 2C", property: "Oakview Apartments",   amount: "$1,300", dueDate: "Feb 1, 2026",  status: "Pending" },
  { id: 8,  tenant: "Nadia Khalil",   unit: "Unit 7A", property: "Maplewood Residences", amount: "$2,100", dueDate: "Jan 1, 2026",  status: "Overdue" },
];

const statusConfig: Record<PayStatus, string> = {
  Paid:    "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Overdue: "bg-red-100 text-red-700",
};

const selectClass = "appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-2 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export default function LandlordPayments() {
  const [filterProperty, setFilterProperty] = useState("All");
  const [filterStatus,   setFilterStatus]   = useState("All");
  const [filterMonth,    setFilterMonth]     = useState("All");

  const properties = ["All", "Maplewood Residences", "Oakview Apartments"];
  const statuses   = ["All", "Paid", "Pending", "Overdue"];
  const months     = ["All", "January 2026", "February 2026"];

  const filtered = ALL_PAYMENTS.filter((p) => {
    if (filterProperty !== "All" && p.property !== filterProperty) return false;
    if (filterStatus   !== "All" && p.status   !== filterStatus)   return false;
    return true;
  });

  const total   = filtered.reduce((s, p) => s + parseInt(p.amount.replace(/\D/g, "")), 0);
  const paid    = filtered.filter((p) => p.status === "Paid").length;
  const pending = filtered.filter((p) => p.status === "Pending").length;
  const overdue = filtered.filter((p) => p.status === "Overdue").length;

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        <p className="mt-1 text-sm text-slate-500">Track rent collection across all your properties.</p>
      </div>

      {/* Summary chips */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: "Total",   val: `$${total.toLocaleString()}`, color: "bg-blue-50  text-blue-700"  },
          { label: "Paid",    val: String(paid),                  color: "bg-green-50 text-green-700" },
          { label: "Pending", val: String(pending),               color: "bg-amber-50 text-amber-700" },
          { label: "Overdue", val: String(overdue),               color: "bg-red-50   text-red-700"   },
        ].map((c) => (
          <div key={c.label} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${c.color}`}>
            {c.label}: {c.val}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <select value={filterProperty} onChange={(e) => setFilterProperty(e.target.value)} className={selectClass}>
            {properties.map((p) => <option key={p}>{p}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClass}>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="relative">
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className={selectClass}>
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Tenant", "Unit", "Property", "Amount", "Due Date", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id} className={`border-b border-slate-100 transition hover:bg-slate-50 ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-5 py-3.5 font-medium text-slate-900">{row.tenant}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.unit}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.property}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{row.amount}</td>
                  <td className="px-5 py-3.5 text-slate-500">{row.dueDate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusConfig[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                    No payments match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
