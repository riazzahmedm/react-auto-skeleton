import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ComponentType, ReactNode } from "react";
import { AutoSkeleton } from "@auto-skeleton/react";

// ── Scroll-triggered skeleton ─────────────────────────────────────────────────

const SKELETON_MS = 1400;
const CONTENT_MS  = 2000;

function ScrollSkeleton({ id, children, debug }: { id: string; children: ReactNode; debug: boolean }) {
  const [loading, setLoading] = useState(false);
  const ref      = useRef<HTMLDivElement>(null);
  const loopRef  = useRef<number | null>(null);
  const active   = useRef(false);

  const startLoop = () => {
    if (active.current) return;
    active.current = true;

    const tick = (showSkeleton: boolean) => {
      setLoading(showSkeleton);
      loopRef.current = window.setTimeout(
        () => tick(!showSkeleton),
        showSkeleton ? SKELETON_MS : CONTENT_MS
      );
    };
    tick(true);
  };

  const stopLoop = () => {
    active.current = false;
    if (loopRef.current) window.clearTimeout(loopRef.current);
    setLoading(false);
  };

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    // Let content render first so the scanner can measure bones
    const scanTimer = window.setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) startLoop();
          else stopLoop();
        },
        { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, 250);

    return () => {
      window.clearTimeout(scanTimer);
      stopLoop();
    };
  }, []);

  return (
    <div ref={ref}>
      <AutoSkeleton id={id} loading={loading} options={{ debug }}>
        {children}
      </AutoSkeleton>
    </div>
  );
}

type DemoSectionProps = { id: string; title: string; description: string; children: ReactNode };

// ── Cards ─────────────────────────────────────────────────────────────────────

