import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AutoSkeleton } from "@auto-skeleton/react";
import { App } from "./App";

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
  }
`;

const LIGHT = `
  :root {
    --bg: #f2f2f8;
    --bg-card: #ffffff;
    --bg-row: #f7f7fc;
    --border: rgba(0,0,0,0.08);
    --text: #0f172a;
    --text-muted: #64748b;
    --accent: #6d28d9;
    --accent-light: #6d28d9;
    --teal: #059669;
    --nav-bg: rgba(242,242,248,0.88);
    --as-base: #dcdce8;
    --as-highlight: rgba(255,255,255,0.9);
    --chip-bg: rgba(0,0,0,0.04);
    --chip-border: rgba(0,0,0,0.1);
    --input-bg: #fafafa;
    --btn-bg: #ffffff;
    --btn-border: rgba(0,0,0,0.12);
    --metric-bg: #ffffff;
  }
`;

const GLOBAL = `
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
    transition: background 0.3s ease, color 0.3s ease;
    -webkit-font-smoothing: antialiased;
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
  .fade-up-1 { animation-delay: 0.1s; }
  .fade-up-2 { animation-delay: 0.2s; }
  .fade-up-3 { animation-delay: 0.3s; }
  .fade-up-4 { animation-delay: 0.45s; }
  .fade-up-5 { animation-delay: 0.6s; }
  .hero-card-glow { animation: pulse-glow 3s ease-in-out infinite; }
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

