"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

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
  } else if (!/^\+?[\d\s\-() ]{7,}$/.test(fields.phone)) {
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

export default function TenantRegisterPage() {
  const router = useRouter();

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fullName, email, password, role: "TENANT" }),
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
          font-size: 1.35rem;
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

        /* Section divider */
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

        /* Fields */
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
        .tr-field input[type="date"] {
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
        .tr-field input:focus {
          border-color: #C4956A;
          box-shadow: 0 0 0 3px rgba(196,149,106,0.15);
        }
        .tr-field input.has-error {
          border-color: #A04040;
        }
        .tr-field input.has-error:focus {
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

        .tr-field-error {
          margin-top: 5px;
          font-size: 0.78rem;
          color: #A04040;
        }

        /* Checkbox */
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

        /* Submit */
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

        /* Success modal */
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
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to role selection
          </Link>

          <div className="tr-card">
            <p className="tr-label-tag">Tenant Registration</p>
            <h1>Create your tenant account</h1>
            <p>Fill in your details below to get started with PropManager.</p>

            {serverError && (
              <div className="tr-error-banner">{serverError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Account Credentials */}
              <div className="tr-divider">Account Credentials</div>
              <div className="tr-fields">

                <div className="tr-field">
                  <label htmlFor="fullName">Full Name</label>
                  <input id="fullName" type="text" value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="Jane Smith"
                    className={showError("fullName") ? "has-error" : ""}
                  />
                  {showError("fullName") && <p className="tr-field-error">{errors.fullName}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    className={showError("email") ? "has-error" : ""}
                  />
                  {showError("email") && <p className="tr-field-error">{errors.email}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input id="phone" type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+1 (555) 000-0000"
                    className={showError("phone") ? "has-error" : ""}
                  />
                  {showError("phone") && <p className="tr-field-error">{errors.phone}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="password">Password</label>
                  <div className="tr-pw-wrap">
                    <input id="password" type={showPassword ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="Min. 8 characters"
                      className={showError("password") ? "has-error" : ""}
                    />
                    <button type="button" className="tr-eye" onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {showError("password") && <p className="tr-field-error">{errors.password}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="tr-pw-wrap">
                    <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Re-enter your password"
                      className={showError("confirmPassword") ? "has-error" : ""}
                    />
                    <button type="button" className="tr-eye" onClick={() => setShowConfirmPassword(v => !v)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {showError("confirmPassword") && <p className="tr-field-error">{errors.confirmPassword}</p>}
                </div>

              </div>

              {/* Lease Details */}
              <div className="tr-divider">Lease Details</div>
              <div className="tr-grid">

                <div className="tr-field">
                  <label htmlFor="apartmentOrUnitNumber">Apartment / Unit Number</label>
                  <input id="apartmentOrUnitNumber" type="text" value={apartmentOrUnitNumber}
                    onChange={(e) => setApartmentOrUnitNumber(e.target.value)}
                    onBlur={() => handleBlur("apartmentOrUnitNumber")}
                    placeholder="e.g. 4B"
                    className={showError("apartmentOrUnitNumber") ? "has-error" : ""}
                  />
                  {showError("apartmentOrUnitNumber") && <p className="tr-field-error">{errors.apartmentOrUnitNumber}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="buildingOrInvitationCode">Building / Invitation Code</label>
                  <input id="buildingOrInvitationCode" type="text" value={buildingOrInvitationCode}
                    onChange={(e) => setBuildingOrInvitationCode(e.target.value)}
                    onBlur={() => handleBlur("buildingOrInvitationCode")}
                    placeholder="Provided by your landlord"
                    className={showError("buildingOrInvitationCode") ? "has-error" : ""}
                  />
                  {showError("buildingOrInvitationCode") && <p className="tr-field-error">{errors.buildingOrInvitationCode}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="moveInDate">Move-in Date</label>
                  <input id="moveInDate" type="date" value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    onBlur={() => handleBlur("moveInDate")}
                    className={showError("moveInDate") ? "has-error" : ""}
                  />
                  {showError("moveInDate") && <p className="tr-field-error">{errors.moveInDate}</p>}
                </div>

                <div className="tr-field">
                  <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                  <input id="emergencyContactName" type="text" value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    onBlur={() => handleBlur("emergencyContactName")}
                    placeholder="e.g. John Smith"
                    className={showError("emergencyContactName") ? "has-error" : ""}
                  />
                  {showError("emergencyContactName") && <p className="tr-field-error">{errors.emergencyContactName}</p>}
                </div>

                <div className="tr-field" style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
                  <input id="emergencyContactPhone" type="tel" value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    onBlur={() => handleBlur("emergencyContactPhone")}
                    placeholder="+1 (555) 000-0000"
                    style={{ maxWidth: "50%" }}
                    className={showError("emergencyContactPhone") ? "has-error" : ""}
                  />
                  {showError("emergencyContactPhone") && <p className="tr-field-error">{errors.emergencyContactPhone}</p>}
                </div>

              </div>

              {/* Agreement */}
              <div className="tr-divider">Agreement</div>
              <div>
                <label className="tr-check-wrap">
                  <input type="checkbox" checked={agreeToTerms}
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
                {showError("agreeToTerms") && <p className="tr-field-error" style={{ marginTop: 8 }}>{errors.agreeToTerms}</p>}
              </div>

              <button type="submit" className="tr-submit" disabled={isLoading}>
                {isLoading ? "Creating account…" : "Create Tenant Account"}
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
            <p>Your tenant account is ready. Continue to sign in.</p>
            <button type="button" className="tr-modal-btn" onClick={() => router.push("/login")}>
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
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
