import {
  Building2,
  Bell,
  Wrench,
  DollarSign,
  Shield,
  Users,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Clock,
  ChevronRight,
} from "lucide-react";
import DevPreviewButton from "@/components/DevPreviewButton";
import LandlordPreviewButton from "@/components/LandlordPreviewButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-accent">
      {/* ── Navbar ─────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">
              PropManager
            </span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            <a href="#features" className="transition hover:text-accent">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-accent">
              How It Works
            </a>
            <a href="#roles" className="transition hover:text-accent">
              For You
            </a>
            <a href="#pricing" className="transition hover:text-accent">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden text-sm font-medium text-muted transition hover:text-accent sm:block"
            >
              Log in
            </a>
            <a
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Get Started
            </a>
            <DevPreviewButton />
            <LandlordPreviewButton />
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-light via-white to-white" />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-4 py-1.5 text-sm font-medium text-primary">
              <Clock className="h-4 w-4" />
              Save 10+ hours per week on property management
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl md:leading-tight">
              Property management
              <br />
              <span className="text-primary">without the headaches</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Automate rent reminders, manage maintenance tickets, and keep
              landlords and tenants in sync — all from one simple dashboard.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register"
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark"
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-semibold text-accent transition hover:bg-surface"
              >
                See Features
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-xl border border-border bg-surface p-2 shadow-2xl shadow-black/5">
              <div className="rounded-lg border border-border bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-muted">
                    PropManager Dashboard
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <StatPreview
                    label="Properties"
                    value="12"
                    color="bg-blue-50 text-blue-600"
                  />
                  <StatPreview
                    label="Tenants"
                    value="48"
                    color="bg-green-50 text-green-600"
                  />
                  <StatPreview
                    label="Open Tickets"
                    value="5"
                    color="bg-amber-50 text-amber-600"
                  />
                  <StatPreview
                    label="Rent Collected"
                    value="94%"
                    color="bg-purple-50 text-purple-600"
                  />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="col-span-2 rounded-lg border border-border p-4">
                    <div className="mb-3 text-sm font-semibold">
                      Recent Activity
                    </div>
                    <div className="space-y-3">
                      <ActivityRow
                        text="Jane Doe paid rent for Unit 101"
                        time="2 hours ago"
                        dot="bg-green-400"
                      />
                      <ActivityRow
                        text="New ticket: Leaking faucet — Unit 204"
                        time="5 hours ago"
                        dot="bg-amber-400"
                      />
                      <ActivityRow
                        text="Lease expiring soon — Unit 305"
                        time="1 day ago"
                        dot="bg-red-400"
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="mb-3 text-sm font-semibold">
                      Quick Actions
                    </div>
                    <div className="space-y-2">
                      <MockButton text="Add Property" />
                      <MockButton text="New Tenant" />
                      <MockButton text="View Tickets" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────── */}
      <section id="features" className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to manage properties
            </h2>
            <p className="mt-4 text-lg text-muted">
              From rent collection to maintenance — one platform handles it all.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<DollarSign className="h-6 w-6" />}
              title="Rent Tracking"
              description="Track payments for every unit. Automatic reminders before due dates and late fee calculations after grace periods."
            />
            <FeatureCard
              icon={<Wrench className="h-6 w-6" />}
              title="Maintenance Tickets"
              description="Tenants submit requests, you track them from open to resolved. Comments, priorities, and status updates built in."
            />
            <FeatureCard
              icon={<Bell className="h-6 w-6" />}
              title="Smart Notifications"
              description="Automatic alerts for rent due dates, ticket updates, and lease expirations. Never miss a deadline again."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Tenant Management"
              description="Full tenant directory with contact info, lease details, and payment history. Assign tenants to units in seconds."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Dashboard & Reports"
              description="Real-time occupancy rates, revenue tracking, and overdue payments. Export data to CSV anytime."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Role-Based Access"
              description="Managers see everything. Landlords see their properties. Tenants see their unit. Everyone gets exactly what they need."
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────── */}
      <section id="how-it-works" className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-lg text-muted">
              No complicated setup. No training required.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <Step
              number="1"
              title="Add Your Properties"
              description="Enter your properties and units. Set rent amounts, lease terms, and assign tenants."
            />
            <Step
              number="2"
              title="Invite Your Team"
              description="Landlords and tenants create accounts. Each person sees only what's relevant to them."
            />
            <Step
              number="3"
              title="Let It Run"
              description="Rent reminders go out automatically. Tenants submit tickets. You track everything from one dashboard."
            />
          </div>
        </div>
      </section>

      {/* ── Roles Section ──────────────────────────── */}
      <section id="roles" className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Built for everyone in the building
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <RoleCard
              icon={<Shield className="h-8 w-8 text-primary" />}
              role="Property Managers"
              items={[
                "Full oversight of all properties",
                "User management & activity logs",
                "CSV exports & reporting",
                "Moderate tickets & approve actions",
              ]}
            />
            <RoleCard
              icon={<Building2 className="h-8 w-8 text-primary" />}
              role="Landlords"
              items={[
                "Manage your own properties & units",
                "Track rent payments per tenant",
                "Handle maintenance requests",
                "Create & manage leases",
              ]}
            />
            <RoleCard
              icon={<Users className="h-8 w-8 text-primary" />}
              role="Tenants"
              items={[
                "View your unit & lease details",
                "Submit maintenance tickets",
                "See rent due dates & history",
                "Get notified on updates",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Pricing (Simple) ──────────────────────── */}
      <section id="pricing" className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Free to start. Free to stay.
            </h2>
            <p className="mt-4 text-lg text-muted">
              PropManager is an open-source demo project. Use it, fork it, make
              it yours.
            </p>
            <div className="mt-10 rounded-2xl border border-border bg-white p-8 text-left shadow-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-muted">/ forever</span>
              </div>
              <p className="mt-2 text-sm text-muted">
                Everything included. No credit card needed.
              </p>
              <ul className="mt-6 space-y-3">
                <PricingItem text="Unlimited properties & units" />
                <PricingItem text="Rent tracking & reminders" />
                <PricingItem text="Maintenance ticket system" />
                <PricingItem text="Role-based dashboards" />
                <PricingItem text="Activity logs & CSV export" />
                <PricingItem text="Auto late fee calculation" />
              </ul>
              <a
                href="/register"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-base font-semibold text-white transition hover:bg-primary-dark"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack Badge ─────────────────────── */}
      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="mb-4 text-sm font-medium text-muted">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <TechBadge name="Next.js" />
            <TechBadge name="TypeScript" />
            <TechBadge name="Prisma" />
            <TechBadge name="PostgreSQL" />
            <TechBadge name="Tailwind CSS" />
            <TechBadge name="NextAuth" />
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted md:flex-row">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-accent">PropManager</span>
          </div>
          <p>
            A portfolio project by{" "}
            <span className="font-medium text-accent">Your Name</span>. Built
            with Next.js + Prisma.
          </p>
          <div className="flex gap-6">
            <a href="#features" className="transition hover:text-accent">
              Features
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-accent"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────── */

function StatPreview({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={`rounded-lg p-4 ${color}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs font-medium opacity-70">{label}</div>
    </div>
  );
}

function ActivityRow({
  text,
  time,
  dot,
}: {
  text: string;
  time: string;
  dot: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <div>
        <div className="text-sm">{text}</div>
        <div className="text-xs text-muted">{time}</div>
      </div>
    </div>
  );
}

function MockButton({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-center text-xs font-medium text-muted">
      {text}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-border bg-white p-6 transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
        {number}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}

function RoleCard({
  icon,
  role,
  items,
}: {
  icon: React.ReactNode;
  role: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold">{role}</h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
      {text}
    </li>
  );
}

function TechBadge({ name }: { name: string }) {
  return (
    <span className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-muted">
      {name}
    </span>
  );
}
