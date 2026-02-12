import { Plus } from "lucide-react";
import { TopBar } from "@/components/landlord/topbar";
import { DataTable } from "@/components/landlord/data-table";
import { mockProperties } from "@/lib/mock/landlord";

const columns = [
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { key: "location", label: "City / State" },
  { key: "type", label: "Type" },
  { key: "totalUnits", label: "Units" },
  { key: "occupancy", label: "Occupancy" },
];

export default function PropertiesPage() {
  // TODO: Fetch from API instead of mock data
  const rows = mockProperties.map((p) => {
    const occupied = p.units.filter((u) => u.isOccupied).length;
    return {
      id: p.id,
      name: p.name,
      address: p.address,
      location: `${p.city}, ${p.state}`,
      type: p.type.charAt(0) + p.type.slice(1).toLowerCase(),
      totalUnits: p.units.length,
      occupancy: `${occupied} / ${p.units.length} occupied`,
    };
  });

  return (
    <>
      <TopBar title="Properties" />
      <main className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted">
            {mockProperties.length} properties total
          </p>
          {/* TODO: Open add-property modal or route */}
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark">
            <Plus className="h-4 w-4" />
            Add Property
          </button>
        </div>

        <DataTable columns={columns} data={rows} />
      </main>
    </>
  );
}
