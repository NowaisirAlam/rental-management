"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Building2 } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <nav className="border-b border-slate-200 bg-white w-full">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LEFT: Logo */}
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-2.5 rounded-lg transition duration-300 hover:scale-105 hover:opacity-90 active:scale-95"
            aria-label="PropManager - Go to home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-md transition-all group-hover:shadow-lg flex-shrink-0">
              <Building2 className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 whitespace-nowrap">
              PropManager
            </span>
          </button>

          {/* CENTER: Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#features" className="text-sm font-medium text-slate-600 transition duration-300 hover:text-slate-900">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 transition duration-300 hover:text-slate-900">
              How It Works
            </Link>
            <Link href="/#for-you" className="text-sm font-medium text-slate-600 transition duration-300 hover:text-slate-900">
              For You
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-slate-600 transition duration-300 hover:text-slate-900">
              Pricing
            </Link>
          </div>

          {/* RIGHT: Auth Buttons */}
          <div className="flex items-center gap-3">
            {isLoginPage ? (
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow-md"
              >
                ← Back to Home
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="text-sm font-medium text-slate-700 transition duration-300 hover:text-slate-900 px-3 py-2"
                >
                  Log in
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow-md"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
