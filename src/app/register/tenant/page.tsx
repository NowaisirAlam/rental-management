"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";

// ── Types ──────────────────────────────────────────────────────────────────────

type FormFields = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  apartmentOrUnitNumber: string;
  buildingOrInvitationCode: string;
  moveInDate: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
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

  if (!fields.apartmentOrUnitNumber.trim())
    errs.apartmentOrUnitNumber = "Apartment / Unit number is required.";

  if (!fields.buildingOrInvitationCode.trim())
    errs.buildingOrInvitationCode = "Building / Invitation code is required.";

  if (!fields.moveInDate.trim()) errs.moveInDate = "Move-in date is required.";

  if (!fields.emergencyContactName.trim())
    errs.emergencyContactName = "Emergency contact name is required.";

  if (!fields.emergencyContactPhone.trim())
    errs.emergencyContactPhone = "Emergency contact phone is required.";

  if (!fields.agreeToTerms)
    errs.agreeToTerms = "You must agree to the Terms & Privacy Policy.";

  return errs;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function TenantRegisterPage() {
  const router = useRouter();

  // Field values
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apartmentOrUnitNumber, setApartmentOrUnitNumber] = useState("");
  const [buildingOrInvitationCode, setBuildingOrInvitationCode] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentFields = (): FormFields => ({
    fullName, email, phone, password, confirmPassword,
    apartmentOrUnitNumber, buildingOrInvitationCode, moveInDate,
    emergencyContactName, emergencyContactPhone, agreeToTerms,
  });

  const showError = (field: string) =>
    (touched[field] || submitted) ? errors[field] : undefined;

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(currentFields()));
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    const errs = validate(currentFields());
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);

    const res = await fetch("/api/auth/register/tenant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName, email, phone, password, confirmPassword,
        apartmentOrUnitNumber, buildingOrInvitationCode, moveInDate,
        emergencyContactName, emergencyContactPhone, agreeToTerms,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) {
        setErrors(data.errors);
        if (data.errors.server) setServerError(data.errors.server);
      } else {
        setServerError("Registration failed. Please try again.");
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setShowSuccessModal(true);
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

            {/* Server error banner */}
            {serverError && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

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

                {/* Apartment / Unit Number */}
                <div>
                  <label htmlFor="apartmentOrUnitNumber" className="block text-sm font-medium text-slate-700">
                    Apartment / Unit Number
                  </label>
                  <input
                    id="apartmentOrUnitNumber"
                    type="text"
                    value={apartmentOrUnitNumber}
                    onChange={(e) => setApartmentOrUnitNumber(e.target.value)}
                    onBlur={() => handleBlur("apartmentOrUnitNumber")}
                    placeholder="e.g. 4B"
                    className={inputClass("apartmentOrUnitNumber")}
                  />
                  {showError("apartmentOrUnitNumber") && (
                    <p className="mt-1 text-xs text-red-500">{errors.apartmentOrUnitNumber}</p>
                  )}
                </div>

                {/* Building / Invitation Code */}
                <div>
                  <label htmlFor="buildingOrInvitationCode" className="block text-sm font-medium text-slate-700">
                    Building / Invitation Code
                  </label>
                  <input
                    id="buildingOrInvitationCode"
                    type="text"
                    value={buildingOrInvitationCode}
                    onChange={(e) => setBuildingOrInvitationCode(e.target.value)}
                    onBlur={() => handleBlur("buildingOrInvitationCode")}
                    placeholder="Provided by your landlord"
                    className={inputClass("buildingOrInvitationCode")}
                  />
                  {showError("buildingOrInvitationCode") && (
                    <p className="mt-1 text-xs text-red-500">{errors.buildingOrInvitationCode}</p>
                  )}
                </div>

                {/* Move-in Date */}
                <div>
                  <label htmlFor="moveInDate" className="block text-sm font-medium text-slate-700">
                    Move-in Date
                  </label>
                  <input
                    id="moveInDate"
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    onBlur={() => handleBlur("moveInDate")}
                    className={inputClass("moveInDate")}
                  />
                  {showError("moveInDate") && (
                    <p className="mt-1 text-xs text-red-500">{errors.moveInDate}</p>
                  )}
                </div>

                {/* Emergency Contact Name */}
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-slate-700">
                    Emergency Contact Name
                  </label>
                  <input
                    id="emergencyContactName"
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    onBlur={() => handleBlur("emergencyContactName")}
                    placeholder="e.g. John Smith"
                    className={inputClass("emergencyContactName")}
                  />
                  {showError("emergencyContactName") && (
                    <p className="mt-1 text-xs text-red-500">{errors.emergencyContactName}</p>
                  )}
                </div>

                {/* Emergency Contact Phone */}
                <div className="md:col-span-2">
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-slate-700">
                    Emergency Contact Phone
                  </label>
                  <input
                    id="emergencyContactPhone"
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    onBlur={() => handleBlur("emergencyContactPhone")}
                    placeholder="+1 (555) 000-0000"
                    className={`${inputClass("emergencyContactPhone")} md:max-w-xs`}
                  />
                  {showError("emergencyContactPhone") && (
                    <p className="mt-1 text-xs text-red-500">{errors.emergencyContactPhone}</p>
                  )}
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

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Account successfully created</h3>
                <p className="mt-1.5 text-sm text-slate-500">
                  Your tenant account is ready. Continue to login.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
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
