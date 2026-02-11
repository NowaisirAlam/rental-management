import Link from "next/link";
import { ArrowRight, Building2, UserRound } from "lucide-react";

const roles = [
  {
    key: "tenant",
    title: "Register as Tenant",
    description:
      "Create your tenant profile to pay rent and submit maintenance requests.",
    icon: UserRound,
  },
  {
    key: "landlord",
    title: "Register as Landlord",
    description:
      "Create your landlord profile to manage properties and tenants.",
    icon: Building2,
  },
] as const;

export default function RegisterRolePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-light to-white px-6 py-14">
      <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-8 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Get Started
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-accent md:text-4xl">
          Create your account
        </h1>
        <p className="mt-4 text-base text-muted">
          Pick the role that matches how you use PropManager.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.key}
                href={`/register/${role.key}`}
                className="group rounded-xl border border-border bg-surface p-5 transition hover:border-primary/40 hover:bg-white hover:shadow-md"
              >
                <Icon className="h-7 w-7 text-primary" />
                <h2 className="mt-4 text-lg font-semibold text-accent">
                  {role.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {role.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Continue
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-muted">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}