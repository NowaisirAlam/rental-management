"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }
    const session = await getSession();
    if (session?.user?.role === "TENANT") router.push("/tenant/dashboard");
    else if (session?.user?.role === "LANDLORD") router.push("/landlord/dashboard");
    else router.push("/");
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp {
          display: flex;
          min-height: 100vh;
          font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ── Left visual panel ── */
        .lp-visual {
          position: relative;
          width: 45%;
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px 36px 40px;
        }
        .lp-visual > svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .lp-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg,
            rgba(13,9,6,0.3) 0%,
            rgba(13,9,6,0.0) 40%,
            rgba(13,9,6,0.6) 100%);
        }
        .lp-logo {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.15rem;
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          line-height: 1;
        }
        .lp-logo svg { flex-shrink: 0; display: block; }
        .lp-visual-content {
          position: relative;
          z-index: 2;
        }
        .lp-tagline {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.9rem;
          font-weight: 400;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .lp-tagline em {
          font-style: italic;
          color: #C4956A;
        }
        .lp-sub {
          font-size: 0.83rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
        }

        /* ── Right form panel ── */
        .lp-form-panel {
          flex: 1;
          background: #FAF7F2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          position: relative;
        }
        .lp-form-inner {
          width: 100%;
          max-width: 460px;
        }

        .lp-back {
          position: absolute;
          top: 28px;
          right: 32px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.9rem;
          color: #7A7267;
          text-decoration: none;
          transition: color 0.2s;
        }
        .lp-back:hover { color: #2D2A26; }
        .lp-back svg { width: 15px; height: 15px; }

        .lp-form-header { margin-bottom: 36px; }
        .lp-form-header h1 {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 2.7rem;
          font-weight: 400;
          color: #2D2A26;
          margin-bottom: 10px;
        }
        .lp-form-header p {
          font-size: 1rem;
          color: #7A7267;
        }
        .lp-form-header p a {
          color: #C4956A;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }
        .lp-form-header p a:hover { color: #B07E55; }

        .lp-error {
          margin-bottom: 20px;
          padding: 13px 16px;
          border-radius: 8px;
          border: 1px solid rgba(160,64,64,0.3);
          background: rgba(160,64,64,0.07);
          font-size: 0.95rem;
          color: #A04040;
        }

        .lp-field { margin-bottom: 22px; }
        .lp-field label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #7A7267;
          margin-bottom: 10px;
        }
        .lp-field input[type="email"],
        .lp-field input[type="text"],
        .lp-field input[type="password"] {
          width: 100%;
          padding: 14px 18px;
          font-size: 1rem;
          font-family: inherit;
          color: #2D2A26;
          background: #F0EBE1;
          border: 1px solid #DDD5C8;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .lp-field input:focus {
          border-color: #C4956A;
          box-shadow: 0 0 0 3px rgba(196,149,106,0.15);
        }
        .lp-field input::placeholder { color: #b5ac9e; }

        .lp-pw-wrap { position: relative; }
        .lp-pw-wrap input { padding-right: 48px; }
        .lp-eye {
          position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #7A7267; display: flex; align-items: center; padding: 0;
          transition: color 0.2s;
        }
        .lp-eye:hover { color: #2D2A26; }
        .lp-eye svg { width: 18px; height: 18px; }

        .lp-field-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 9px;
        }
        .lp-field-footer a {
          font-size: 0.9rem;
          color: #7A7267;
          text-decoration: none;
          transition: color 0.2s;
        }
        .lp-field-footer a:hover { color: #C4956A; }

        .lp-options {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 4px 0 28px;
        }
        .lp-options input[type="checkbox"] {
          width: 17px; height: 17px;
          accent-color: #C4956A; cursor: pointer;
        }
        .lp-options label {
          font-size: 0.95rem; color: #7A7267; cursor: pointer;
        }

        .lp-btn-submit {
          width: 100%;
          padding: 16px;
          font-size: 0.88rem;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FAF7F2;
          background: #1A1714;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.25s, transform 0.15s;
        }
        .lp-btn-submit:hover:not(:disabled) { background: #2D2826; transform: translateY(-1px); }
        .lp-btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .lp-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 32px 0;
          color: #b5ac9e;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .lp-divider::before,
        .lp-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #DDD5C8;
        }

        .lp-demo-btn {
          display: block;
          width: 100%;
          padding: 14px;
          margin-bottom: 12px;
          font-size: 1rem;
          font-family: inherit;
          font-weight: 500;
          color: #2D2A26;
          background: transparent;
          border: 1px solid #DDD5C8;
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          text-align: center;
        }
        .lp-demo-btn:last-of-type { margin-bottom: 0; }
        .lp-demo-btn:hover {
          border-color: #C4956A;
          background: rgba(196,149,106,0.07);
        }

        @media (max-width: 720px) {
          .lp-visual { display: none; }
          .lp-form-panel { padding: 80px 28px 48px; }
        }
      `}</style>

      <div className="lp">

        {/* ── Left visual panel ── */}
        <div className="lp-visual">
          <svg viewBox="0 0 720 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="lsky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D0906"/>
                <stop offset="50%" stopColor="#231810"/>
                <stop offset="100%" stopColor="#3A2410"/>
              </linearGradient>
              <linearGradient id="lglass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5D4A0" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#C48840" stopOpacity="0.2"/>
              </linearGradient>
              <radialGradient id="lhalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF0CC" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#C4956A" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="720" height="900" fill="url(#lsky)"/>
            {/* Stars */}
            <circle cx="80"  cy="50"  r="1.2" fill="#FFF8E8" opacity="0.7"/>
            <circle cx="200" cy="30"  r="0.8" fill="#FFF8E8" opacity="0.5"/>
            <circle cx="380" cy="60"  r="1"   fill="#FFF8E8" opacity="0.6"/>
            <circle cx="550" cy="40"  r="1.2" fill="#FFF8E8" opacity="0.5"/>
            <circle cx="640" cy="80"  r="0.8" fill="#FFF8E8" opacity="0.7"/>
            <circle cx="140" cy="110" r="1"   fill="#FFF8E8" opacity="0.4"/>
            <circle cx="480" cy="90"  r="1"   fill="#FFF8E8" opacity="0.5"/>
            {/* Trees */}
            <ellipse cx="50"  cy="420" rx="45" ry="80" fill="#160E08" opacity="0.7"/>
            <ellipse cx="650" cy="410" rx="50" ry="90" fill="#160E08" opacity="0.7"/>
            {/* Building */}
            <rect x="80" y="200" width="560" height="480" fill="#1E140B"/>
            {/* Glass panels */}
            <rect x="100" y="215" width="120" height="440" fill="url(#lglass)" rx="1"/>
            <rect x="230" y="215" width="120" height="440" fill="url(#lglass)" rx="1" opacity="0.8"/>
            <rect x="360" y="215" width="120" height="440" fill="url(#lglass)" rx="1"/>
            <rect x="490" y="215" width="130" height="440" fill="url(#lglass)" rx="1" opacity="0.7"/>
            {/* Mullions */}
            <rect x="219" y="215" width="3" height="440" fill="#160E08"/>
            <rect x="349" y="215" width="3" height="440" fill="#160E08"/>
            <rect x="479" y="215" width="3" height="440" fill="#160E08"/>
            {/* Horizontal bands */}
            <rect x="80" y="350" width="560" height="8" fill="#160E08" opacity="0.8"/>
            <rect x="80" y="490" width="560" height="8" fill="#160E08" opacity="0.8"/>
            {/* Roof line */}
            <rect x="60" y="198" width="600" height="14" rx="2" fill="#160E08"/>
            {/* Entry */}
            <rect x="310" y="590" width="100" height="90" fill="#2A1C0E"/>
            <rect x="318" y="598" width="38"  height="78" fill="url(#lglass)" rx="1"/>
            <rect x="364" y="598" width="38"  height="78" fill="url(#lglass)" rx="1"/>
            {/* Lamp glow */}
            <ellipse cx="360" cy="588" rx="28" ry="28" fill="url(#lhalo)" opacity="0.8"/>
            <circle  cx="360" cy="585" r="5"           fill="#FFF0CC"/>
            {/* Ground */}
            <rect x="0" y="680" width="720" height="220" fill="#0D0906"/>
            <ellipse cx="360" cy="700" rx="320" ry="40" fill="#C4956A" opacity="0.05"/>
            {/* Interior glow */}
            <ellipse cx="360" cy="380" rx="180" ry="80" fill="#C4956A" opacity="0.06"/>
          </svg>

          <div className="lp-visual-overlay" />

          <Link href="/" className="lp-logo">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#C4956A"/>
              <path d="M8 24V10a2 2 0 012-2h12a2 2 0 012 2v14" stroke="#1A1714" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 24V16h8v8" stroke="#1A1714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="16" x2="16" y2="24" stroke="#1A1714" strokeWidth="2"/>
            </svg>
            PropManager
          </Link>

          <div className="lp-visual-content">
            <div className="lp-tagline">
              Your Stress,<br/>
              <em>beautifully managed</em>
            </div>
            <p className="lp-sub">A quieter way to handle properties, people, and payments.</p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="lp-form-panel">
          <Link href="/" className="lp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to home
          </Link>

          <div className="lp-form-inner">
            <div className="lp-form-header">
              <h1>Welcome back</h1>
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/register">Start free trial</Link>
              </p>
            </div>

            {error && <div className="lp-error">{error}</div>}

            <form onSubmit={handleSignIn}>
              <div className="lp-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="lp-field">
                <label htmlFor="password">Password</label>
                <div className="lp-pw-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="lp-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <div className="lp-field-footer">
                  <Link href="/forgot-password">Forgot password?</Link>
                </div>
              </div>

              <div className="lp-options">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Keep me signed in</label>
              </div>

              <button type="submit" className="lp-btn-submit" disabled={isLoading}>
                {isLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div className="lp-divider">or try a demo</div>

            <button
              type="button"
              className="lp-demo-btn"
              onClick={() => { setEmail("landlord@demo.com"); setPassword("password123"); }}
            >
              Login as Landlord
            </button>
            <button
              type="button"
              className="lp-demo-btn"
              onClick={() => { setEmail("tenant@demo.com"); setPassword("password123"); }}
            >
              Login as Tenant
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
