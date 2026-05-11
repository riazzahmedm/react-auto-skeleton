import type { CSSProperties, ReactNode } from "react";
import { AutoSkeleton } from "@auto-skeleton/react";

function DefaultCard() {
  return (
    <article
      data-skeleton-container
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 12
      }}
    >
      <img
        src="https://picsum.photos/80"
        alt="avatar"
        width={80}
        height={80}
        style={{ borderRadius: 999 }}
      />
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: "0 0 8px" }}>Auto Skeleton Title</h3>
        <p style={{ margin: 0, color: "#666" }}>Description content for layout capture.</p>
      </div>
    </article>
  );
}

function OverrideCard() {
  return (
    <article
      data-skeleton-container
      style={{
        display: "grid",
        gridTemplateColumns: "64px 1fr auto",
        gap: 12,
        alignItems: "center",
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 12
      }}
    >
      <img
        src="https://picsum.photos/64"
        alt="profile"
        width={64}
        height={64}
        data-skeleton-shape="circle"
        style={{ borderRadius: 999 }}
      />
      <div>
        <h4 style={{ margin: "0 0 6px" }} data-skeleton-lines="1">
          Forced Single-line Heading
        </h4>
        <p style={{ margin: 0, color: "#666" }} data-skeleton-lines="1">
          This paragraph demonstrates explicit line controls for the generated bones.
        </p>
      </div>
      <span
        data-skeleton-ignore
        style={{ fontSize: 12, color: "#0a7", border: "1px solid #0a7", padding: "3px 8px", borderRadius: 999 }}
      >
        LIVE
      </span>
    </article>
  );
}

function ProfileHeader() {
  return (
    <header
      data-skeleton-container
      style={{
        display: "grid",
        gridTemplateColumns: "96px 1fr auto",
        gap: 14,
        alignItems: "center",
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 12
      }}
    >
      <img
        src="https://picsum.photos/96"
        alt="team avatar"
        width={96}
        height={96}
        data-skeleton-shape="circle"
        style={{ borderRadius: 999 }}
      />
      <div>
        <h3 style={{ margin: "0 0 6px" }} data-skeleton-lines="1">
          Growth Team
        </h3>
        <p style={{ margin: "0 0 8px", color: "#666" }} data-skeleton-lines="1">
          Operational analytics, customer insights, and launch planning.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span style={chipStyle}>12 members</span>
          <span style={chipStyle}>4 active projects</span>
          <span style={chipStyle}>On track</span>
        </div>
      </div>
      <button type="button" style={buttonStyle}>
        Invite
      </button>
    </header>
  );
}

function MetricsStrip() {
  return (
    <section
      data-skeleton-container
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(120px, 1fr))",
        gap: 12
      }}
    >
      {[
        ["Revenue", "$184.2k"],
        ["Conversion", "4.8%"],
        ["NPS", "58"],
        ["Churn", "1.6%"]
      ].map(([label, value]) => (
        <article key={label} style={metricCardStyle}>
          <p style={{ margin: "0 0 8px", color: "#666", fontSize: 13 }} data-skeleton-lines="1">
            {label}
          </p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }} data-skeleton-lines="1">
            {value}
          </p>
        </article>
      ))}
    </section>
  );
}

function FormPanel() {
  return (
    <section data-skeleton-container style={panelStyle}>
      <h3 style={{ margin: "0 0 12px" }} data-skeleton-lines="1">
        Create Campaign
      </h3>
      <div style={{ display: "grid", gap: 10 }}>
        <label style={labelStyle}>
          Campaign name
          <input value="Q3 Launch Sprint" readOnly style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Budget
          <input value="$35,000" readOnly style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Channel
          <select value="Paid search" disabled style={inputStyle}>
            <option>Paid search</option>
          </select>
        </label>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button type="button" style={buttonStyle}>
          Save Draft
        </button>
        <button type="button" style={{ ...buttonStyle, background: "#0b0f1a", color: "#fff" }}>
          Launch
        </button>
      </div>
    </section>
  );
}

