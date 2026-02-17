"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Loader2,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Payment = any;

const statusConfig: Record<string, string> = {
  "Paid":    "bg-green-100 text-green-700",
  "Pending": "bg-amber-100 text-amber-700",
  "Overdue": "bg-red-100   text-red-700",
};

function displayStatus(p: Payment): string {
  if (p.status === "PAID") return "Paid";
  const due = new Date(p.dueDate);
  if (due.getTime() < Date.now()) return "Overdue";
  return "Pending";
}

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

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/payments")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load payments");
        return res.json();
      })
      .then(setPayments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500">Loading payments...</span>
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

  // Find the current pending payment (most recent by dueDate)
  const currentDue = payments.find((p: Payment) => p.status === "PENDING");
  const isOverdue = currentDue && new Date(currentDue.dueDate).getTime() < Date.now();

  // Past payments (everything except the current pending one)
  const pastPayments = payments.filter((p: Payment) => p !== currentDue);

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Rent &amp; Payments</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your monthly rent and view payment history.</p>
      </div>

      {/* Overdue banner */}
      {isOverdue && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Payment Overdue</p>
            <p className="mt-0.5 text-xs text-amber-700">
              Your payment of ${currentDue.amount.toLocaleString()} was due {new Date(currentDue.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.
            </p>
          </div>
        </div>
      )}

      {/* Pay Rent card */}
      {currentDue && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Amount Due</p>
              <p className="mt-2 text-4xl font-extrabold text-slate-900">${currentDue.amount.toLocaleString()}</p>
              <div className="mt-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Due <span className="font-semibold text-slate-900">
                    {new Date(currentDue.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </span>
              </div>
            </div>

            <button
              onClick={() => showToast("Payment initiated. You will receive a confirmation shortly.")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              <CreditCard className="h-4 w-4" /> Pay Now
            </button>
          </div>
        </div>
      )}

      {!currentDue && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6 text-center">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">All caught up!</p>
          <p className="text-xs text-slate-500">No pending payments.</p>
        </div>
      )}

      {/* Payment history */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Payment History</h2>
        </div>

        {pastPayments.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No payment history yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Due Date</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Property</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pastPayments.map((p: Payment) => {
                const status = displayStatus(p);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {new Date(p.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.property?.name ?? "—"}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">${p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusConfig[status] ?? "bg-slate-100 text-slate-600"}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}