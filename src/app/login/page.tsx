"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSignIn = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError("");

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }

    const session = await getSession();
    if (session?.user?.role === "TENANT") {
      router.push("/tenant/dashboard");
    } else if (session?.user?.role === "LANDLORD") {
      router.push("/landlord/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Navbar />

      {/* ===== MAIN CONTENT ===== */}
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-14">
        <div className="mx-auto max-w-md">
          {/* Login Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Sign in to your PropManager account
              </p>
            </div>

            {/* Server error banner */}
            {serverError && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSignIn} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 transition duration-300 hover:text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-500 transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition duration-200 hover:text-slate-900"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 transition duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
                <label
                  htmlFor="remember"
                  className="ml-2.5 text-sm font-medium text-slate-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-blue-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md mt-6"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 border-t border-slate-300"></div>
              <span className="text-xs font-medium text-slate-500 uppercase">
                or
              </span>
              <div className="flex-1 border-t border-slate-300"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button className="w-full rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition duration-300 hover:bg-slate-50 active:scale-95 shadow-sm">
                Continue with Google
              </button>
              <button className="w-full rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition duration-300 hover:bg-slate-50 active:scale-95 shadow-sm">
                Continue with Facebook
              </button>
            </div>

            {/* Create Account Link */}
            <p className="mt-6 text-center text-sm text-slate-600">
              New to PropManager?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 transition duration-300 hover:text-blue-700 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
      {/* ===== END MAIN CONTENT ===== */}
    </>
  );
}
