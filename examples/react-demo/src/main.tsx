import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AutoSkeleton } from "@auto-skeleton/react";
import { App } from "./App";
import "./LitDemo"; // registers as-demo-* custom elements + auto-skeleton web component

// ── Theme variables ──────────────────────────────────────────────────────────

const DARK = `
  :root {
    --bg: #07070f;
    --bg-card: #0f0f1a;
    --bg-row: #13131f;
    --border: rgba(255,255,255,0.07);
    --text: #e2e4f0;
    --text-muted: #4a5068;
    --accent: #7c3aed;
    --accent-light: #a78bfa;
    --teal: #06d6a0;
    --nav-bg: rgba(7,7,15,0.85);
    --as-base: #1a1a2e;
    --as-highlight: rgba(255,255,255,0.03);
    --chip-bg: rgba(255,255,255,0.05);
    --chip-border: rgba(255,255,255,0.08);
    --input-bg: rgba(255,255,255,0.04);
    --btn-bg: rgba(255,255,255,0.06);
    --btn-border: rgba(255,255,255,0.1);
    --metric-bg: #0f0f1a;
    --code-bg: #0d0d1a;
    --step-line: rgba(255,255,255,0.06);
  }
`;

const LIGHT = `
  :root {
    --bg: #f5f5fa;
    --bg-card: #ffffff;
    --bg-row: #f7f7fc;
    --border: rgba(0,0,0,0.08);
    --text: #0f172a;
    --text-muted: #64748b;
    --accent: #6d28d9;
    --accent-light: #6d28d9;
    --teal: #059669;
    --nav-bg: rgba(245,245,250,0.88);
    --as-base: #dcdce8;
    --as-highlight: rgba(255,255,255,0.9);
    --chip-bg: rgba(0,0,0,0.04);
    --chip-border: rgba(0,0,0,0.08);
    --input-bg: #fafafa;
    --btn-bg: #ffffff;
    --btn-border: rgba(0,0,0,0.12);
    --metric-bg: #ffffff;
    --code-bg: #f0f0f8;
    --step-line: rgba(0,0,0,0.07);
  }
`;

const GLOBAL = `
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
    transition: background 0.3s ease, color 0.3s ease;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 40px rgba(124,58,237,0.15), 0 0 0 1px rgba(124,58,237,0.2); }
    50%       { box-shadow: 0 0 60px rgba(124,58,237,0.25), 0 0 0 1px rgba(124,58,237,0.3); }
  }
  .fade-up { animation: fadeUp 0.6s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.15s; }
  .fade-up-3 { animation-delay: 0.25s; }
  .fade-up-4 { animation-delay: 0.35s; }
  .fade-up-5 { animation-delay: 0.5s; }
  .fade-up-6 { animation-delay: 0.65s; }
  .hero-card-glow { animation: pulse-glow 3s ease-in-out infinite; }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .as-nav-docs { display: none !important; }
    .as-nav-badge { display: none !important; }
    .as-stats { overflow-x: auto; flex-wrap: nowrap !important; justify-content: flex-start !important; padding-bottom: 4px; }
    .as-stats::-webkit-scrollbar { display: none; }
    .as-stats a { min-width: 80px; }
    .as-how-step { grid-template-columns: 48px 1fr !important; gap: 16px !important; }
    .as-step-body { grid-template-columns: 1fr !important; }
    .as-step-code { display: none !important; }
    .as-hiw-title h2 { font-size: clamp(18px, 5vw, 28px) !important; }
    .as-metrics-strip { grid-template-columns: repeat(2, 1fr) !important; }
    .as-profile-header { grid-template-columns: 60px 1fr !important; }
    .as-profile-header > button { display: none !important; }
    .as-override-card { grid-template-columns: 48px 1fr !important; }
    .as-override-card > span[data-skeleton-ignore] { display: none !important; }
  }
  @media (max-width: 480px) {
    .as-hero-install { flex-direction: column; align-items: flex-start !important; gap: 4px !important; }
  }
`;

// ── Hero cycling card ────────────────────────────────────────────────────────

