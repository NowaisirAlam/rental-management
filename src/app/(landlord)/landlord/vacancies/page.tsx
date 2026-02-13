import { DoorOpen } from "lucide-react";
import { TopBar } from "@/components/landlord/topbar";
import { mockVacantUnits } from "@/lib/mock/landlord";

export default function VacanciesPage() {
  return (
    <>
      <TopBar title="Vacancies" />
      <main className="p-6">
        <p className="mb-6 text-sm text-muted">
          <span className="font-semibold text-accent">
            {mockVacantUnits.length}
          </span>{" "}
          vacant units across your properties
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockVacantUnits.map((unit) => (
            <div
              key={unit.id}
              className="rounded-xl border border-border bg-white p-5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-accent">
                    {unit.propertyName}
                  </h3>
                  <p className="text-sm text-muted">Unit {unit.unitNumber}</p>
                </div>
                <DoorOpen className="h-5 w-5 text-muted" />
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted">Beds:</span>{" "}
                  <span className="font-medium text-accent">{unit.bedrooms}</span>
                </div>
                <div>
                  <span className="text-muted">Baths:</span>{" "}
                  <span className="font-medium text-accent">{unit.bathrooms}</span>
                </div>
                <div>
                  <span className="text-muted">Sqft:</span>{" "}
                  <span className="font-medium text-accent">
                    {unit.sqft ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-muted">Rent:</span>{" "}
                  <span className="font-medium text-accent">
                    ${unit.rentAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="mb-4 text-xs text-muted">{unit.propertyAddress}</p>

              {/* TODO: Integrate with listing/advertising service */}
              <button className="w-full rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary-light">
                Mark Available
              </button>
            </div>
          ))}
        </div>

        {mockVacantUnits.length === 0 && (
          <div className="rounded-xl border border-border bg-white p-12 text-center text-muted">
            No vacant units. All units are currently occupied.
          </div>
        )}
      </main>
    </>
  );
}
