import Link from "next/link";
import {
  Building2,
  Users,
  DollarSign,
  Wrench,
  DoorOpen,
  ArrowRight,
} from "lucide-react";
import { TopBar } from "@/components/landlord/topbar";
import { StatsCard } from "@/components/landlord/stats-card";
import { mockDashboardStats, mockRecentActivity } from "@/lib/mock/landlord";

const activityDotColor: Record<string, string> = {
  payment: "bg-green-400",
  maintenance: "bg-amber-400",
  lease: "bg-red-400",
  property: "bg-blue-400",
};

export default function DashboardPage() {
  const s = mockDashboardStats;

  return (
    <>
      <TopBar title="Dashboard" />
      <main className="p-6">
        {/* Greeting */}
        <p className="mb-6 text-lg text-muted">
          {/* TODO: Use session user name */}
          Welcome back! Here&apos;s your property overview.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatsCard
            label="Total Properties"
            value={s.totalProperties}
            icon={<Building2 className="h-5 w-5" />}
          />
          <StatsCard
            label="Total Tenants"
            value={s.totalTenants}
            icon={<Users className="h-5 w-5" />}
          />
          <StatsCard
            label="Rent Collected"
            value={`$${s.rentCollected.toLocaleString()} / $${s.rentExpected.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
            trend={`${Math.round((s.rentCollected / s.rentExpected) * 100)}% collected`}
          />
          <StatsCard
            label="Open Maintenance"
            value={s.openMaintenance}
            icon={<Wrench className="h-5 w-5" />}
          />
          <StatsCard
            label="Vacant Units"
            value={s.vacantUnits}
            icon={<DoorOpen className="h-5 w-5" />}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-accent">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {mockRecentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${activityDotColor[item.type]}`}
                  />
                  <div>
                    <p className="text-sm text-accent">{item.text}</p>
                    <p className="text-xs text-muted">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-accent">
              Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                { label: "View Properties", href: "/landlord/properties" },
                { label: "Manage Tenants", href: "/landlord/tenants" },
                { label: "Rent Overview", href: "/landlord/rent" },
                { label: "Maintenance", href: "/landlord/maintenance" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-accent transition hover:bg-surface"
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4 text-muted" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