function HeroCyclingCard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let t: number;
    function cycle(nextLoading: boolean, delay: number) {
      t = window.setTimeout(() => {
        setLoading(nextLoading);
        cycle(!nextLoading, nextLoading ? 1600 : 2400);
      }, delay);
    }
    cycle(false, 1000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className="hero-card-glow"
      style={{
        borderRadius: 17,
        background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(6,214,160,0.2))",
        padding: 1
      }}
    >
      <AutoSkeleton id="hero-card" loading={loading} options={{ animation: "wave", cache: false }}>
        <div
          data-skeleton-container
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            padding: "20px 24px",
            background: "var(--bg-card)",
            borderRadius: 16
          }}
        >
          <img
            src="https://picsum.photos/seed/heroskull/64/64"
            alt="avatar"
            width={64}
            height={64}
            data-skeleton-shape="circle"
            style={{ borderRadius: "50%", flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              data-skeleton-lines="1"
              style={{ fontWeight: 600, fontSize: 15, color: "var(--text)", marginBottom: 4 }}
            >
              Sarah Chen · Product Design
            </div>
            <div
              data-skeleton-lines="2"
              style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55 }}
            >
              Building collaborative tools at Meridian Labs. Previously Figma.
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <span
                style={{
                  fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999,
                  background: "rgba(124,58,237,0.12)", color: "var(--accent-light)",
                  border: "1px solid rgba(124,58,237,0.2)"
                }}
              >Pro</span>
              <span
                style={{
                  fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999,
                  background: "rgba(6,214,160,0.1)", color: "var(--teal)",
                  border: "1px solid rgba(6,214,160,0.2)"
                }}
              >Online</span>
            </div>
          </div>
          <button
            type="button"
            style={{
              padding: "9px 18px", borderRadius: 8, border: "none",
              background: "var(--accent)", color: "#fff", fontSize: 13,
              fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0
            }}
          >
            Follow
          </button>
        </div>
      </AutoSkeleton>
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ dark, onToggle, debug, onToggleDebug }: {
  dark: boolean;
  onToggle: () => void;
  debug: boolean;
  onToggleDebug: () => void;
}) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      background: "var(--nav-bg)",
      borderBottom: "1px solid var(--border)",
      transition: "background 0.3s ease"
    }}>
      <div style={{
        maxWidth: 860, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", gap: 10, height: 52
      }}>
        {/* Logo + version */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Clash Display', sans-serif", fontWeight: 800, fontSize: 15,
            color: "var(--text)", letterSpacing: "-0.02em"
          }}>
            auto<span style={{ color: "var(--accent)" }}>-skeleton</span>
          </span>
          <span className="as-nav-badge" style={{
            fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6,
            background: "rgba(124,58,237,0.12)", color: "var(--accent-light)",
            border: "1px solid rgba(124,58,237,0.18)", letterSpacing: "0.02em",
            fontFamily: "'JetBrains Mono', monospace"
          }}>v0.0.5</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Right controls */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button type="button" onClick={onToggleDebug} style={{
            fontSize: 11, fontWeight: 500, padding: "5px 11px", borderRadius: 7,
            border: "1px solid var(--border)",
            background: debug ? "rgba(124,58,237,0.15)" : "transparent",
            color: debug ? "var(--accent-light)" : "var(--text-muted)",
            cursor: "pointer", transition: "all 0.15s"
          }}>Debug</button>

          <a
            href="/react-auto-skeleton/docs/getting-started"
            className="as-nav-docs"
            style={{
              fontSize: 11, fontWeight: 500, padding: "5px 11px", borderRadius: 7,
              border: "1px solid transparent",
              color: "var(--text-muted)", textDecoration: "none",
              cursor: "pointer", transition: "color 0.15s",
              display: "inline-flex", alignItems: "center"
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          >Docs</a>

          <a
            href="https://github.com/riazzahmedm/react-auto-skeleton"
            target="_blank" rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: 7,
              color: "var(--text-muted)", transition: "color 0.15s", textDecoration: "none"
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          ><GitHubIcon /></a>

          <button type="button" onClick={onToggle} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: 7,
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--text-muted)", cursor: "pointer", transition: "all 0.15s"
          }}>{dark ? <SunIcon /> : <MoonIcon />}</button>
        </div>
      </div>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{
      minHeight: "calc(100vh - 52px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px 24px 60px",
      position: "relative", overflow: "hidden"
    }}>
      {/* Background grid + glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: [
          "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(124,58,237,0.1) 0%, transparent 70%)",
          "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)"
        ].join(","),
        backgroundSize: "100%, 28px 28px"
      }} />

      <div style={{ position: "relative", maxWidth: 620, width: "100%", textAlign: "center" }}>
        {/* Badge */}
        <div className="fade-up fade-up-1" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 500, letterSpacing: "0.03em",
          color: "var(--accent-light)", background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.2)", borderRadius: 999,
          padding: "4px 12px", marginBottom: 24
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--teal)", display: "inline-block" }} />
          Zero config · Runtime DOM scanning
        </div>

        {/* Headline */}
        <h1 className="fade-up fade-up-2" style={{
          fontFamily: "'Clash Display', sans-serif", fontWeight: 800,
          fontSize: "clamp(28px, 6.5vw, 66px)", lineHeight: 1.06,
          letterSpacing: "-0.035em", color: "var(--text)",
          margin: "0 0 18px"
        }}>
          Skeleton loaders,{" "}
          <br />
          <span style={{
            background: "linear-gradient(135deg, var(--accent-light) 0%, var(--teal) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            without the work.
          </span>
        </h1>

        {/* Subtext */}
        <p className="fade-up fade-up-3" style={{
          fontSize: "clamp(14px, 1.8vw, 16px)", color: "var(--text-muted)",
          lineHeight: 1.7, margin: "0 0 28px", maxWidth: 440,
          marginLeft: "auto", marginRight: "auto"
        }}>
          Wrap any React component. auto-skeleton scans the real DOM at runtime and generates a pixel-accurate skeleton — no manual shapes, no config files.
        </p>

        {/* Install command */}
        <div className="fade-up fade-up-3" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "10px 16px", marginBottom: 20
        }}>
          <span style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>$</span>
          <code style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            color: "var(--text)", letterSpacing: "-0.01em"
          }}>npm install @auto-skeleton/react</code>
        </div>

        {/* Framework chips */}
        <div className="fade-up fade-up-4" style={{
          display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap",
          marginBottom: 20
        }}>
          {[
            { label: "React", color: "#61dafb" },
            { label: "Next.js", color: "#e2e4f0" },
            { label: "Lit", color: "#324fff" },
            { label: "Vue 3", color: "#41b883" },
            { label: "React Native", color: "#a78bfa", soon: true }
          ].map(({ label, color, soon }) => (
            <span
              key={label}
              style={{
                fontSize: 11, fontWeight: 500, padding: "4px 11px", borderRadius: 999,
                border: `1px solid ${color}33`,
                background: `${color}11`,
                color: soon ? "var(--text-muted)" : color,
                letterSpacing: "0.01em",
                opacity: soon ? 0.55 : 1
              }}
            >
              {label}{soon ? " · soon" : ""}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="fade-up fade-up-4 as-stats" style={{
          display: "flex", justifyContent: "center", gap: 0, marginBottom: 44
        }}>
          {[
            { label: "npm", value: "@auto-skeleton/react", href: "https://www.npmjs.com/package/@auto-skeleton/react" },
            { label: "version", value: "v0.0.5", href: "https://www.npmjs.com/package/@auto-skeleton/react?activeTab=versions" },
            { label: "license", value: "MIT", href: "https://github.com/riazzahmedm/react-auto-skeleton/blob/main/LICENSE" }
          ].map((stat, i, arr) => (
            <a
              key={stat.label}
              href={stat.href}
              target="_blank" rel="noreferrer"
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "10px 20px",
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                borderLeft: i === 0 ? "1px solid var(--border)" : "none",
                borderRight: "1px solid var(--border)",
                borderRadius: i === 0 ? "8px 0 0 8px" : i === arr.length - 1 ? "0 8px 8px 0" : "0",
                background: "var(--bg-card)",
                textDecoration: "none",
                cursor: "pointer",
                transition: "background 0.15s",
                minWidth: 90
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--chip-bg)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-card)")}
            >
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 3 }}>{stat.label}</span>
              <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</span>
            </a>
          ))}
        </div>

        {/* Cycling card */}
        <div className="fade-up fade-up-5" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{
            fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em",
            fontFamily: "'JetBrains Mono', monospace", marginBottom: 10,
            textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--teal)", display: "inline-block", animation: "pulse-glow 2s ease infinite" }} />
            Live preview · cycling
          </div>
          <HeroCyclingCard />
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        color: "var(--text-muted)", fontSize: 10, letterSpacing: "0.1em", opacity: 0.6
      }}>
        <span>SCROLL</span>
        <svg width="11" height="17" viewBox="0 0 12 18" fill="none">
          <rect x="1" y="1" width="10" height="16" rx="5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="6" cy="5" r="1.5" fill="currentColor">
            <animate attributeName="cy" values="5;11;5" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </section>
  );
}

