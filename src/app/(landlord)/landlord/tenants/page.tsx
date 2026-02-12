import { UserPlus } from "lucide-react";
import { TopBar } from "@/components/landlord/topbar";
import { DataTable } from "@/components/landlord/data-table";
import { StatusBadge } from "@/components/landlord/status-badge";
import { mockTenants } from "@/lib/mock/landlord";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "propertyName", label: "Property" },
  { key: "unitNumber", label: "Unit" },
  { key: "leaseStart", label: "Lease Start" },
  { key: "leaseEnd", label: "Lease End" },
  { key: "monthlyRent", label: "Rent" },
  { key: "leaseStatus", label: "Status" },
];

export default function TenantsPage() {
  // TODO: Fetch from API instead of mock data
  const rows = mockTenants.map((t) => ({
    ...t,
    monthlyRent: `$${t.monthlyRent.toLocaleString()}`,
  }));

  return (
    <>
      <TopBar title="Tenants" />
      <main className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted">
            {mockTenants.length} tenants total
          </p>
          {/* TODO: Open invite/add-tenant modal */}
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark">
            <UserPlus className="h-4 w-4" />
            Add Tenant
          </button>
        </div>

        <DataTable
          columns={columns}
          data={rows}
          renderCell={(key, value, row) => {
            if (key === "leaseStatus") {
              return <StatusBadge status={value as string} variant="lease" />;
            }
            return String(value ?? "—");
          }}
        />
      </main>
    </>
  );
}
