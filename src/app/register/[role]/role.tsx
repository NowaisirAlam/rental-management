"use client";

import { useRouter } from "next/navigation";

export default function LoginRolePage() {
  const router = useRouter();

  const goBack = () => {
    // Go back if possible, otherwise go home
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-3xl">

        {/* 🔙 BACK ARROW — ADDED HERE */}
        <button
          onClick={goBack}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
        >
          <span className="text-xl">←</span>
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* LOGIN CARD */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="text-sm font-semibold text-blue-600">LOGIN</div>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Choose your account type
          </h1>

          <p className="mt-2 text-slate-600">
            Continue as a tenant or landlord to access the right login options.
          </p>

          {/* ROLE CARDS */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">

            {/* Tenant */}
            <button
              onClick={() => router.push("/login/tenant")}
              className="text-left rounded-xl border border-blue-300 bg-blue-50 p-6 hover:shadow transition"
            >
              <div className="text-lg font-bold text-slate-900">
                I am a Tenant
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Pay rent, submit maintenance requests, and track lease updates.
              </p>
              <div className="mt-4 text-blue-600 font-semibold">
                Continue →
              </div>
            </button>

            {/* Landlord */}
            <button
              onClick={() => router.push("/login/landlord")}
              className="text-left rounded-xl border border-slate-200 bg-white p-6 hover:shadow transition"
            >
              <div className="text-lg font-bold text-slate-900">
                I am a Landlord
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Manage properties, tenants, rent collection, and workflows.
              </p>
              <div className="mt-4 text-blue-600 font-semibold">
                Continue →
              </div>
            </button>

          </div>

          {/* SIGNUP LINK */}
          <p className="mt-6 text-sm text-slate-600">
            New to PropManager?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Create an account
            </span>
          </p>

        </div>
      </div>
    </main>
  );
}