// ── How it works ─────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    num: "01",
    title: "Wrap",
    description: "Wrap any component with AutoSkeleton and pass a loading flag. That's the entire API.",
    code: `import { AutoSkeleton } from "@auto-skeleton/react";
import "@auto-skeleton/react/styles.css";

<AutoSkeleton id="profile" loading={isLoading}>
  <ProfileCard />
</AutoSkeleton>`
  },
  {
    num: "02",
    title: "Scan",
    description: "On first render, auto-skeleton walks the live DOM with TreeWalker, measures every element with getBoundingClientRect, and classifies each as rect, circle, or text.",
    code: `// Nothing to configure — scanning is automatic.
// Fine-tune individual elements with data attributes:

<img data-skeleton-shape="circle" />
<p  data-skeleton-lines="3" />
<div data-skeleton-ignore />`
  },
  {
    num: "03",
    title: "Display",
    description: "Bones are cached in memory and sessionStorage. When loading flips to true, a pixel-perfect overlay appears instantly — with wave, pulse, or no animation.",
    code: `// Options are optional — defaults work out of the box
<AutoSkeleton
  id="feed"
  loading={loading}
  options={{
    animation: "wave",  // "wave" | "pulse" | "none"
    cache: true,
  }}
/>`
  }
];

function HowItWorks() {
  return (
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 100px" }}>
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{
          display: "inline-block", fontSize: 11, fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--accent-light)", marginBottom: 12,
          fontFamily: "'JetBrains Mono', monospace"
        }}>How it works</div>
        <h2 style={{
          fontFamily: "'Clash Display', sans-serif", fontWeight: 700,
          fontSize: "clamp(24px, 3.5vw, 36px)", letterSpacing: "-0.025em",
          color: "var(--text)", margin: 0, lineHeight: 1.2
        }}>
          Three steps. No config.
        </h2>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {HOW_STEPS.map((step, i) => (
          <div key={step.num} className="as-how-step" style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr",
            gap: 32,
            padding: "36px 0",
            borderBottom: i < HOW_STEPS.length - 1 ? "1px solid var(--step-line)" : "none"
          }}>
            {/* Step number */}
            <div style={{
              fontFamily: "'Clash Display', sans-serif", fontWeight: 800,
              fontSize: 42, lineHeight: 1, letterSpacing: "-0.04em",
              color: "var(--border)", userSelect: "none",
              paddingTop: 4
            }}>{step.num}</div>

            {/* Content */}
            <div className="as-step-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
              <div>
                <h3 style={{
                  fontFamily: "'Clash Display', sans-serif", fontWeight: 700,
                  fontSize: 20, letterSpacing: "-0.02em",
                  color: "var(--text)", margin: "0 0 10px"
                }}>{step.title}</h3>
                <p style={{
                  fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7,
                  margin: 0, maxWidth: 320
                }}>{step.description}</p>
              </div>

              {/* Code block */}
              <div className="as-step-code" style={{
                background: "var(--code-bg)", border: "1px solid var(--border)",
                borderRadius: 10, overflow: "hidden"
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 14px",
                  borderBottom: "1px solid var(--border)"
                }}>
                  {["#ff5f57","#ffbd2e","#28c941"].map(c => (
                    <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />
                  ))}
                </div>
                <pre style={{
                  margin: 0, padding: "16px 18px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11.5, lineHeight: 1.7,
                  color: "var(--text)", overflowX: "auto",
                  whiteSpace: "pre"
                }}>{step.code}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Demo section wrapper ─────────────────────────────────────────────────────

function DemoSection({ id, title, description, children }: {
  id: string; title: string; description: string; children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ display: "grid", gap: 10, scrollMarginTop: 68 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: "var(--accent)", flexShrink: 0 }} />
        <div>
          <h2 style={{
            margin: "0 0 2px", fontSize: 14, fontWeight: 600,
            fontFamily: "'Clash Display', sans-serif", color: "var(--text)"
          }}>{title}</h2>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

// ── Lit Demo ────────────────────────────────────────────────────────────────
// The <auto-skeleton> web component and Lit custom elements are registered by
// importing ./LitDemo.ts. React treats them as opaque custom elements.
// We use a ref to set the `.loading` JS property since React 18 doesn't
// forward boolean props to custom elements as properties automatically.

function LitDemo({ debug }: { debug: boolean }) {
  const [loading, setLoading] = useState(false);
  const skeletonRef = useRef<HTMLElement>(null);

  // Sync the .loading property imperatively — custom element needs a JS boolean
  useEffect(() => {
    const el = skeletonRef.current as any;
    if (el) {
      el.loading = loading;
      el.options = {
        animation: "wave",
        cache: false,
        debug,
      };
    }
  }, [loading, debug]);

  const trigger = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2200);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Web component demo */}
      {/* @ts-expect-error — custom element, not in JSX intrinsic elements */}
      <auto-skeleton ref={skeletonRef} skeleton-id="lit-team-grid">
        {/* @ts-expect-error */}
        <as-demo-team-grid></as-demo-team-grid>
        {/* @ts-expect-error */}
      </auto-skeleton>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          onClick={trigger}
          disabled={loading}
          style={{
            fontSize: 12, fontWeight: 500, padding: "7px 16px",
            borderRadius: 7, border: "1px solid var(--border)",
            background: loading ? "rgba(124,58,237,0.2)" : "var(--btn-bg)",
            color: loading ? "var(--accent-light)" : "var(--text-muted)",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.15s"
          }}
        >{loading ? "Scanning…" : "▶ Preview skeleton"}</button>

        <span style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
          4 nested Lit components · shadow DOM traversed automatically
        </span>
      </div>

      {/* Code snippet */}
      <div style={{
        background: "var(--code-bg)", border: "1px solid var(--border)",
        borderRadius: 10, overflow: "hidden"
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          borderBottom: "1px solid var(--border)"
        }}>
          {["#ff5f57","#ffbd2e","#28c941"].map(c => (
            <span key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.7 }} />
          ))}
          <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 6, fontFamily: "'JetBrains Mono', monospace" }}>
            my-app.ts
          </span>
        </div>
        <pre style={{
          margin: 0, padding: "16px 18px",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
          lineHeight: 1.7, color: "var(--text)", overflowX: "auto"
        }}>{`import '@auto-skeleton/lit';

html\`
  <auto-skeleton skeleton-id="team" .loading=\${this.loading}>
    <team-grid></team-grid>  <!-- shadow DOM traversed ✓ -->
  </auto-skeleton>
\``}</pre>
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

