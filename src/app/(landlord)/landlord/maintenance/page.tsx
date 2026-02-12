import { TopBar } from "@/components/landlord/topbar";
import { DataTable } from "@/components/landlord/data-table";
import { StatusBadge } from "@/components/landlord/status-badge";
import { mockMaintenanceRequests } from "@/lib/mock/landlord";

const columns = [
  { key: "title", label: "Issue" },
  { key: "propertyName", label: "Property" },
  { key: "unitNumber", label: "Unit" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "createdBy", label: "Submitted By" },
  { key: "createdAt", label: "Date" },
  { key: "actions", label: "", className: "text-right" },
];

export default function MaintenancePage() {
  // TODO: Fetch from API instead of mock data
  const open = mockMaintenanceRequests.filter((r) => r.status === "OPEN").length;
  const inProgress = mockMaintenanceRequests.filter((r) => r.status === "IN_PROGRESS").length;
  const resolved = mockMaintenanceRequests.filter((r) => r.status === "RESOLVED" || r.status === "CLOSED").length;

  const rows = mockMaintenanceRequests.map((r) => ({
    ...r,
    actions: "update",
  }));

  return (
    <>
      <TopBar title="Maintenance" />
      <main className="p-6">
        {/* Summary */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="rounded-lg border border-border bg-white px-4 py-2 text-sm">
            <span className="font-semibold text-blue-600">{open}</span>{" "}
            <span className="text-muted">Open</span>
          </div>
          <div className="rounded-lg border border-border bg-white px-4 py-2 text-sm">
            <span className="font-semibold text-yellow-600">{inProgress}</span>{" "}
            <span className="text-muted">In Progress</span>
          </div>
          <div className="rounded-lg border border-border bg-white px-4 py-2 text-sm">
            <span className="font-semibold text-green-600">{resolved}</span>{" "}
            <span className="text-muted">Resolved</span>
          </div>
        </div>

        {/* Requests table */}
        <DataTable
          columns={columns}
          data={rows}
          renderCell={(key, value, row) => {
            if (key === "priority") {
              return <StatusBadge status={value as string} variant="priority" />;
            }
            if (key === "status") {
              return <StatusBadge status={value as string} variant="ticket" />;
            }
            if (key === "actions") {
              return (
                // TODO: Open status-update modal
                <button className="text-xs font-medium text-primary hover:text-primary-dark">
                  Update Status
                </button>
              );
            }
            return String(value ?? "—");
          }}
        />
      </main>
    </>
  );
}
