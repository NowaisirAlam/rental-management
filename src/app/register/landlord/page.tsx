"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
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
  unitsManaged: string;
  ownershipType: string;
  propertyTypes: string[];
  propertyStreet: string;
  propertyCity: string;
  propertyPostal: string;
  isAuthorized: boolean;
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

  if (!fields.unitsManaged) errs.unitsManaged = "Please select the number of units you manage.";
  if (!fields.ownershipType) errs.ownershipType = "Please select a property ownership type.";
  if (fields.propertyTypes.length === 0) errs.propertyTypes = "Please select at least one property type.";

  if (!fields.propertyStreet.trim()) errs.propertyStreet = "Street address is required.";
  if (!fields.propertyCity.trim()) errs.propertyCity = "City is required.";
  if (!fields.propertyPostal.trim()) errs.propertyPostal = "Postal / ZIP code is required.";

  if (!fields.isAuthorized) errs.isAuthorized = "You must confirm you are the owner or authorized manager.";
  if (!fields.agreeToTerms) errs.agreeToTerms = "You must agree to the Terms & Privacy Policy.";

  return errs;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function LandlordRegisterPage() {
  // Field values — Section A
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Field values — Section B
  const [companyName, setCompanyName] = useState("");
  const [unitsManaged, setUnitsManaged] = useState("");
  const [ownershipType, setOwnershipType] = useState("");
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [propertyStreet, setPropertyStreet] = useState("");
  const [propertyCity, setPropertyCity] = useState("");
  const [propertyPostal, setPropertyPostal] = useState("");
  const [supportEmail, setSupportEmail] = useState("");

  // Field values — Section C & D
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper: current required field values for validate()
  const currentFields = (): FormFields => ({
    fullName, email, phone, password, confirmPassword,
    unitsManaged, ownershipType, propertyTypes,
    propertyStreet, propertyCity, propertyPostal,
    isAuthorized, agreeToTerms,
  });

  const togglePropertyType = (value: string) => {
    const next = propertyTypes.includes(value)
      ? propertyTypes.filter((v) => v !== value)
      : [...propertyTypes, value];
    setPropertyTypes(next);
    setTouched((t) => ({ ...t, propertyTypes: true }));
    setErrors(validate({ ...currentFields(), propertyTypes: next }));
  };

  // Show error only when field has been touched or form was submitted
  const showError = (field: string) =>
    (touched[field] || submitted) ? errors[field] : undefined;

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(currentFields()));
  };

  const router = useRouter();
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError("");
    const errs = validate(currentFields());
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          role: "LANDLORD",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setApiError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setApiError("Account created but login failed. Please log in manually.");
        setIsLoading(false);
        return;
      }

      router.push("/landlord/dashboard");
    } catch {
      setApiError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
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
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
                    Company / Landlord Name{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Smith Properties LLC"
                    className={`${inputBase} ${inputDefault}`}
                  />
                </div>

                {/* Number of Units Managed */}
                <div>
                  <label htmlFor="unitsManaged" className="block text-sm font-medium text-slate-700">
                    Number of Units Managed
                  </label>
                  <div className="relative">
                    <select
                      id="unitsManaged"
                      value={unitsManaged}
                      onChange={(e) => setUnitsManaged(e.target.value)}
                      onBlur={() => handleBlur("unitsManaged")}
                      className={selectClass("unitsManaged")}
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
                  {showError("unitsManaged") && (
                    <p className="mt-1 text-xs text-red-500">{errors.unitsManaged}</p>
                  )}
                </div>

                {/* Property Street Address — full width */}
                <div className="md:col-span-2">
                  <label htmlFor="propertyStreet" className="block text-sm font-medium text-slate-700">
                    Primary Property Street Address
                  </label>
                  <input
                    id="propertyStreet"
                    type="text"
                    value={propertyStreet}
                    onChange={(e) => setPropertyStreet(e.target.value)}
                    onBlur={() => handleBlur("propertyStreet")}
                    placeholder="123 Main Street"
                    className={inputClass("propertyStreet")}
                  />
                  {showError("propertyStreet") && (
                    <p className="mt-1 text-xs text-red-500">{errors.propertyStreet}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="propertyCity" className="block text-sm font-medium text-slate-700">
                    City
                  </label>
                  <input
                    id="propertyCity"
                    type="text"
                    value={propertyCity}
                    onChange={(e) => setPropertyCity(e.target.value)}
                    onBlur={() => handleBlur("propertyCity")}
                    placeholder="Toronto"
                    className={inputClass("propertyCity")}
                  />
                  {showError("propertyCity") && (
                    <p className="mt-1 text-xs text-red-500">{errors.propertyCity}</p>
                  )}
                </div>

                {/* Postal / ZIP Code */}
                <div>
                  <label htmlFor="propertyPostal" className="block text-sm font-medium text-slate-700">
                    Postal / ZIP Code
                  </label>
                  <input
                    id="propertyPostal"
                    type="text"
                    value={propertyPostal}
                    onChange={(e) => setPropertyPostal(e.target.value)}
                    onBlur={() => handleBlur("propertyPostal")}
                    placeholder="M5V 2T6"
                    className={inputClass("propertyPostal")}
                  />
                  {showError("propertyPostal") && (
                    <p className="mt-1 text-xs text-red-500">{errors.propertyPostal}</p>
                  )}
                </div>

                {/* Property Ownership Type */}
                <div>
                  <label htmlFor="ownershipType" className="block text-sm font-medium text-slate-700">
                    Property Ownership Type
                  </label>
                  <div className="relative">
                    <select
                      id="ownershipType"
                      value={ownershipType}
                      onChange={(e) => setOwnershipType(e.target.value)}
                      onBlur={() => handleBlur("ownershipType")}
                      className={selectClass("ownershipType")}
                    >
                      <option value="" disabled>Select type…</option>
                      <option value="individual">Individual Owner</option>
                      <option value="mgmt-company">Property Management Company</option>
                      <option value="real-estate-agency">Real Estate Agency</option>
                      <option value="investor-group">Investor Group</option>
                      <option value="developer">Real Estate Developer</option>
                      <option value="housing-assoc">Housing Association / Co-op</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                  {showError("ownershipType") && (
                    <p className="mt-1 text-xs text-red-500">{errors.ownershipType}</p>
                  )}
                </div>

                {/* Property Types Managed — full-width checkbox grid */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Property Types Managed
                  </label>
                  <div
                    className={`mt-2 rounded-lg border px-4 py-3 ${
                      showError("propertyTypes")
                        ? "border-red-400"
                        : "border-slate-300"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
                      {[
                        "Apartments",
                        "Condos",
                        "Single-Family Homes",
                        "Multi-Family Homes",
                        "Townhouses",
                        "Student Housing",
                        "Commercial Offices",
                        "Retail Spaces",
                        "Industrial Properties",
                        "Mixed-Use Buildings",
                        "Vacation Rentals",
                        "Affordable Housing",
                        "Senior Living / Assisted Living",
                        "Other",
                      ].map((type) => (
                        <label key={type} className="flex cursor-pointer items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={propertyTypes.includes(type)}
                            onChange={() => togglePropertyType(type)}
                            className="h-4 w-4 flex-shrink-0 rounded border-slate-300 text-blue-600 transition duration-200 focus:ring-2 focus:ring-blue-500/20"
                          />
                          <span className="text-sm text-slate-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {showError("propertyTypes") && (
                    <p className="mt-1 text-xs text-red-500">{errors.propertyTypes}</p>
                  )}
                </div>

                {/* Support Contact Email */}
                <div>
                  <label htmlFor="supportEmail" className="block text-sm font-medium text-slate-700">
                    Support Contact Email{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="supportEmail"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="support@yourcompany.com"
                    className={`${inputBase} ${inputDefault}`}
                  />
                </div>

              </div>

              {/* ── Section C: Verification ───────────────────────────────── */}
              <SectionDivider label="Verification" />

              <div className="mt-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    id="isAuthorized"
                    type="checkbox"
                    checked={isAuthorized}
                    onChange={(e) => {
                      setIsAuthorized(e.target.checked);
                      setTouched((t) => ({ ...t, isAuthorized: true }));
                      setErrors(validate({ ...currentFields(), isAuthorized: e.target.checked }));
                    }}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-slate-300 text-blue-600 transition duration-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="text-sm text-slate-700">
                    I confirm I am the property owner or an authorized property manager
                  </span>
                </label>
                {showError("isAuthorized") && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.isAuthorized}</p>
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