function DefaultCard() {
  return (
    <article data-skeleton-container style={cardStyle}>
      <img
        src="https://picsum.photos/80"
        alt="avatar"
        width={80} height={80}
        data-skeleton-shape="circle"
        style={{ borderRadius: "50%", flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <h3 data-skeleton-lines="1" style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
          Auto Skeleton Title
        </h3>
        <p data-skeleton-lines="2" style={{ margin: 0, color: "var(--text-muted)", fontSize: 13, lineHeight: 1.55 }}>
          Description content for layout capture. This text becomes skeleton bones.
        </p>
      </div>
    </article>
  );
}

function OverrideCard() {
  return (
    <article
      data-skeleton-container
      style={{ ...cardStyle, display: "grid", gridTemplateColumns: "64px 1fr auto" }}
    >
      <img
        src="https://picsum.photos/64"
        alt="profile"
        width={64} height={64}
        data-skeleton-shape="circle"
        style={{ borderRadius: "50%" }}
      />
      <div>
        <h4 data-skeleton-lines="1" style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
          Forced Single-line Heading
        </h4>
        <p data-skeleton-lines="1" style={{ margin: 0, color: "var(--text-muted)", fontSize: 13 }}>
          Explicit line count via data attribute.
        </p>
      </div>
      <span
        data-skeleton-ignore
        style={{
          fontSize: 11, fontWeight: 600, color: "var(--teal)",
          border: "1px solid rgba(6,214,160,0.3)", padding: "3px 10px",
          borderRadius: 999, height: "fit-content", background: "rgba(6,214,160,0.08)"
        }}
      >LIVE</span>
    </article>
  );
}

function ProfileHeader() {
  return (
    <header
      data-skeleton-container
      style={{ ...cardStyle, display: "grid", gridTemplateColumns: "80px 1fr auto" }}
    >
      <img
        src="https://picsum.photos/80/80?grayscale"
        alt="team avatar"
        width={80} height={80}
        data-skeleton-shape="circle"
        style={{ borderRadius: "50%" }}
      />
      <div>
        <h3 data-skeleton-lines="1" style={{ margin: "0 0 5px", fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Clash Display', sans-serif" }}>
          Growth Team
        </h3>
        <p data-skeleton-lines="1" style={{ margin: "0 0 10px", color: "var(--text-muted)", fontSize: 13 }}>
          Operational analytics, customer insights, and launch planning.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["12 members", "4 active projects", "On track"].map(t => (
            <span key={t} style={chipStyle}>{t}</span>
          ))}
        </div>
      </div>
      <button type="button" style={btnStyle}>Invite</button>
    </header>
  );
}

function MetricsStrip() {
  return (
    <section
      data-skeleton-container
      style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(100px, 1fr))", gap: 10 }}
    >
      {[["Revenue", "$184.2k"], ["Conversion", "4.8%"], ["NPS", "58"], ["Churn", "1.6%"]].map(([label, value]) => (
        <article key={label} style={{
          border: "1px solid var(--border)", borderRadius: 12,
          padding: "14px 16px", background: "var(--metric-bg)"
        }}>
          <p data-skeleton-lines="1" style={{ margin: "0 0 8px", color: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}>
            {label}
          </p>
          <p data-skeleton-lines="1" style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text)", fontFamily: "'Clash Display', sans-serif" }}>
            {value}
          </p>
        </article>
      ))}
    </section>
  );
}

function FormPanel() {
  return (
    <section data-skeleton-container style={{ padding: "16px 18px", border: "1px solid var(--border)", borderRadius: 14, background: "var(--bg-card)" }}>
      <h3 data-skeleton-lines="1" style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
        Create Campaign
      </h3>
      <div style={{ display: "grid", gap: 10 }}>
        {[
          ["Campaign name", "Q3 Launch Sprint"],
          ["Budget", "$35,000"]
        ].map(([label, val]) => (
          <label key={label} style={{ display: "grid", gap: 5, fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
            {label}
            <input value={val} readOnly style={inputStyle} />
          </label>
        ))}
        <label style={{ display: "grid", gap: 5, fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
          Channel
          <select disabled style={inputStyle}>
            <option>Paid search</option>
          </select>
        </label>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button type="button" style={btnStyle}>Save Draft</button>
        <button type="button" style={{ ...btnStyle, background: "var(--accent)", color: "#fff", border: "none" }}>
          Launch
        </button>
      </div>
    </section>
  );
}

function ActivityTable() {
  return (
    <section data-skeleton-container style={{ padding: "16px 18px", border: "1px solid var(--border)", borderRadius: 14, background: "var(--bg-card)" }}>
      <h3 data-skeleton-lines="1" style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
        Recent Activity
      </h3>
      <div style={{ display: "grid", gap: 6 }}>
        {[
          ["Olivia Reed", "Approved asset batch", "2m ago"],
          ["Marcus Lee", "Adjusted forecast", "14m ago"],
          ["Nina Patel", "Created audience segment", "1h ago"]
        ].map(([name, action, time]) => (
          <div key={name} style={{
            display: "grid", gridTemplateColumns: "36px 1fr auto",
            alignItems: "center", gap: 10, padding: "10px 12px",
            borderRadius: 10, background: "var(--bg-row)"
          }}>
            <img
              src={`https://picsum.photos/seed/${encodeURIComponent(name)}/36`}
              alt={name} width={36} height={36}
              data-skeleton-shape="circle"
              style={{ borderRadius: "50%" }}
            />
            <div>
              <p data-skeleton-lines="1" style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                {name}
              </p>
              <p data-skeleton-lines="1" style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                {action}
              </p>
            </div>
            <span data-skeleton-ignore style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
              {time}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MediaCard() {
  return (
    <article data-skeleton-container style={{
      border: "1px solid var(--border)", borderRadius: 14,
      overflow: "hidden", background: "var(--bg-card)"
    }}>
      <img
        src="https://picsum.photos/seed/product/920/280"
        alt="launch visual" width={920} height={280}
        style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
      />
      <div style={{ padding: "16px 18px" }}>
        <h3 data-skeleton-lines="1" style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
          Product Spotlight Campaign
        </h3>
        <p data-skeleton-lines="2" style={{ margin: 0, color: "var(--text-muted)", fontSize: 13, lineHeight: 1.55 }}>
          A/B-tested landing page and ad creative set focused on first-time visitors from paid social.
        </p>
      </div>
    </article>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const cardStyle: CSSProperties = {
  display: "flex", gap: 14, alignItems: "center", padding: "16px 18px",
  border: "1px solid var(--border)", borderRadius: 14, background: "var(--bg-card)"
};

const chipStyle: CSSProperties = {
  fontSize: 11, fontWeight: 500, border: "1px solid var(--chip-border)",
  borderRadius: 999, padding: "3px 9px", color: "var(--text-muted)",
  background: "var(--chip-bg)"
};

const btnStyle: CSSProperties = {
  padding: "8px 14px", borderRadius: 8, border: "1px solid var(--btn-border)",
  background: "var(--btn-bg)", color: "var(--text)", cursor: "pointer",
  fontSize: 13, fontWeight: 500
};

const inputStyle: CSSProperties = {
  border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px",
  background: "var(--input-bg)", color: "var(--text)", fontSize: 13, width: "100%"
};

// ── App ───────────────────────────────────────────────────────────────────────

export function App({
  debug,
  DemoSection
}: {
  debug: boolean;
  DemoSection: ComponentType<DemoSectionProps>;
}) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <DemoSection id="profile-header" title="Profile Header" description="Mixed avatar, text, chips, and action button with container override.">
        <ScrollSkeleton id="demo-profile-header" debug={debug}><ProfileHeader /></ScrollSkeleton>
      </DemoSection>

      <DemoSection id="metrics-strip" title="Metrics Strip" description="Dashboard-style stat cards with dense numeric typography.">
        <ScrollSkeleton id="demo-metrics-strip" debug={debug}><MetricsStrip /></ScrollSkeleton>
      </DemoSection>

      <DemoSection id="default-card" title="Default Card" description="Simple baseline case with automatic shape and line detection.">
        <ScrollSkeleton id="demo-card-default" debug={debug}><DefaultCard /></ScrollSkeleton>
      </DemoSection>

      <DemoSection id="attribute-overrides" title="Attribute Overrides" description="Forcing circles, line counts, and ignored items via skeleton data attributes.">
        <ScrollSkeleton id="demo-card-overrides" debug={debug}><OverrideCard /></ScrollSkeleton>
      </DemoSection>

      <DemoSection id="form-panel" title="Form Panel" description="Form labels and controls showing interactive layout skeleton behavior.">
        <ScrollSkeleton id="demo-form-panel" debug={debug}><FormPanel /></ScrollSkeleton>
      </DemoSection>

      <DemoSection id="activity-list" title="Activity List" description="Table-like rows with avatars and per-row text content.">
        <ScrollSkeleton id="demo-activity-table" debug={debug}><ActivityTable /></ScrollSkeleton>
      </DemoSection>

      <DemoSection id="media-card" title="Media Card" description="Large media block plus headline and multiline body content.">
        <ScrollSkeleton id="demo-media-card" debug={debug}><MediaCard /></ScrollSkeleton>
      </DemoSection>
    </div>
  );
}