const sectionLinks = [
  ["Profile", "#profile-header"],
  ["Metrics", "#metrics-strip"],
  ["Default", "#default-card"],
  ["Overrides", "#attribute-overrides"],
  ["Form", "#form-panel"],
  ["Activity", "#activity-list"],
  ["Media", "#media-card"]
] as const;

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
        maxWidth: 800, margin: "0 auto", padding: "0 20px",
        display: "flex", alignItems: "center", gap: 12, height: 52
      }}>
        {/* Logo */}
        <span style={{
          fontFamily: "'Clash Display', sans-serif", fontWeight: 800, fontSize: 15,
          color: "var(--text)", letterSpacing: "-0.02em", flexShrink: 0
        }}>
          auto<span style={{ color: "var(--accent)" }}>-skeleton</span>
        </span>

        {/* Section pills */}
        <nav style={{
          display: "flex", gap: 4, overflowX: "auto", flex: 1,
          scrollbarWidth: "none", msOverflowStyle: "none"
        }}>
          {sectionLinks.map(([label, href]) => (
            <a key={href} href={href} style={{
              fontSize: 12, fontWeight: 500, textDecoration: "none",
              color: "var(--text-muted)", border: "1px solid var(--border)",
              borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap",
              background: "var(--chip-bg)", transition: "color 0.2s, border-color 0.2s"
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "var(--text)"; (e.target as HTMLElement).style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "var(--text-muted)"; (e.target as HTMLElement).style.borderColor = "var(--border)"; }}
            >{label}</a>
          ))}
        </nav>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
          <button type="button" onClick={onToggleDebug} style={{
            fontSize: 11, fontWeight: 500, padding: "5px 10px", borderRadius: 6,
            border: "1px solid var(--border)", background: debug ? "rgba(124,58,237,0.15)" : "var(--chip-bg)",
            color: debug ? "var(--accent-light)" : "var(--text-muted)", cursor: "pointer",
            transition: "all 0.2s"
          }}>Debug</button>
          <a
            href="/react-auto-skeleton/docs/getting-started"
            style={{
              fontSize: 12, fontWeight: 500, textDecoration: "none",
              color: "var(--text-muted)", border: "1px solid var(--border)",
              borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap",
              background: "var(--chip-bg)", transition: "color 0.2s, border-color 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >Docs</a>
          <a
            href="https://github.com/riazzahmedm/react-auto-skeleton"
            target="_blank" rel="noreferrer"
            style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          ><GitHubIcon /></a>
          <button type="button" onClick={onToggle} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: 8,
            border: "1px solid var(--border)", background: "var(--chip-bg)",
            color: "var(--text-muted)", cursor: "pointer", transition: "all 0.2s"
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
      padding: "80px 20px",
      position: "relative", overflow: "hidden"
    }}>
      {/* Grid + glow background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: [
          "radial-gradient(ellipse 70% 50% at 50% 65%, rgba(124,58,237,0.12) 0%, transparent 70%)",
          "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)"
        ].join(","),
        backgroundSize: "100%, 28px 28px"
      }} />

      <div style={{ position: "relative", maxWidth: 640, width: "100%", textAlign: "center" }}>
        {/* Badge */}
        <div className="fade-up fade-up-1" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12, fontWeight: 500, letterSpacing: "0.04em",
          color: "var(--accent-light)", background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.2)", borderRadius: 999,
          padding: "5px 14px", marginBottom: 28
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-light)", display: "inline-block" }} />
          Now on npm · v0.0.3
        </div>

        {/* Headline */}
        <h1 className="fade-up fade-up-2" style={{
          fontFamily: "'Clash Display', sans-serif", fontWeight: 800,
          fontSize: "clamp(36px, 6vw, 62px)", lineHeight: 1.08,
          letterSpacing: "-0.03em", color: "var(--text)",
          margin: "0 0 20px"
        }}>
          Skeleton loaders,{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent-light), var(--teal))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            without the work.
          </span>
        </h1>

        {/* Subtext */}
        <p className="fade-up fade-up-3" style={{
          fontSize: "clamp(15px, 2vw, 17px)", color: "var(--text-muted)",
          lineHeight: 1.65, margin: "0 0 32px", maxWidth: 480, marginLeft: "auto", marginRight: "auto"
        }}>
          Wrap any component. auto-skeleton scans the real DOM and generates a pixel-accurate skeleton — no manual shapes, no config.
        </p>

        {/* Install command */}
        <div className="fade-up fade-up-3" style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "10px 18px", marginBottom: 32
        }}>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>$</span>
          <code style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            color: "var(--text)", letterSpacing: "-0.01em"
          }}>npm install @auto-skeleton/react</code>
        </div>

        {/* CTA buttons */}
        <div className="fade-up fade-up-4" style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 56, flexWrap: "wrap" }}>
          <a
            href="https://github.com/riazzahmedm/react-auto-skeleton"
            target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 22px", borderRadius: 10,
              background: "var(--accent)", color: "#fff",
              fontSize: 14, fontWeight: 500, textDecoration: "none",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <GitHubIcon /> View on GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@auto-skeleton/react"
            target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 22px", borderRadius: 10,
              background: "var(--btn-bg)", color: "var(--text)",
              border: "1px solid var(--btn-border)",
              fontSize: 14, fontWeight: 500, textDecoration: "none",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            npm package ↗
          </a>
        </div>

        {/* Cycling card */}
        <div className="fade-up fade-up-5" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{
            fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.06em",
            fontFamily: "'JetBrains Mono', monospace", marginBottom: 12,
            textTransform: "uppercase"
          }}>
            Live demo · auto-cycling
          </div>
          <HeroCyclingCard />
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.08em"
      }}>
        <span>SCROLL</span>
        <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
          <rect x="1" y="1" width="10" height="16" rx="5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="6" cy="5" r="1.5" fill="currentColor">
            <animate attributeName="cy" values="5;11;5" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
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

// ── Root ─────────────────────────────────────────────────────────────────────

function DemoRoot() {
  const [dark, setDark] = useState(true);
  const [debug, setDebug] = useState(false);
  const [showTop, setShowTop] = useState(false);

  // Inject theme CSS
  useEffect(() => {
    let el = document.getElementById("__as-theme") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "__as-theme";
      document.head.prepend(el);
    }
    el.textContent = (dark ? DARK : LIGHT) + GLOBAL;
  }, [dark]);

  // Scroll-to-top button
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

      {/* Demo area */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px 120px" }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
          color: "var(--accent-light)", textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 40, display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          Components
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <App debug={debug} DemoSection={DemoSection} />
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
