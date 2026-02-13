import { TopBar } from "@/components/landlord/topbar";
import { StatsCard } from "@/components/landlord/stats-card";
import { DataTable } from "@/components/landlord/data-table";
import { StatusBadge } from "@/components/landlord/status-badge";
import { DollarSign, CheckCircle2, AlertTriangle } from "lucide-react";
import { mockRentPayments } from "@/lib/mock/landlord";

const columns = [
  { key: "tenantName", label: "Tenant" },
  { key: "propertyName", label: "Property" },
  { key: "unitNumber", label: "Unit" },
  { key: "displayAmount", label: "Amount" },
  { key: "dueDate", label: "Due Date" },
  { key: "paidDate", label: "Paid Date" },
  { key: "status", label: "Status" },
];

export default function RentPage() {
  // TODO: Fetch from API instead of mock data
  const currentMonth = mockRentPayments.filter(
    (p) => p.periodLabel === "February 2026"
  );

  const totalDue = currentMonth.reduce((sum, p) => sum + p.amount, 0);
  const collected = currentMonth
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);
  const outstanding = totalDue - collected;

  const rows = mockRentPayments.map((p) => ({
    ...p,
    displayAmount: `$${p.amount.toLocaleString()}`,
    paidDate: p.paidDate ?? "—",
  }));

  return (
    <>
      <TopBar title="Rent" />
      <main className="p-6">
        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard
            label="Total Due (Feb)"
            value={`$${totalDue.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatsCard
            label="Collected"
            value={`$${collected.toLocaleString()}`}
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
          <StatsCard
            label="Outstanding"
            value={`$${outstanding.toLocaleString()}`}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        </div>

        {/* Payments table */}
        <DataTable
          columns={columns}
          data={rows}
          renderCell={(key, value) => {
            if (key === "status") {
              return <StatusBadge status={value as string} variant="payment" />;
            }
            return String(value ?? "—");
          }}
        />

        {/* TODO: Payment history section with date range filter */}
        <div className="mt-8 rounded-xl border border-border bg-white p-6">
          <h2 className="text-base font-semibold text-accent">
            Payment History
          </h2>
          <p className="mt-2 text-sm text-muted">
            Full payment history with filtering will be available when the
            database is connected.
          </p>
        </div>
      </main>
    </>
  );
}
