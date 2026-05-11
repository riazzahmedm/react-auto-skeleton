import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const sectionLinks = [
  ["Profile", "#profile-header"],
  ["Metrics", "#metrics-strip"],
  ["Default", "#default-card"],
  ["Overrides", "#attribute-overrides"],
  ["Form", "#form-panel"],
  ["Activity", "#activity-list"],
  ["Media", "#media-card"]
] as const;

function DemoRoot() {
  const [loading, setLoading] = React.useState(true);
  const [debug, setDebug] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "40px auto",
        padding: 16,
        background: "#fcfcfd",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
      }}
    >
      <h1 style={{ margin: "0 0 10px" }}>Auto Skeleton MVP Demo</h1>
      <p style={{ margin: "0 0 14px", color: "#5f6773", fontSize: 14 }}>
        Scroll the page and keep controls accessible while checking each component behavior.
      </p>
      <div
        style={{
          position: "sticky",
          top: 12,
          zIndex: 30,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 18,
          padding: 10,
          border: "1px solid #ddd",
          borderRadius: 12,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(4px)"
        }}
      >
        <button style={{ padding: "8px 12px", cursor: "pointer" }} onClick={() => setLoading((v) => !v)} type="button">
          Toggle loading ({String(loading)})
        </button>
        <button style={{ padding: "8px 12px", cursor: "pointer" }} onClick={() => setDebug((v) => !v)} type="button">
          Toggle debug ({String(debug)})
        </button>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, width: "100%" }}>
          {sectionLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: 12,
                textDecoration: "none",
                color: "#334155",
                border: "1px solid #d4d4d8",
                borderRadius: 999,
                padding: "4px 8px",
                background: "#fff"
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
      <App loading={loading} debug={debug} />
      {showBackToTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 40,
            padding: "9px 12px",
            borderRadius: 999,
            border: "1px solid #cbd5e1",
            background: "#fff",
            color: "#0f172a",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
            cursor: "pointer"
          }}
        >
          Back to top
        </button>
      ) : null}
    </main>
  );
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

createRoot(container).render(
  <React.StrictMode>
    <DemoRoot />
  </React.StrictMode>
);
