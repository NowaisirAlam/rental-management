"use client";

import { useState } from "react";
import {
  CreditCard,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";

// ── Dummy data ─────────────────────────────────────────────────────────────────

const rentInfo = { amount: 1850, dueDate: "Feb 1, 2026", daysUntilDue: 3 };

const lateFee = { active: true, amount: 50, reason: "January payment was 2 days late." };

const paymentHistory = [
  { id: 1, date: "Jan 1, 2026",  method: "Bank Transfer", amount: 1850, status: "Paid"    },
  { id: 2, date: "Dec 1, 2025",  method: "eTransfer",     amount: 1850, status: "Paid"    },
  { id: 3, date: "Nov 1, 2025",  method: "eTransfer",     amount: 1850, status: "Paid"    },
  { id: 4, date: "Oct 3, 2025",  method: "Bank Transfer", amount: 1900, status: "Late"    },
  { id: 5, date: "Sep 1, 2025",  method: "eTransfer",     amount: 1850, status: "Paid"    },
];

const statusConfig: Record<string, string> = {
  "Paid":    "bg-green-100 text-green-700",
  "Late":    "bg-red-100   text-red-700",
  "Pending": "bg-amber-100 text-amber-700",
};

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
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Rent &amp; Payments</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your monthly rent and view payment history.</p>
      </div>

      {/* Late fee banner */}
      {lateFee.active && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Late Fee Applied — ${lateFee.amount}</p>
            <p className="mt-0.5 text-xs text-amber-700">{lateFee.reason}</p>
          </div>
        </div>
      )}

      {/* Pay Rent card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Amount Due</p>
            <p className="mt-2 text-4xl font-extrabold text-slate-900">${rentInfo.amount.toLocaleString()}</p>
            {lateFee.active && (
              <p className="mt-1 text-sm text-amber-600 font-medium">
                + ${lateFee.amount} late fee = ${(rentInfo.amount + lateFee.amount).toLocaleString()} total
              </p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                Due <span className="font-semibold text-slate-900">{rentInfo.dueDate}</span>
                <span className="ml-1.5 text-xs text-amber-600 font-semibold">({rentInfo.daysUntilDue} days)</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => showToast("Payment initiated. You will receive a confirmation email shortly.")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            <CreditCard className="h-4 w-4" /> Pay Now
          </button>
        </div>
      </div>

      {/* Payment history */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Payment History</h2>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Method</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paymentHistory.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{p.date}</td>
                <td className="px-6 py-4 text-slate-600">{p.method}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">${p.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusConfig[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => showToast(`Receipt for ${p.date} downloaded.`)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