function DemoRoot() {
  const [dark, setDark] = useState(true);
  const [debug, setDebug] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let el = document.getElementById("__as-theme") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "__as-theme";
      document.head.prepend(el);
    }
    el.textContent = (dark ? DARK : LIGHT) + GLOBAL;
  }, [dark]);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <Nav
        dark={dark} onToggle={() => setDark(d => !d)}
        debug={debug} onToggleDebug={() => setDebug(v => !v)}
      />
      <Hero />
      <HowItWorks />

      {/* Demo area */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 120px" }}>
        {/* Ecosystem section */}
        <div style={{ marginBottom: 72 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
            color: "var(--accent-light)", textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 28, display: "flex", alignItems: "center", gap: 10
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            Packages
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {[
              {
                pkg: "@auto-skeleton/react",
                label: "React",
                desc: "AutoSkeleton component + useAutoSkeleton hook",
                color: "#61dafb",
                href: "https://www.npmjs.com/package/@auto-skeleton/react",
                stable: true
              },
              {
                pkg: "@auto-skeleton/vue",
                label: "Vue 3",
                desc: "AutoSkeleton component + useAutoSkeleton composable",
                color: "#41b883",
                href: "https://www.npmjs.com/package/@auto-skeleton/vue",
                stable: true
              },
              {
                pkg: "@auto-skeleton/lit",
                label: "Lit / Web Components",
                desc: "<auto-skeleton> custom element with shadow DOM support",
                color: "#324fff",
                href: "https://www.npmjs.com/package/@auto-skeleton/lit",
                stable: true
              },
              {
                pkg: "@auto-skeleton/core",
                label: "Core (framework-agnostic)",
                desc: "DOM scanner — build your own adapter",
                color: "#a78bfa",
                href: "https://www.npmjs.com/package/@auto-skeleton/core",
                stable: true
              },
              {
                pkg: "@auto-skeleton/react-native",
                label: "React Native",
                desc: "Native skeleton support — coming soon",
                color: "#a78bfa",
                href: null,
                stable: false
              }
            ].map(({ pkg, label, desc, color, href, stable }) => (
              <a
                key={pkg}
                href={href ?? undefined}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  background: "var(--bg-card)",
                  border: `1px solid ${stable ? color + "22" : "var(--border)"}`,
                  borderRadius: 12,
                  padding: "16px 18px",
                  textDecoration: "none",
                  color: "inherit",
                  opacity: stable ? 1 : 0.5,
                  pointerEvents: stable ? "auto" : "none",
                  transition: "border-color 0.2s, transform 0.2s"
                }}
                onMouseEnter={e => {
                  if (!stable) return;
                  (e.currentTarget as HTMLElement).style.borderColor = color + "55";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = stable ? color + "22" : "var(--border)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: color, flexShrink: 0,
                    boxShadow: `0 0 6px ${color}66`
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>
                    {label}
                  </span>
                  {!stable && (
                    <span style={{
                      fontSize: 9, fontWeight: 600, letterSpacing: "0.06em",
                      color: "var(--text-muted)", background: "var(--chip-bg)",
                      border: "1px solid var(--border)", borderRadius: 4,
                      padding: "1px 5px", marginLeft: "auto"
                    }}>SOON</span>
                  )}
                </div>
                <code style={{
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                  color: color, display: "block", marginBottom: 6
                }}>{pkg}</code>
                <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</p>
              </a>
            ))}
          </div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
          color: "var(--accent-light)", textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 40, display: "flex", alignItems: "center", gap: 12
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          Component demos
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <App debug={debug} DemoSection={DemoSection} />

        {/* Lit / Web Components divider */}
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
          color: "var(--teal)", textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
          margin: "64px 0 40px", display: "flex", alignItems: "center", gap: 12
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          Lit &amp; Web Components
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <DemoSection
          id="lit"
          title="@auto-skeleton/lit"
          description="Native custom element — works with Lit, Vue, Svelte, or plain HTML. Shadow DOM traversed automatically."
        >
          <LitDemo debug={debug} />
        </DemoSection>
      </main>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed", right: 20, bottom: 20, zIndex: 40,
            width: 40, height: 40, borderRadius: 10,
            border: "1px solid var(--border)", background: "var(--bg-card)",
            color: "var(--text-muted)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, transition: "all 0.2s"
          }}
        >↑</button>
      )}
    </>
  );
}

const container = document.getElementById("root");
if (!container) throw new Error("Root container not found");

createRoot(container).render(
  <React.StrictMode>
    <DemoRoot />
  </React.StrictMode>
);
