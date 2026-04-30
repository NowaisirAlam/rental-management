import Link from "next/link";
import { ArrowRight, Building2, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";

const roles = [
  {
    key: "tenant",
    title: "Register as Tenant",
    description:
      "Create your tenant profile to pay rent and submit maintenance requests.",
    icon: UserRound,
  },
  {
    key: "landlord",
    title: "Register as Landlord",
    description:
      "Create your landlord profile to manage properties and tenants.",
    icon: Building2,
  },
] as const;

export default function RegisterRolePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rp {
          display: flex;
          min-height: 100vh;
          font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ── Left visual panel ── */
        .rp-visual {
          position: relative;
          width: 45%;
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px 36px 40px;
        }
        .rp-visual > svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .rp-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg,
            rgba(13,9,6,0.3) 0%,
            rgba(13,9,6,0.0) 40%,
            rgba(13,9,6,0.6) 100%);
        }
        .rp-logo {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.8rem;
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          line-height: 1;
        }
        .rp-logo svg {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          display: block;
        }
        .rp-visual-content { position: relative; z-index: 2; }
        .rp-tagline {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.9rem;
          font-weight: 400;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .rp-tagline em { font-style: italic; color: #C4956A; }
        .rp-sub {
          font-size: 0.83rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
        }

        /* ── Right form panel ── */
        .rp-form-panel {
          flex: 1;
          background: #FAF7F2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          position: relative;
        }
        .rp-form-inner {
          width: 100%;
          max-width: 840px;
        }

        .rp-back {
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
        .rp-back:hover { color: #2D2A26; }
        .rp-back svg { width: 15px; height: 15px; }

        .rp-form-header { margin-bottom: 36px; }
        .rp-form-header h1 {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 2.7rem;
          font-weight: 400;
          color: #2D2A26;
          margin-bottom: 10px;
        }
        .rp-form-header p {
          font-size: 1rem;
          color: #7A7267;
        }
        .rp-form-header p a {
          color: #C4956A;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }
        .rp-form-header p a:hover { color: #B07E55; }

        .rp-role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 0;
        }
        .rp-role-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 32px 28px 26px;
          min-height: 200px;
          border: 1px solid #DDD5C8;
          border-radius: 12px;
          background: #F0EBE1;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .rp-role-card:hover {
          border-color: #C4956A;
          background: #FFFDF9;
          box-shadow: 0 4px 16px rgba(196,149,106,0.12);
        }
        .rp-role-icon {
          color: #C4956A;
          margin-bottom: 20px;
        }
        .rp-role-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #2D2A26;
          margin-bottom: 8px;
        }
        .rp-role-desc {
          font-size: 0.88rem;
          color: #7A7267;
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .rp-role-continue {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #C4956A;
        }
        .rp-role-card:hover .rp-role-continue-arrow {
          transform: translateX(3px);
        }
        .rp-role-continue-arrow {
          transition: transform 0.2s;
        }

        .rp-footer {
          margin-top: 28px;
          font-size: 0.95rem;
          color: #7A7267;
        }
        .rp-footer a {
          color: #C4956A;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }
        .rp-footer a:hover { color: #B07E55; }

        @media (max-width: 720px) {
          .rp-visual { display: none; }
          .rp-form-panel { padding: 80px 28px 48px; }
        }
      `}</style>

      <div className="rp">

        {/* ── Left visual panel ── */}
        <div className="rp-visual">
          <svg viewBox="0 0 720 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D0906"/>
                <stop offset="50%" stopColor="#231810"/>
                <stop offset="100%" stopColor="#3A2410"/>
              </linearGradient>
              <linearGradient id="rglass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5D4A0" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#C48840" stopOpacity="0.2"/>
              </linearGradient>
              <radialGradient id="rhalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF0CC" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#C4956A" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="720" height="900" fill="url(#rsky)"/>
            <circle cx="80"  cy="50"  r="1.2" fill="#FFF8E8" opacity="0.7"/>
            <circle cx="200" cy="30"  r="0.8" fill="#FFF8E8" opacity="0.5"/>
            <circle cx="380" cy="60"  r="1"   fill="#FFF8E8" opacity="0.6"/>
            <circle cx="550" cy="40"  r="1.2" fill="#FFF8E8" opacity="0.5"/>
            <circle cx="640" cy="80"  r="0.8" fill="#FFF8E8" opacity="0.7"/>
            <circle cx="140" cy="110" r="1"   fill="#FFF8E8" opacity="0.4"/>
            <circle cx="480" cy="90"  r="1"   fill="#FFF8E8" opacity="0.5"/>
            <ellipse cx="50"  cy="420" rx="45" ry="80" fill="#160E08" opacity="0.7"/>
            <ellipse cx="650" cy="410" rx="50" ry="90" fill="#160E08" opacity="0.7"/>
            <rect x="80" y="200" width="560" height="480" fill="#1E140B"/>
            <rect x="100" y="215" width="120" height="440" fill="url(#rglass)" rx="1"/>
            <rect x="230" y="215" width="120" height="440" fill="url(#rglass)" rx="1" opacity="0.8"/>
            <rect x="360" y="215" width="120" height="440" fill="url(#rglass)" rx="1"/>
            <rect x="490" y="215" width="130" height="440" fill="url(#rglass)" rx="1" opacity="0.7"/>
            <rect x="219" y="215" width="3" height="440" fill="#160E08"/>
            <rect x="349" y="215" width="3" height="440" fill="#160E08"/>
            <rect x="479" y="215" width="3" height="440" fill="#160E08"/>
            <rect x="80" y="350" width="560" height="8" fill="#160E08" opacity="0.8"/>
            <rect x="80" y="490" width="560" height="8" fill="#160E08" opacity="0.8"/>
            <rect x="60" y="198" width="600" height="14" rx="2" fill="#160E08"/>
            <rect x="310" y="590" width="100" height="90" fill="#2A1C0E"/>
            <rect x="318" y="598" width="38"  height="78" fill="url(#rglass)" rx="1"/>
            <rect x="364" y="598" width="38"  height="78" fill="url(#rglass)" rx="1"/>
            <ellipse cx="360" cy="588" rx="28" ry="28" fill="url(#rhalo)" opacity="0.8"/>
            <circle  cx="360" cy="585" r="5"           fill="#FFF0CC"/>
            <rect x="0" y="680" width="720" height="220" fill="#0D0906"/>
            <ellipse cx="360" cy="700" rx="320" ry="40" fill="#C4956A" opacity="0.05"/>
            <ellipse cx="360" cy="380" rx="180" ry="80" fill="#C4956A" opacity="0.06"/>
          </svg>

          <div className="rp-visual-overlay" />

          <Link href="/" className="rp-logo">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#C4956A"/>
              <path d="M8 24V10a2 2 0 012-2h12a2 2 0 012 2v14" stroke="#1A1714" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 24V16h8v8" stroke="#1A1714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="16" x2="16" y2="24" stroke="#1A1714" strokeWidth="2"/>
            </svg>
            PropManager
          </Link>

          <div className="rp-visual-content">
            <div className="rp-tagline">
              Your place,<br/>
              <em>beautifully managed</em>
            </div>
            <p className="rp-sub">Join landlords and tenants who handle everything in one place.</p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="rp-form-panel">
          <Link href="/" className="rp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to home
          </Link>

          <div className="rp-form-inner">
            <div className="rp-form-header">
              <h1>Create account</h1>
              <p>
                Already registered?{" "}
                <Link href="/login">Sign in</Link>
              </p>
            </div>

            <div className="rp-role-grid">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <Link key={role.key} href={`/register/${role.key}`} className="rp-role-card">
                    <div className="rp-role-icon">
                      <Icon size={26} />
                    </div>
                    <div className="rp-role-title">{role.title}</div>
                    <div className="rp-role-desc">{role.description}</div>
                    <span className="rp-role-continue">
                      Continue
                      <ArrowRight size={15} className="rp-role-continue-arrow" />
                    </span>
                  </Link>
                );
              })}
            </div>

            <p className="rp-footer">
              By continuing you agree to our{" "}
              <Link href="/">Terms of Service</Link>.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
