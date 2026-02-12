"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-14">

        <div className="w-full max-w-4xl">

          {/* REGISTER CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">

            {/* Header */}
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                GET STARTED
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Create your account
              </h1>
              <p className="mt-4 text-base text-slate-600">
                Pick the role that matches how you use PropManager.
              </p>
            </div>

            {/* ROLE SELECTION CARDS */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">

              {/* Tenant Card */}
              <button
                onClick={() => router.push("/register/tenant")}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md text-left"
              >
                {/* Icon */}
                <UserRound className="h-8 w-8 text-blue-600" />

                {/* Title */}
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  Register as Tenant
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Create your tenant profile to pay rent and submit maintenance requests.
                </p>

                {/* Continue Link */}
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition duration-300 group-hover:gap-2">
                  Continue
                  <span className="text-lg">→</span>
                </span>
              </button>

              {/* Landlord Card */}
              <button
                onClick={() => router.push("/register/landlord")}
                className="group rounded-xl border border-slate-200 bg-white p-6 transition duration-300 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md text-left"
              >
                {/* Icon */}
                <Building2 className="h-8 w-8 text-blue-600" />

                {/* Title */}
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  Register as Landlord
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Create your landlord profile to manage properties and tenants.
                </p>

                {/* Continue Link */}
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition duration-300 group-hover:gap-2">
                  Continue
                  <span className="text-lg">→</span>
                </span>
              </button>

            </div>

            {/* Login Link */}
            <p className="mt-8 text-center text-sm text-slate-600">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 transition duration-300 hover:text-blue-700 hover:underline"
              >
                Log in
              </Link>
            </p>

          </div>
        </div>
      </main>
    </>
  );
}
