"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, Eye, EyeOff, X } from "lucide-react";
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
  companyOrLandlordName: string;
  numberOfUnitsManaged: string;
  primaryPropertyStreetAddress: string;
  city: string;
  postalOrZipCode: string;
  propertyOwnerType: string;
  propertyType: string;
  confirmOwnershipOrAuthorization: boolean;
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

  if (!fields.companyOrLandlordName.trim())
    errs.companyOrLandlordName = "Company / Landlord name is required.";

  if (!fields.numberOfUnitsManaged.trim())
    errs.numberOfUnitsManaged = "Number of units managed is required.";

  if (!fields.primaryPropertyStreetAddress.trim())
    errs.primaryPropertyStreetAddress = "Street address is required.";

  if (!fields.city.trim()) errs.city = "City is required.";

  if (!fields.postalOrZipCode.trim())
    errs.postalOrZipCode = "Postal / ZIP code is required.";

  if (!fields.propertyOwnerType.trim())
    errs.propertyOwnerType = "Property ownership type is required.";

  if (!fields.propertyType.trim())
    errs.propertyType = "Property type is required.";

  if (!fields.confirmOwnershipOrAuthorization)
    errs.confirmOwnershipOrAuthorization =
      "You must confirm you are the owner or authorized manager.";

  if (!fields.agreeToTerms)
    errs.agreeToTerms = "You must agree to the Terms & Privacy Policy.";

  return errs;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function LandlordRegisterPage() {
  const router = useRouter();

  // Field values — Section A
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Field values — Section B
  const [companyOrLandlordName, setCompanyOrLandlordName] = useState("");
  const [numberOfUnitsManaged, setNumberOfUnitsManaged] = useState("");
  const [primaryPropertyStreetAddress, setPrimaryPropertyStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalOrZipCode, setPostalOrZipCode] = useState("");
  const [propertyOwnerType, setPropertyOwnerType] = useState("");
  const [propertyType, setPropertyType] = useState("");

  // Field values — Section C & D
  const [confirmOwnershipOrAuthorization, setConfirmOwnershipOrAuthorization] = useState(false);
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
    companyOrLandlordName, numberOfUnitsManaged,
    primaryPropertyStreetAddress, city, postalOrZipCode,
    propertyOwnerType, propertyType,
    confirmOwnershipOrAuthorization, agreeToTerms,
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

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName, email, password, role: "LANDLORD",
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

  const selectClass = (field: string) =>
    `${inputBase} ${showError(field) ? inputError : inputDefault} appearance-none pr-10`;

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
              Landlord Registration
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Create your landlord account
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

              {/* ── Section B: Business / Property Details ────────────────── */}
              <SectionDivider label="Business / Property Details" />

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                {/* Company / Landlord Name */}
                <div className="md:col-span-2">
                  <label htmlFor="companyOrLandlordName" className="block text-sm font-medium text-slate-700">
                    Company / Landlord Name
                  </label>
                  <input
                    id="companyOrLandlordName"
                    type="text"
                    value={companyOrLandlordName}
                    onChange={(e) => setCompanyOrLandlordName(e.target.value)}
                    onBlur={() => handleBlur("companyOrLandlordName")}
                    placeholder="e.g. Smith Properties LLC"
                    className={inputClass("companyOrLandlordName")}
                  />
                  {showError("companyOrLandlordName") && (
                    <p className="mt-1 text-xs text-red-500">{errors.companyOrLandlordName}</p>
                  )}
                </div>

                {/* Number of Units Managed */}
                <div>
                  <label htmlFor="numberOfUnitsManaged" className="block text-sm font-medium text-slate-700">
                    Number of Units Managed
                  </label>
                  <div className="relative">
                    <select
                      id="numberOfUnitsManaged"
                      value={numberOfUnitsManaged}
                      onChange={(e) => setNumberOfUnitsManaged(e.target.value)}
                      onBlur={() => handleBlur("numberOfUnitsManaged")}
                      className={selectClass("numberOfUnitsManaged")}
                    >
                      <option value="" disabled>Select range…</option>
                      <option value="1">1</option>
                      <option value="2-5">2 – 5</option>
                      <option value="6-20">6 – 20</option>
                      <option value="21-50">21 – 50</option>
                      <option value="50+">50+</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                  {showError("numberOfUnitsManaged") && (
                    <p className="mt-1 text-xs text-red-500">{errors.numberOfUnitsManaged}</p>
                  )}
                </div>

                {/* Property Ownership Type */}
                <div>
                  <label htmlFor="propertyOwnerType" className="block text-sm font-medium text-slate-700">
                    Property Ownership Type
                  </label>
                  <div className="relative">
                    <select
                      id="propertyOwnerType"
                      value={propertyOwnerType}
                      onChange={(e) => setPropertyOwnerType(e.target.value)}
                      onBlur={() => handleBlur("propertyOwnerType")}
                      className={selectClass("propertyOwnerType")}
                    >
                      <option value="" disabled>Select type…</option>
                      <option value="Individual Owner">Individual Owner</option>
                      <option value="Property Management Company">Property Management Company</option>
                      <option value="Realtor / Agent">Realtor / Agent</option>
                      <option value="Housing Cooperative">Housing Cooperative</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                  {showError("propertyOwnerType") && (
                    <p className="mt-1 text-xs text-red-500">{errors.propertyOwnerType}</p>
                  )}
                </div>

                {/* Property Type */}
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700">
                    Property Type
                  </label>
                  <div className="relative">
                    <select
                      id="propertyType"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      onBlur={() => handleBlur("propertyType")}
                      className={selectClass("propertyType")}
                    >
                      <option value="" disabled>Select type…</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Condo">Condo</option>
                      <option value="House">House</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Duplex">Duplex</option>
                      <option value="Triplex">Triplex</option>
                      <option value="Fourplex">Fourplex</option>
                      <option value="Multi-family Building">Multi-family Building</option>
                      <option value="Basement Unit">Basement Unit</option>
                      <option value="Room Rental">Room Rental</option>
                      <option value="Student Housing">Student Housing</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Mixed-use">Mixed-use</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                  {showError("propertyType") && (
                    <p className="mt-1 text-xs text-red-500">{errors.propertyType}</p>
                  )}
                </div>

                {/* Primary Property Street Address — full width */}
                <div className="md:col-span-2">
                  <label htmlFor="primaryPropertyStreetAddress" className="block text-sm font-medium text-slate-700">
                    Primary Property Street Address
                  </label>
                  <input
                    id="primaryPropertyStreetAddress"
                    type="text"
                    value={primaryPropertyStreetAddress}
                    onChange={(e) => setPrimaryPropertyStreetAddress(e.target.value)}
                    onBlur={() => handleBlur("primaryPropertyStreetAddress")}
                    placeholder="123 Main Street"
                    className={inputClass("primaryPropertyStreetAddress")}
                  />
                  {showError("primaryPropertyStreetAddress") && (
                    <p className="mt-1 text-xs text-red-500">{errors.primaryPropertyStreetAddress}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onBlur={() => handleBlur("city")}
                    placeholder="Toronto"
                    className={inputClass("city")}
                  />
                  {showError("city") && (
                    <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                  )}
                </div>

                {/* Postal / ZIP Code */}
                <div>
                  <label htmlFor="postalOrZipCode" className="block text-sm font-medium text-slate-700">
                    Postal / ZIP Code
                  </label>
                  <input
                    id="postalOrZipCode"
                    type="text"
                    value={postalOrZipCode}
                    onChange={(e) => setPostalOrZipCode(e.target.value)}
                    onBlur={() => handleBlur("postalOrZipCode")}
                    placeholder="M5V 2T6"
                    className={inputClass("postalOrZipCode")}
                  />
                  {showError("postalOrZipCode") && (
                    <p className="mt-1 text-xs text-red-500">{errors.postalOrZipCode}</p>
                  )}
                </div>

              </div>

              {/* ── Section C: Verification ───────────────────────────────── */}
              <SectionDivider label="Verification" />

              <div className="mt-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    id="confirmOwnershipOrAuthorization"
                    type="checkbox"
                    checked={confirmOwnershipOrAuthorization}
                    onChange={(e) => {
                      setConfirmOwnershipOrAuthorization(e.target.checked);
                      setTouched((t) => ({ ...t, confirmOwnershipOrAuthorization: true }));
                      setErrors(validate({ ...currentFields(), confirmOwnershipOrAuthorization: e.target.checked }));
                    }}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-slate-300 text-blue-600 transition duration-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="text-sm text-slate-700">
                    I confirm I am the property owner or an authorized property manager
                  </span>
                </label>
                {showError("confirmOwnershipOrAuthorization") && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.confirmOwnershipOrAuthorization}</p>
                )}
              </div>

              {/* ── Section D: Agreement ──────────────────────────────────── */}
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
                    className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-slate-300 text-blue-600 transition duration-200 focus:ring-2 focus:ring-blue-500/20"
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
                {isLoading ? "Creating account…" : "Create Landlord Account"}
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
                  Your landlord account is ready. Continue to login.
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
