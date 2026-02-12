"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";

// ── Types ──────────────────────────────────────────────────────────────────────

type FormFields = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  unitNumber: string;
  agreeToTerms: boolean;
};

// ── Validation ─────────────────────────────────────────────────────────────────

function validate(fields: FormFields): Record<string, string> {
  const errs: Record<string, string> = {};

  if (!fields.fullName.trim()) errs.fullName = "Full name is required.";

  if (!fields.email.trim()) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errs.email = "Enter a valid email address.";
  }

  if (!fields.phone.trim()) {
    errs.phone = "Phone number is required.";
  } else if (!/^\+?[\d\s\-()\u00A0]{7,}$/.test(fields.phone)) {
    errs.phone = "Enter a valid phone number.";
  }

  if (!fields.password) {
    errs.password = "Password is required.";
  } else if (fields.password.length < 8) {
    errs.password = "Password must be at least 8 characters.";
  }

  if (!fields.confirmPassword) {
    errs.confirmPassword = "Please confirm your password.";
  } else if (fields.confirmPassword !== fields.password) {
    errs.confirmPassword = "Passwords do not match.";
  }

  if (!fields.unitNumber.trim()) errs.unitNumber = "Apartment/Unit number is required.";

  if (!fields.agreeToTerms) errs.agreeToTerms = "You must agree to the Terms & Privacy Policy.";

  return errs;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function TenantRegisterPage() {
  // Field values
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [propertyCode, setPropertyCode] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper: current field values for validate()
  const currentFields = (): FormFields => ({
    fullName, email, phone, password, confirmPassword, unitNumber, agreeToTerms,
  });

  // Show error only when field has been touched or form was submitted
  const showError = (field: string) =>
    (touched[field] || submitted) ? errors[field] : undefined;

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(currentFields()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(currentFields());
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    // TODO: wire up your backend / API call here
    setTimeout(() => setIsLoading(false), 1500);
  };

  // Shared Tailwind helpers
  const inputBase =
    "mt-2 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition duration-200 focus:outline-none focus:ring-2";
  const inputDefault = "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20";
  const inputError = "border-red-400 focus:border-red-500 focus:ring-red-500/20";

  const inputClass = (field: string) =>
    `${inputBase} ${showError(field) ? inputError : inputDefault}`;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-14">
        <div className="mx-auto max-w-2xl">

          {/* Back link */}
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition duration-200 hover:text-slate-800"
          >
            <span>←</span> Back to role selection
          </Link>

          {/* Card */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">

            {/* Header */}
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Tenant Registration
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Create your tenant account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Fill in your details below to get started with PropManager.
            </p>

            <form onSubmit={handleSubmit} noValidate>

              {/* ── Section A: Account Credentials ───────────────────────── */}
              <SectionDivider label="Account Credentials" />

              <div className="mt-5 space-y-5">

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="Jane Smith"
                    className={inputClass("fullName")}
                  />
                  {showError("fullName") && (
                    <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    className={inputClass("email")}
                  />
                  {showError("email") && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+1 (555) 000-0000"
                    className={inputClass("phone")}
                  />
                  {showError("phone") && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="Min. 8 characters"
                      className={`${inputClass("password")} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition duration-200 hover:text-slate-800"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {showError("password") && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Re-enter your password"
                      className={`${inputClass("confirmPassword")} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition duration-200 hover:text-slate-800"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {showError("confirmPassword") && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

              </div>

              {/* ── Section B: Lease Details ──────────────────────────────── */}
              <SectionDivider label="Lease Details" />

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                {/* Unit Number */}
                <div>
                  <label htmlFor="unitNumber" className="block text-sm font-medium text-slate-700">
                    Apartment / Unit Number
                  </label>
                  <input
                    id="unitNumber"
                    type="text"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    onBlur={() => handleBlur("unitNumber")}
                    placeholder="e.g. 4B"
                    className={inputClass("unitNumber")}
                  />
                  {showError("unitNumber") && (
                    <p className="mt-1 text-xs text-red-500">{errors.unitNumber}</p>
                  )}
                </div>

                {/* Property Code */}
                <div>
                  <label htmlFor="propertyCode" className="block text-sm font-medium text-slate-700">
                    Building / Invitation Code{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="propertyCode"
                    type="text"
                    value={propertyCode}
                    onChange={(e) => setPropertyCode(e.target.value)}
                    placeholder="Provided by your landlord"
                    className={`${inputBase} ${inputDefault}`}
                  />
                </div>

                {/* Move-in Date */}
                <div>
                  <label htmlFor="moveInDate" className="block text-sm font-medium text-slate-700">
                    Move-in Date{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="moveInDate"
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className={`${inputBase} ${inputDefault}`}
                  />
                </div>

                {/* Emergency Contact Name */}
                <div>
                  <label htmlFor="emergencyName" className="block text-sm font-medium text-slate-700">
                    Emergency Contact Name{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="emergencyName"
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className={`${inputBase} ${inputDefault}`}
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div className="md:col-span-2">
                  <label htmlFor="emergencyPhone" className="block text-sm font-medium text-slate-700">
                    Emergency Contact Phone{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="emergencyPhone"
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={`${inputBase} ${inputDefault} md:max-w-xs`}
                  />
                </div>

              </div>

              {/* ── Section C: Agreement ──────────────────────────────────── */}
              <SectionDivider label="Agreement" />

              <div className="mt-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      setTouched((t) => ({ ...t, agreeToTerms: true }));
                      setErrors(validate({ ...currentFields(), agreeToTerms: e.target.checked }));
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 transition duration-200 focus:ring-2 focus:ring-blue-500/20 flex-shrink-0"
                  />
                  <span className="text-sm text-slate-700">
                    I agree to the{" "}
                    <Link href="/terms" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {showError("agreeToTerms") && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* ── Submit ────────────────────────────────────────────────── */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-8 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-blue-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Creating account…" : "Create Tenant Account"}
              </button>

            </form>

            {/* Footer link */}
            <p className="mt-6 text-center text-sm text-slate-600">
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

// ── Section divider (local helper) ────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <div className="flex-1 border-t border-slate-200" />
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <div className="flex-1 border-t border-slate-200" />
    </div>
  );
}