function ActivityTable() {
  return (
    <section data-skeleton-container style={panelStyle}>
      <h3 style={{ margin: "0 0 12px" }} data-skeleton-lines="1">
        Recent Activity
      </h3>
      <div style={{ display: "grid", gap: 8 }}>
        {[
          ["Olivia Reed", "Approved asset batch", "2m ago"],
          ["Marcus Lee", "Adjusted forecast", "14m ago"],
          ["Nina Patel", "Created audience segment", "1h ago"]
        ].map(([name, action, time]) => (
          <div
            key={name}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr auto",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              background: "#f7f7f8"
            }}
          >
            <img
              src={`https://picsum.photos/seed/${encodeURIComponent(name)}/40`}
              alt={name}
              width={40}
              height={40}
              data-skeleton-shape="circle"
              style={{ borderRadius: 999 }}
            />
            <div>
              <p style={{ margin: "0 0 4px" }} data-skeleton-lines="1">
                {name}
              </p>
              <p style={{ margin: 0, color: "#666" }} data-skeleton-lines="1">
                {action}
              </p>
            </div>
            <span style={{ fontSize: 12, color: "#666" }} data-skeleton-ignore>
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
    <article
      data-skeleton-container
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff"
      }}
    >
      <img
        src="https://picsum.photos/seed/product/920/280"
        alt="launch visual"
        width={920}
        height={280}
        style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
      />
      <div style={{ padding: 14 }}>
        <h3 style={{ margin: "0 0 8px" }} data-skeleton-lines="1">
          Product Spotlight Campaign
        </h3>
        <p style={{ margin: 0, color: "#666" }} data-skeleton-lines="2">
          A/B-tested landing page and ad creative set focused on first-time visitors from paid social.
        </p>
      </div>
    </article>
  );
}

const chipStyle: CSSProperties = {
  fontSize: 12,
  border: "1px solid #d4d4d8",
  borderRadius: 999,
  padding: "4px 8px",
  color: "#555"
};

const panelStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 14,
  background: "#fff"
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  color: "#555",
  fontSize: 13
};

const inputStyle: CSSProperties = {
  border: "1px solid #d4d4d8",
  borderRadius: 8,
  padding: "9px 10px",
  background: "#fff",
  color: "#222"
};

const metricCardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 14,
  background: "#fff"
};

const buttonStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer"
};

function DemoSection({
  id,
  title,
  description,
  children
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ display: "grid", gap: 8, scrollMarginTop: 122 }}>
      <div>
        <h2 style={{ margin: "0 0 4px", fontSize: 16 }}>{title}</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#5f6773" }}>{description}</p>
      </div>
      {children}
    </section>
  );
}

export function App({ loading, debug }: { loading: boolean; debug: boolean }) {
  return (
    <section style={{ display: "grid", gap: 16 }}>
      <DemoSection
        id="profile-header"
        title="Profile Header"
        description="Mixed avatar, text, chips, and action button with container override."
      >
        <AutoSkeleton id="demo-profile-header" loading={loading} options={{ debug }}>
          <ProfileHeader />
        </AutoSkeleton>
      </DemoSection>

      <DemoSection
        id="metrics-strip"
        title="Metrics Strip"
        description="Dashboard-style stat cards with dense numeric typography."
      >
        <AutoSkeleton id="demo-metrics-strip" loading={loading} options={{ debug }}>
          <MetricsStrip />
        </AutoSkeleton>
      </DemoSection>

      <DemoSection
        id="default-card"
        title="Default Card"
        description="Simple baseline case with automatic shape and line detection."
      >
        <AutoSkeleton id="demo-card-default" loading={loading} options={{ debug }}>
          <DefaultCard />
        </AutoSkeleton>
      </DemoSection>

      <DemoSection
        id="attribute-overrides"
        title="Attribute Overrides"
        description="Forcing circles, line counts, and ignored items via skeleton data attributes."
      >
        <AutoSkeleton id="demo-card-overrides" loading={loading} options={{ debug }}>
          <OverrideCard />
        </AutoSkeleton>
      </DemoSection>

      <DemoSection
        id="form-panel"
        title="Form Panel"
        description="Form labels and controls showing interactive layout skeleton behavior."
      >
        <AutoSkeleton id="demo-form-panel" loading={loading} options={{ debug }}>
          <FormPanel />
        </AutoSkeleton>
      </DemoSection>

      <DemoSection
        id="activity-list"
        title="Activity List"
        description="Table-like rows with avatars and per-row text content."
      >
        <AutoSkeleton id="demo-activity-table" loading={loading} options={{ debug }}>
          <ActivityTable />
        </AutoSkeleton>
      </DemoSection>

      <DemoSection
        id="media-card"
        title="Media Card"
        description="Large media block plus headline and multiline body content."
      >
        <AutoSkeleton id="demo-media-card" loading={loading} options={{ debug }}>
          <MediaCard />
        </AutoSkeleton>
      </DemoSection>
    </section>
  );
}
