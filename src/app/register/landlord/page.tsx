"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

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

  const fieldClass = (field: string) =>
    showError(field) ? "has-error" : "";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        .tr-page {
          min-height: 100vh;
          background: #FAF7F2;
          font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 128px 24px 80px;
        }

        .tr-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 56px;
          height: 72px;
          background: rgba(26,23,20,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .tr-navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.8rem;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
        }

        .tr-navbar-brand svg {
          width: 30px;
          height: 30px;
        }

        .tr-navbar-links {
          display: flex;
          gap: 36px;
        }

        .tr-navbar-links a {
          font-size: 0.85rem;
          font-weight: 400;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.02em;
          transition: color 0.25s;
          text-decoration: none;
        }

        .tr-navbar-links a:hover {
          color: rgba(255,255,255,0.85);
        }

        .tr-navbar-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .tr-navbar-actions .tr-login {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          transition: color 0.25s;
          text-decoration: none;
        }

        .tr-navbar-actions .tr-login:hover {
          color: rgba(255,255,255,0.85);
        }

        .tr-btn-nav {
          padding: 9px 22px;
          font-size: 0.82rem;
          font-weight: 500;
          color: #1A1714;
          background: #C4956A;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: background 0.25s, transform 0.15s;
          text-decoration: none;
          display: inline-block;
        }

        .tr-btn-nav:hover {
          background: #B07E55;
          transform: translateY(-1px);
        }

        .tr-inner {
          max-width: 620px;
          margin: 0 auto;
        }

        .tr-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.88rem;
          color: #7A7267;
          text-decoration: none;
          margin-bottom: 28px;
          transition: color 0.2s;
        }
        .tr-back:hover { color: #2D2A26; }

        .tr-card {
          background: #FFFDF9;
          border: 1px solid #DDD5C8;
          border-radius: 16px;
          padding: 44px 48px;
        }

        .tr-label-tag {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #C4956A;
          margin-bottom: 10px;
        }

        .tr-card h1 {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 2.2rem;
          font-weight: 400;
          color: #2D2A26;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .tr-card > p {
          font-size: 0.95rem;
          color: #7A7267;
          margin-bottom: 0;
        }

        .tr-error-banner {
          margin-top: 20px;
          padding: 13px 16px;
          border-radius: 8px;
          border: 1px solid rgba(160,64,64,0.3);
          background: rgba(160,64,64,0.07);
          font-size: 0.9rem;
          color: #A04040;
        }

        .tr-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 32px 0 24px;
          color: #b5ac9e;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .tr-divider::before, .tr-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #DDD5C8;
        }

        .tr-fields { display: flex; flex-direction: column; gap: 20px; }
        .tr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .tr-field label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #7A7267;
          margin-bottom: 8px;
        }

        .tr-field input[type="text"],
        .tr-field input[type="email"],
        .tr-field input[type="tel"],
        .tr-field input[type="password"],
        .tr-field input[type="date"],
        .tr-field select {
          width: 100%;
          padding: 13px 16px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #2D2A26;
          background: #F0EBE1;
          border: 1px solid #DDD5C8;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .tr-field input:focus,
        .tr-field select:focus {
          border-color: #C4956A;
          box-shadow: 0 0 0 3px rgba(196,149,106,0.15);
        }
        .tr-field input.has-error,
        .tr-field select.has-error {
          border-color: #A04040;
        }
        .tr-field input.has-error:focus,
        .tr-field select.has-error:focus {
          box-shadow: 0 0 0 3px rgba(160,64,64,0.12);
        }
        .tr-field input::placeholder { color: #b5ac9e; }

        .tr-pw-wrap { position: relative; }
        .tr-pw-wrap input { padding-right: 44px; }
        .tr-eye {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #7A7267; display: flex; align-items: center; padding: 0;
          transition: color 0.2s;
        }
        .tr-eye:hover { color: #2D2A26; }

        .tr-select-wrap { position: relative; }
        .tr-select-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #7A7267;
        }

        .tr-field-error {
          margin-top: 5px;
          font-size: 0.78rem;
          color: #A04040;
        }

        .tr-check-wrap {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }
        .tr-check-wrap input[type="checkbox"] {
          width: 17px;
          height: 17px;
          margin-top: 1px;
          flex-shrink: 0;
          accent-color: #C4956A;
          cursor: pointer;
        }
        .tr-check-wrap span {
          font-size: 0.9rem;
          color: #7A7267;
          line-height: 1.5;
        }
        .tr-check-wrap span a {
          color: #C4956A;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .tr-check-wrap span a:hover { color: #B07E55; text-decoration: underline; }

        .tr-submit {
          width: 100%;
          margin-top: 32px;
          padding: 15px;
          font-size: 0.88rem;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #FAF7F2;
          background: #1A1714;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.25s, transform 0.15s;
        }
        .tr-submit:hover:not(:disabled) { background: #2D2826; transform: translateY(-1px); }
        .tr-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .tr-footer-link {
          margin-top: 24px;
          text-align: center;
          font-size: 0.9rem;
          color: #7A7267;
        }
        .tr-footer-link a {
          color: #C4956A;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .tr-footer-link a:hover { color: #B07E55; }

        .tr-modal-backdrop {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        .tr-modal-overlay {
          position: absolute; inset: 0;
          background: rgba(13,9,6,0.5); backdrop-filter: blur(4px);
        }
        .tr-modal {
          position: relative; z-index: 10;
          width: 100%; max-width: 360px;
          background: #FFFDF9;
          border: 1px solid #DDD5C8;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(13,9,6,0.25);
        }
        .tr-modal-close {
          position: absolute; right: 16px; top: 16px;
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 8px;
          background: none; border: none; cursor: pointer;
          color: #7A7267; transition: background 0.2s, color 0.2s;
        }
        .tr-modal-close:hover { background: #F0EBE1; color: #2D2A26; }
        .tr-modal-icon {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(107,143,94,0.12);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .tr-modal h3 {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.3rem;
          font-weight: 400;
          color: #2D2A26;
          margin-bottom: 8px;
        }
        .tr-modal p {
          font-size: 0.88rem;
          color: #7A7267;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .tr-modal-btn {
          width: 100%;
          padding: 13px;
          font-size: 0.88rem;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #FAF7F2;
          background: #1A1714;
          border: none; border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .tr-modal-btn:hover { background: #2D2826; }

        @media (max-width: 640px) {
          .tr-card { padding: 28px 20px; }
          .tr-grid { grid-template-columns: 1fr; }
          .tr-navbar { padding: 0 20px; }
          .tr-navbar-links { display: none; }
        }
      `}</style>

      <nav className="tr-navbar" id="navbar">
        <Link href="/" className="tr-navbar-brand">
          <LogoIcon />
          PropManager
        </Link>
        <div className="tr-navbar-links">
          <Link href="/#features">Features</Link>
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/#for-you">For You</Link>
          <Link href="/#pricing">Pricing</Link>
        </div>
        <div className="tr-navbar-actions">
          <Link href="/login" className="tr-login">
            Log in
          </Link>
          <Link href="/register" className="tr-btn-nav">
            Get Started
          </Link>
        </div>
      </nav>

      <div className="tr-page">
        <div className="tr-inner">

          <Link href="/register" className="tr-back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to role selection
          </Link>

          <div className="tr-card">
            <p className="tr-label-tag">Landlord Registration</p>
            <h1>Create your landlord account</h1>
            <p>Fill in your details below to get started with PropManager.</p>

            {serverError && (
              <div className="tr-error-banner">{serverError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              <div className="tr-divider">Account Credentials</div>
              <div className="tr-fields">
                <div className="tr-field">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="Jane Smith"
                    className={fieldClass("fullName")}
                  />
                  {showError("fullName") && <p className="tr-field-error">{errors.fullName}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    className={fieldClass("email")}
                  />
                  {showError("email") && <p className="tr-field-error">{errors.email}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+1 (555) 000-0000"
                    className={fieldClass("phone")}
                  />
                  {showError("phone") && <p className="tr-field-error">{errors.phone}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="password">Password</label>
                  <div className="tr-pw-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="Min. 8 characters"
                      className={fieldClass("password")}
                    />
                    <button
                      type="button"
                      className="tr-eye"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {showError("password") && <p className="tr-field-error">{errors.password}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="tr-pw-wrap">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Re-enter your password"
                      className={fieldClass("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="tr-eye"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {showError("confirmPassword") && <p className="tr-field-error">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="tr-divider">Business / Property Details</div>
              <div className="tr-grid">
                <div className="tr-field" style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="companyOrLandlordName">Company / Landlord Name</label>
                  <input
                    id="companyOrLandlordName"
                    type="text"
                    value={companyOrLandlordName}
                    onChange={(e) => setCompanyOrLandlordName(e.target.value)}
                    onBlur={() => handleBlur("companyOrLandlordName")}
                    placeholder="e.g. Smith Properties LLC"
                    className={fieldClass("companyOrLandlordName")}
                  />
                  {showError("companyOrLandlordName") && <p className="tr-field-error">{errors.companyOrLandlordName}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="numberOfUnitsManaged">Number of Units Managed</label>
                  <div className="tr-select-wrap">
                    <select
                      id="numberOfUnitsManaged"
                      value={numberOfUnitsManaged}
                      onChange={(e) => setNumberOfUnitsManaged(e.target.value)}
                      onBlur={() => handleBlur("numberOfUnitsManaged")}
                      className={fieldClass("numberOfUnitsManaged")}
                    >
                      <option value="" disabled>Select range…</option>
                      <option value="1">1</option>
                      <option value="2-5">2 – 5</option>
                      <option value="6-20">6 – 20</option>
                      <option value="21-50">21 – 50</option>
                      <option value="50+">50+</option>
                    </select>
                    <ChevronDown className="tr-select-icon" size={16} />
                  </div>
                  {showError("numberOfUnitsManaged") && <p className="tr-field-error">{errors.numberOfUnitsManaged}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="propertyOwnerType">Property Ownership Type</label>
                  <div className="tr-select-wrap">
                    <select
                      id="propertyOwnerType"
                      value={propertyOwnerType}
                      onChange={(e) => setPropertyOwnerType(e.target.value)}
                      onBlur={() => handleBlur("propertyOwnerType")}
                      className={fieldClass("propertyOwnerType")}
                    >
                      <option value="" disabled>Select type…</option>
                      <option value="Individual Owner">Individual Owner</option>
                      <option value="Property Management Company">Property Management Company</option>
                      <option value="Realtor / Agent">Realtor / Agent</option>
                      <option value="Housing Cooperative">Housing Cooperative</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="tr-select-icon" size={16} />
                  </div>
                  {showError("propertyOwnerType") && <p className="tr-field-error">{errors.propertyOwnerType}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="propertyType">Property Type</label>
                  <div className="tr-select-wrap">
                    <select
                      id="propertyType"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      onBlur={() => handleBlur("propertyType")}
                      className={fieldClass("propertyType")}
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
                    <ChevronDown className="tr-select-icon" size={16} />
                  </div>
                  {showError("propertyType") && <p className="tr-field-error">{errors.propertyType}</p>}
                </div>

                <div className="tr-field" style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="primaryPropertyStreetAddress">Primary Property Street Address</label>
                  <input
                    id="primaryPropertyStreetAddress"
                    type="text"
                    value={primaryPropertyStreetAddress}
                    onChange={(e) => setPrimaryPropertyStreetAddress(e.target.value)}
                    onBlur={() => handleBlur("primaryPropertyStreetAddress")}
                    placeholder="123 Main Street"
                    className={fieldClass("primaryPropertyStreetAddress")}
                  />
                  {showError("primaryPropertyStreetAddress") && <p className="tr-field-error">{errors.primaryPropertyStreetAddress}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onBlur={() => handleBlur("city")}
                    placeholder="Toronto"
                    className={fieldClass("city")}
                  />
                  {showError("city") && <p className="tr-field-error">{errors.city}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="postalOrZipCode">Postal / ZIP Code</label>
                  <input
                    id="postalOrZipCode"
                    type="text"
                    value={postalOrZipCode}
                    onChange={(e) => setPostalOrZipCode(e.target.value)}
                    onBlur={() => handleBlur("postalOrZipCode")}
                    placeholder="M5V 2T6"
                    className={fieldClass("postalOrZipCode")}
                  />
                  {showError("postalOrZipCode") && <p className="tr-field-error">{errors.postalOrZipCode}</p>}
                </div>
              </div>

              <div className="tr-divider">Verification</div>
              <div>
                <label className="tr-check-wrap">
                  <input
                    id="confirmOwnershipOrAuthorization"
                    type="checkbox"
                    checked={confirmOwnershipOrAuthorization}
                    onChange={(e) => {
                      setConfirmOwnershipOrAuthorization(e.target.checked);
                      setTouched((t) => ({ ...t, confirmOwnershipOrAuthorization: true }));
                      setErrors(validate({ ...currentFields(), confirmOwnershipOrAuthorization: e.target.checked }));
                    }}
                  />
                  <span>
                    I confirm I am the property owner or an authorized property manager
                  </span>
                </label>
                {showError("confirmOwnershipOrAuthorization") && (
                  <p className="tr-field-error" style={{ marginTop: 8 }}>{errors.confirmOwnershipOrAuthorization}</p>
                )}
              </div>

              <div className="tr-divider">Agreement</div>
              <div>
                <label className="tr-check-wrap">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      setTouched((t) => ({ ...t, agreeToTerms: true }));
                      setErrors(validate({ ...currentFields(), agreeToTerms: e.target.checked }));
                    }}
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy">Privacy Policy</Link>
                  </span>
                </label>
                {showError("agreeToTerms") && (
                  <p className="tr-field-error" style={{ marginTop: 8 }}>{errors.agreeToTerms}</p>
                )}
              </div>

              <button type="submit" className="tr-submit" disabled={isLoading}>
                {isLoading ? "Creating account…" : "Create Landlord Account"}
              </button>
            </form>

            <p className="tr-footer-link">
              Already registered? <Link href="/login">Sign in</Link>
            </p>
          </div>

        </div>
      </div>

      {showSuccessModal && (
        <div className="tr-modal-backdrop">
          <div className="tr-modal-overlay" />
          <div className="tr-modal">
            <button type="button" className="tr-modal-close" onClick={() => setShowSuccessModal(false)} aria-label="Close">
              <X size={16} />
            </button>
            <div className="tr-modal-icon">
              <CheckCircle2 size={22} color="#6B8F5E" />
            </div>
            <h3>Account created</h3>
            <p>Your landlord account is ready. Continue to sign in.</p>
            <button type="button" className="tr-modal-btn" onClick={() => router.push("/login")}>
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
  return <div className="tr-divider">{label}</div>;
}

function LogoIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#C4956A" />
      <path d="M8 24V10a2 2 0 012-2h12a2 2 0 012 2v14" stroke="#1A1714" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 24V16h8v8" stroke="#1A1714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="16" x2="16" y2="24" stroke="#1A1714" strokeWidth="2" />
    </svg>
  );
}
