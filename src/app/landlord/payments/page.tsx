"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type PaymentStatus = "PENDING" | "PAID" | "LATE";
type DisplayStatus = "Paid" | "Pending" | "Overdue";

type ApiPayment = {
  id: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  paidDate: string | null;
  createdAt: string;
  property: { name: string; tenants: { name: string; email: string }[] };
};

const statusConfig: Record<DisplayStatus, string> = {
  Paid:    "bg-[#0d2818] text-[#30d158]",
  Pending: "bg-[#2a1e00] text-[#ff9f0a]",
  Overdue: "bg-[#2a0d0d] text-[#ff453a]",
};

const selectClass = "appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-2 text-base text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export default function LandlordPayments() {
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterProperty, setFilterProperty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments");
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function markAsPaid(id: string) {
    setMarkingPaid(id);
    try {
      const res = await fetch(`/api/payments/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to mark payment as paid");
      await fetchPayments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update payment");
    } finally {
      setMarkingPaid(null);
    }
  }

  function mapStatus(status: PaymentStatus): DisplayStatus {
    if (status === "PAID") return "Paid";
    if (status === "PENDING") return "Pending";
    return "Overdue";
  }

  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function getMonthYear(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  const properties = ["All", ...Array.from(new Set(payments.map(p => p.property.name)))];
  const statuses = ["All", "Paid", "Pending", "Overdue"];
  const months = ["All", ...Array.from(new Set(payments.map(p => getMonthYear(p.dueDate))))];

  const filtered = payments.filter((p) => {
    if (filterProperty !== "All" && p.property.name !== filterProperty) return false;
    if (filterStatus !== "All" && mapStatus(p.status) !== filterStatus) return false;
    if (filterMonth !== "All" && getMonthYear(p.dueDate) !== filterMonth) return false;
    return true;
  });

  const total = filtered.reduce((s, p) => s + p.amount, 0);
  const paid = filtered.filter((p) => p.status === "PAID").length;
  const pending = filtered.filter((p) => p.status === "PENDING").length;
  const overdue = filtered.filter((p) => p.status === "LATE").length;

  if (loading) {
    return (
      <div className="px-8 pb-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="mt-1 text-sm text-slate-500">Track rent collection across all your properties.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-10 text-center text-slate-500">
          Loading payments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 pb-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="mt-1 text-sm text-slate-500">Track rent collection across all your properties.</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 shadow-sm p-10 text-center">
          <p className="text-red-600 font-semibold">Error: {error}</p>
          <button
            onClick={fetchPayments}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 pb-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
        <p className="mt-1 text-base text-slate-500">Track rent collection across all your properties.</p>
      </div>

      {/* Summary chips + Filters on same row */}
      <div className="mb-4 flex items-center gap-3">
        {/* Summary chips — left side */}
        {[
          { label: "Total",   val: `$${total.toLocaleString()}`, color: "bg-[#0d1829] text-[#5e6ad2]" },
          { label: "Paid",    val: String(paid),                  color: "bg-[#0d2818] text-[#30d158]" },
          { label: "Pending", val: String(pending),               color: "bg-[#2a1e00] text-[#ff9f0a]" },
          { label: "Overdue", val: String(overdue),               color: "bg-[#2a0d0d] text-[#ff453a]" },
        ].map((c) => (
          <div key={c.label} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${c.color}`}>
            {c.label}: {c.val}
          </div>
        ))}

        {/* Filters — right-aligned */}
        <div className="ml-auto flex items-center gap-2">
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
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Tenant", "Property", "Amount", "Due Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const displayStatus = mapStatus(row.status);
                const tenantName = row.property.tenants[0]?.name ?? "No tenant";
                const canMarkPaid = row.status === "PENDING" || row.status === "LATE";
                const isMarking = markingPaid === row.id;

                return (
                  <tr key={row.id} className={`border-b border-slate-100 transition hover:bg-slate-50 ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                    <td className="px-5 py-3.5 font-medium text-slate-900">{tenantName}</td>
                    <td className="px-5 py-3.5 text-slate-600">{row.property.name}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">${row.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-slate-500">{formatDate(row.dueDate)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${statusConfig[displayStatus]}`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {canMarkPaid && (
                        <button
                          onClick={() => markAsPaid(row.id)}
                          disabled={isMarking}
                          className="px-3 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isMarking ? "Marking..." : "Mark Paid"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-base text-slate-400">
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