"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  useEffect(() => {
    const nav = document.getElementById("navbar");
    const heroBg = document.getElementById("heroBg");

    function updateNav() {
      if (!nav) return;
      if (window.scrollY > 60) {
        nav.classList.remove("at-top");
        nav.classList.add("scrolled");
      } else {
        nav.classList.add("at-top");
        nav.classList.remove("scrolled");
      }
    }

    function onScroll() {
      updateNav();
      if (!heroBg) return;
      const y = window.scrollY;
      heroBg.style.transform =
        "translateY(" + y * 0.35 + "px) scale(" + (1 + y * 0.0002) + ")";
    }

    updateNav();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap");

        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        :root {
          --bg: #FAF7F2;
          --bg-warm: #F0EBE1;
          --bg-dark: #1A1714;
          --bg-darker: #0F0D0B;
          --text: #2D2A26;
          --text-soft: #7A7267;
          --text-light: rgba(255,255,255,0.85);
          --text-muted: rgba(255,255,255,0.5);
          --accent: #C4956A;
          --accent-hover: #B07E55;
          --accent-light: rgba(196,149,106,0.12);
          --border: #DDD5C8;
          --white: #FFFFFF;
          --green: #6B8F5E;
          --orange: #C47A3A;
          --red: #A04040;
          --serif: "Playfair Display", Georgia, serif;
          --sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        body {
          font-family: var(--sans);
          color: var(--text);
          background: var(--bg);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .navbar {
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
          transition: background 0.5s, backdrop-filter 0.5s, border-color 0.5s;
        }

        .navbar.at-top {
          background: transparent;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .navbar.scrolled {
          background: rgba(26,23,20,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--serif);
          font-size: 1.8rem;
          color: var(--text-light);
        }

        .navbar-brand svg {
          width: 30px;
          height: 30px;
        }

        .navbar-links {
          display: flex;
          gap: 36px;
        }

        .navbar-links a {
          font-size: 1.19rem;
          font-weight: 400;
          color: var(--text-muted);
          letter-spacing: 0.02em;
          transition: color 0.25s;
        }

        .navbar-links a:hover {
          color: var(--text-light);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .navbar-actions .login {
          font-size: 1.3rem;
          color: var(--text-muted);
          transition: color 0.25s;
        }

        .navbar-actions .login:hover {
          color: var(--text-light);
        }

        .btn-nav {
          padding: 9px 22px;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--bg-dark);
          background: var(--accent);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: background 0.25s, transform 0.15s;
        }

        .btn-nav:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
        }

        .hero {
          position: relative;
          height: 105vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          will-change: transform;
          transition: transform 0.05s linear;
          overflow: hidden;
        }

        .hero-bg img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        .hero-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(10,8,6,0.48) 0%,
            rgba(10,8,6,0.30) 40%,
            rgba(10,8,6,0.62) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 24px;
          max-width: 820px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          margin-bottom: 32px;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--accent);
          background: rgba(196,149,106,0.12);
          border: 1px solid rgba(196,149,106,0.2);
          border-radius: 100px;
          letter-spacing: 0.04em;
        }

        .hero h1 {
          font-family: var(--serif);
          font-size: 4.6rem;
          line-height: 1.05;
          color: var(--white);
          margin-bottom: 24px;
          font-weight: 400;
        }

        .hero h1 em {
          font-style: italic;
          color: var(--accent);
        }

        .hero p {
          font-size: 1.08rem;
          line-height: 1.75;
          color: rgba(255,255,255,0.6);
          max-width: 520px;
          margin: 0 auto 44px;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .btn-hero {
          padding: 14px 32px;
          font-size: 0.88rem;
          font-weight: 500;
          font-family: var(--sans);
          color: var(--bg-dark);
          background: var(--accent);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: background 0.25s, transform 0.15s;
          display: inline-block;
        }

        .btn-hero:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
        }

        .btn-hero-outline {
          padding: 14px 32px;
          font-size: 0.88rem;
          font-weight: 500;
          font-family: var(--sans);
          color: var(--text-light);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
          display: inline-block;
        }

        .btn-hero-outline:hover {
          border-color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.04);
        }

        .hero-scroll {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.35);
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          animation: pulseDown 2s ease-in-out infinite;
        }

        @keyframes pulseDown {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateX(-50%) translateY(6px);
            opacity: 0.8;
          }
        }

        section {
          padding: 120px 56px;
        }

        .section-label {
          font-size: 0.72rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--accent);
          margin-bottom: 16px;
        }

        .section-title {
          font-family: var(--serif);
          font-size: 2.8rem;
          line-height: 1.15;
          color: var(--text);
          max-width: 620px;
          font-weight: 400;
        }

        .section-subtitle {
          font-size: 1.02rem;
          color: var(--text-soft);
          max-width: 520px;
          margin-top: 14px;
          line-height: 1.7;
        }

        .mockup-section {
          background: var(--bg);
          padding: 100px 56px 120px;
          text-align: center;
        }

        .mockup-section .section-label,
        .mockup-section .section-title {
          margin-left: auto;
          margin-right: auto;
        }

        .mockup-section .section-title {
          max-width: 700px;
          margin-bottom: 56px;
        }

        .hero-mockup {
          max-width: 920px;
          margin: 0 auto;
          background: var(--white);
          border-radius: 16px;
          border: 1px solid var(--border);
          box-shadow: 0 32px 80px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.03);
          overflow: hidden;
        }

        .mockup-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          background: var(--bg-warm);
          border-bottom: 1px solid var(--border);
        }

        .mockup-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .mockup-dot.r { background: #E8655A; }
        .mockup-dot.y { background: #E5B849; }
        .mockup-dot.g { background: #62B356; }

        .mockup-title {
          margin-left: 12px;
          font-size: 0.82rem;
          color: var(--text-soft);
        }

        .mockup-body {
          padding: 28px 32px 36px;
        }

        .mockup-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 22px;
        }

        .stat-card {
          padding: 20px;
          background: var(--bg);
          border-radius: 12px;
          border: 1px solid var(--border);
          text-align: left;
        }

        .stat-card .num {
          font-family: var(--serif);
          font-size: 1.8rem;
        }

        .stat-card .label {
          font-size: 0.75rem;
          color: var(--text-soft);
          margin-top: 2px;
        }

        .stat-card:nth-child(1) .num { color: var(--accent); }
        .stat-card:nth-child(2) .num { color: var(--green); }
        .stat-card:nth-child(3) .num { color: var(--orange); }
        .stat-card:nth-child(4) .num { color: var(--green); }

        .mockup-bottom {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 14px;
        }

        .mockup-activity,
        .mockup-actions {
          padding: 20px;
          border-radius: 12px;
          border: 1px solid var(--border);
          text-align: left;
        }

        .mockup-activity h4,
        .mockup-actions h4 {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }

        .activity-item:last-child {
          border: none;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .activity-dot.green { background: var(--green); }
        .activity-dot.orange { background: var(--orange); }
        .activity-dot.red { background: var(--red); }

        .activity-text {
          font-size: 0.82rem;
        }

        .activity-time {
          font-size: 0.72rem;
          color: var(--text-soft);
          margin-top: 2px;
        }

        .action-btn-mock {
          display: block;
          width: 100%;
          padding: 9px;
          margin-bottom: 7px;
          font-size: 0.82rem;
          color: var(--text);
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          text-align: center;
        }

        .features,
        .roles {
          background: var(--bg-warm);
        }

        .features-header,
        .how-header,
        .roles-header,
        .pricing-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .features-header .section-title,
        .roles-header .section-title {
          margin: 0 auto;
          max-width: 700px;
        }

        .features-header .section-subtitle,
        .how-header .section-subtitle,
        .pricing-header .section-subtitle {
          margin: 14px auto 0;
        }

        .features-grid,
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .feature-card {
          padding: 36px 30px;
          background: var(--bg);
          border-radius: 14px;
          border: 1px solid var(--border);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.06);
        }

        .feature-icon,
        .role-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-light);
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .feature-icon svg,
        .role-icon svg {
          width: 22px;
          height: 22px;
          color: var(--accent);
        }

        .feature-card h3,
        .step h3,
        .role-card h3,
        .price-card h3 {
          font-family: var(--serif);
          font-weight: 400;
        }

        .feature-card h3,
        .role-card h3 {
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .feature-card p,
        .step p {
          font-size: 0.88rem;
          color: var(--text-soft);
          line-height: 1.65;
        }

        .how-it-works,
        .pricing {
          background: var(--bg);
        }

        .how-header .section-title,
        .pricing-header .section-title {
          margin: 0 auto;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          max-width: 960px;
          margin: 0 auto;
          text-align: center;
        }

        .step-num {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent);
          color: var(--bg-dark);
          font-weight: 600;
          font-size: 1.05rem;
          border-radius: 50%;
          margin: 0 auto 20px;
        }

        .step h3 {
          font-size: 1.15rem;
          margin-bottom: 10px;
        }

        .role-card {
          padding: 40px 30px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--bg);
        }

        .role-card h3 {
          margin-bottom: 16px;
        }

        .role-card ul,
        .price-features {
          list-style: none;
        }

        .role-card li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.86rem;
          color: var(--text-soft);
          margin-bottom: 11px;
          line-height: 1.5;
        }

        .role-card li svg {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          color: var(--green);
          margin-top: 2px;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .price-card {
          padding: 40px 30px;
          background: var(--white);
          border-radius: 14px;
          border: 1px solid var(--border);
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .price-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.06);
        }

        .price-card.featured {
          border-color: var(--accent);
          box-shadow: 0 4px 24px rgba(196,149,106,0.15);
          position: relative;
        }

        .price-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 16px;
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--bg-dark);
          background: var(--accent);
          border-radius: 100px;
        }

        .price-card h3 {
          font-size: 1.15rem;
          margin-bottom: 8px;
        }

        .price-amount {
          font-family: var(--serif);
          font-size: 2.6rem;
          margin: 16px 0 4px;
        }

        .price-amount span {
          font-size: 1rem;
          font-family: var(--sans);
          color: var(--text-soft);
        }

        .price-desc {
          font-size: 0.82rem;
          color: var(--text-soft);
          margin-bottom: 28px;
        }

        .price-features {
          text-align: left;
          margin-bottom: 32px;
        }

        .price-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.84rem;
          padding: 7px 0;
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }

        .price-features li svg {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          color: var(--green);
        }

        .btn-warm,
        .btn-warm-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 12px 24px;
          font-size: 0.86rem;
          font-weight: 500;
          font-family: var(--sans);
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
        }

        .btn-warm {
          color: var(--bg-dark);
          background: var(--accent);
          border: none;
        }

        .btn-warm:hover {
          background: var(--accent-hover);
        }

        .btn-warm-outline {
          color: var(--text);
          background: transparent;
          border: 1px solid var(--border);
        }

        .btn-warm-outline:hover {
          border-color: var(--text-soft);
          background: rgba(0,0,0,0.02);
        }

        .cta {
          background: var(--bg-dark);
          text-align: center;
          padding: 120px 56px;
        }

        .cta h2 {
          font-family: var(--serif);
          font-size: 2.8rem;
          color: var(--white);
          font-weight: 400;
          margin-bottom: 16px;
        }

        .cta h2 em {
          font-style: italic;
          color: var(--accent);
        }

        .cta p {
          font-size: 1.02rem;
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }

        .footer {
          background: var(--bg-darker);
          padding: 48px 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .footer-brand {
          font-family: var(--serif);
          font-size: 1.05rem;
          color: rgba(255,255,255,0.7);
        }

        .footer-links {
          display: flex;
          gap: 28px;
        }

        .footer-links a {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: rgba(255,255,255,0.7);
        }

        .footer-copy {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.2);
        }

        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 900px) {
          .navbar {
            padding: 0 24px;
          }
          .navbar-links {
            display: none;
          }
          section {
            padding: 80px 24px;
          }
          .hero h1 {
            font-size: 2.8rem;
          }
          .features-grid,
          .steps,
          .roles-grid,
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin: 0 auto;
          }
          .mockup-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .mockup-bottom {
            grid-template-columns: 1fr;
          }
          .mockup-section {
            padding: 80px 24px;
          }
          .section-title {
            font-size: 2rem;
          }
          .footer {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
      `}</style>

      <nav className="navbar at-top" id="navbar">
        <Link href="/" className="navbar-brand">
          <LogoIcon />
          PropManager
        </Link>
        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#for-you">For You</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="navbar-actions">
          <Link href="/login" className="login">
            Log in
          </Link>
          <Link href="/register" className="btn-nav">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="hero" id="hero">
        <div className="hero-bg" id="heroBg">
          <img src="/hero-living-room.jpg" alt="" aria-hidden="true" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <ClockIcon />
            Save 10+ hours per week on property management
          </div>
          <h1>
            Property management
            <br />
            <em>without the headaches</em>
          </h1>
          <p>
            Automate rent reminders, manage maintenance tickets, and keep
            landlords and tenants in sync &mdash; all from one simple dashboard.
          </p>
          <div className="hero-buttons">
            <Link href="/register" className="btn-hero">
              Start Free &rarr;
            </Link>
            <a href="#features" className="btn-hero-outline">
              See Features
            </a>
          </div>
        </div>
        <div className="hero-scroll">
          <ScrollIcon />
          Scroll
        </div>
      </section>

      <div className="mockup-section">
        <div className="section-label" style={{ textAlign: "center" }}>
          The Dashboard
        </div>
        <h2
          className="section-title"
          style={{ textAlign: "center", margin: "0 auto 56px" }}
        >
          Everything at a glance,
          <br />
          nothing in the way
        </h2>
        <div className="hero-mockup fade-up">
          <div className="mockup-bar">
            <div className="mockup-dot r" />
            <div className="mockup-dot y" />
            <div className="mockup-dot g" />
            <span className="mockup-title">PropManager Dashboard</span>
          </div>
          <div className="mockup-body">
            <div className="mockup-stats">
              <div className="stat-card">
                <div className="num">12</div>
                <div className="label">Properties</div>
              </div>
              <div className="stat-card">
                <div className="num">48</div>
                <div className="label">Tenants</div>
              </div>
              <div className="stat-card">
                <div className="num">5</div>
                <div className="label">Open Tickets</div>
              </div>
              <div className="stat-card">
                <div className="num">94%</div>
                <div className="label">Rent Collected</div>
              </div>
            </div>
            <div className="mockup-bottom">
              <div className="mockup-activity">
                <h4>Recent Activity</h4>
                <ActivityItem color="green" text="Jane Doe paid rent for Unit 101" time="2 hours ago" />
                <ActivityItem color="orange" text="New ticket: Leaking faucet — Unit 204" time="5 hours ago" />
                <ActivityItem color="red" text="Lease expiring soon — Unit 305" time="1 day ago" />
              </div>
              <div className="mockup-actions">
                <h4>Quick Actions</h4>
                <div className="action-btn-mock">Add Property</div>
                <div className="action-btn-mock">New Tenant</div>
                <div className="action-btn-mock">View Tickets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="features" id="features">
        <div className="features-header">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need to manage your properties</h2>
          <p className="section-subtitle">
            From rent collection to maintenance tracking, PropManager handles
            the day-to-day so you can focus on growth.
          </p>
        </div>
        <div className="features-grid">
          <FeatureCard icon={<CardIcon />} title="Rent Collection">
            Automate rent reminders and track payments in real time. See
            who&apos;s paid, who&apos;s pending, and who&apos;s overdue at a glance.
          </FeatureCard>
          <FeatureCard icon={<WrenchIcon />} title="Maintenance Tracking">
            Tenants submit tickets directly. You prioritize, assign, and resolve
            &mdash; with a full history of every request.
          </FeatureCard>
          <FeatureCard icon={<UsersIcon />} title="Tenant Management">
            Full tenant directory with contact info, lease details, and payment
            history. Assign tenants to units in seconds.
          </FeatureCard>
          <FeatureCard icon={<ChartIcon />} title="Dashboard & Reports">
            Real-time occupancy rates, revenue tracking, and overdue payments.
            Export data to CSV anytime.
          </FeatureCard>
          <FeatureCard icon={<ShieldIcon />} title="Role-Based Access">
            Managers see everything. Landlords see their properties. Tenants see
            their unit. Everyone gets exactly what they need.
          </FeatureCard>
          <FeatureCard icon={<MessageIcon />} title="Announcements">
            Broadcast building-wide updates or target specific properties. Keep
            everyone informed with zero effort.
          </FeatureCard>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="how-header">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">Up and running in minutes</h2>
          <p className="section-subtitle">No complicated setup. No training required.</p>
        </div>
        <div className="steps">
          <Step number="1" title="Add Your Properties">
            Enter your properties and units. Set rent amounts, lease terms, and assign tenants.
          </Step>
          <Step number="2" title="Invite Your Team">
            Landlords and tenants create accounts. Each person sees only what&apos;s relevant to them.
          </Step>
          <Step number="3" title="Let It Run">
            Rent reminders go out automatically. Tenants submit tickets. You track everything from one dashboard.
          </Step>
        </div>
      </section>

      <section className="roles" id="for-you">
        <div className="roles-header">
          <div className="section-label">For You</div>
          <h2 className="section-title">Built for everyone in the building</h2>
        </div>
        <div className="roles-grid">
          <RoleCard
            icon={<ShieldIcon />}
            title="Property Managers"
            items={[
              "Full oversight of all properties",
              "User management & activity logs",
              "CSV exports & reporting",
              "Moderate tickets & approve actions",
            ]}
          />
          <RoleCard
            icon={<ChartIcon />}
            title="Landlords"
            items={[
              "Manage your own properties & units",
              "Track rent payments per tenant",
              "Handle maintenance requests",
              "Create & manage leases",
            ]}
          />
          <RoleCard
            icon={<PersonIcon />}
            title="Tenants"
            items={[
              "View your unit & lease details",
              "Submit maintenance tickets",
              "See rent due dates & history",
              "Get notified on updates",
            ]}
          />
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="pricing-header">
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-subtitle">Start for free. Upgrade as you grow.</p>
        </div>
        <div className="pricing-grid">
          <PriceCard title="Starter" price="Free" description="Up to 5 units" button="Get Started" outline items={["Rent tracking", "Maintenance tickets", "1 landlord account", "Email reminders"]} />
          <PriceCard title="Professional" price="$29" suffix="/mo" description="Up to 50 units" button="Start Free Trial" featured items={["Everything in Starter", "Unlimited landlords", "CSV exports & reports", "Priority support"]} />
          <PriceCard title="Enterprise" price="Custom" description="Unlimited units" button="Contact Sales" outline items={["Everything in Professional", "Custom integrations", "Dedicated account manager", "SLA guarantee"]} />
        </div>
      </section>

      <section className="cta">
        <h2>
          Ready to simplify your
          <br />
          <em>property management?</em>
        </h2>
        <p>
          Join thousands of landlords and property managers who&apos;ve ditched
          the spreadsheets.
        </p>
        <Link
          href="/register"
          className="btn-hero"
          style={{ fontSize: "0.95rem", padding: "15px 36px" }}
        >
          Get Started Free &rarr;
        </Link>
      </section>

      <footer className="footer">
        <div className="footer-brand">PropManager</div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <Link href="/login">Log in</Link>
        </div>
        <div className="footer-copy">&copy; 2026 PropManager. All rights reserved.</div>
      </footer>
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

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ScrollIcon() {
  return (
    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="14" height="22" rx="7" />
      <line x1="8" y1="6" x2="8" y2="10" />
    </svg>
  );
}

function ActivityItem({ color, text, time }: { color: string; text: string; time: string }) {
  return (
    <div className="activity-item">
      <div className={`activity-dot ${color}`} />
      <div>
        <div className="activity-text">{text}</div>
        <div className="activity-time">{time}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="feature-card fade-up">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="step fade-up">
      <div className="step-num">{number}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function RoleCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="role-card fade-up">
      <div className="role-icon">{icon}</div>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <CheckIcon /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriceCard({
  title,
  price,
  suffix,
  description,
  button,
  items,
  featured,
  outline,
}: {
  title: string;
  price: string;
  suffix?: string;
  description: string;
  button: string;
  items: string[];
  featured?: boolean;
  outline?: boolean;
}) {
  return (
    <div className={`price-card fade-up${featured ? " featured" : ""}`}>
      {featured ? <div className="price-badge">Most Popular</div> : null}
      <h3>{title}</h3>
      <div className="price-amount">
        {price}
        {suffix ? <span>{suffix}</span> : null}
      </div>
      <div className="price-desc">{description}</div>
      <ul className="price-features">
        {items.map((item) => (
          <li key={item}>
            <CheckIcon /> {item}
          </li>
        ))}
      </ul>
      <Link href="/register" className={outline ? "btn-warm-outline" : "btn-warm"}>
        {button}
      </Link>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
