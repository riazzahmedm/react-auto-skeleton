import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import * as core from "@auto-skeleton/core";
import "./index"; // registers auto-skeleton
import { AutoSkeleton } from "./AutoSkeleton";
import { clearAllCachedBones } from "./cache";

vi.mock("@auto-skeleton/core", () => ({
  scanBones: vi.fn(() => [{ x: 0, y: 0, width: 100, height: 20, radius: 4, kind: "rect" }])
}));

beforeEach(() => {
  document.body.innerHTML = "";
  clearAllCachedBones();
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.mocked(core.scanBones).mockReturnValue([{ x: 0, y: 0, width: 100, height: 20, radius: 4, kind: "rect" }]);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AutoSkeleton Lit", () => {
  it("renders overlay when loading and cache is prefilled", async () => {
    const key = `auto-skeleton:test::${window.innerWidth}`;
    sessionStorage.setItem(
      key,
      JSON.stringify([{ x: 0, y: 0, width: 100, height: 20, radius: 4, kind: "rect" }])
    );

    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.skeletonId = "test";
    el.loading = true;
    el.options = { animation: "none" };
    document.body.appendChild(el);

    await el.updateComplete;

    const overlay = el.shadowRoot?.querySelector(".as-overlay");
    expect(overlay).not.toBeNull();
    const bones = overlay?.querySelectorAll(".as-bone");
    expect(bones?.length).toBe(1);
  });

  it("does not render overlay when loading is false", async () => {
    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.skeletonId = "test2";
    el.loading = false;
    el.innerHTML = "<div>content</div>";
    document.body.appendChild(el);

    await el.updateComplete;

    const overlay = el.shadowRoot?.querySelector(".as-overlay");
    expect(overlay).toBeNull();
  });

  it("re-scans on resize when watch is enabled", async () => {
    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.skeletonId = "watch-true";
    el.loading = false;
    el.options = { watch: true, watchDebounceMs: 10 };
    document.body.appendChild(el);

    await el.updateComplete;

    const scanBonesMock = vi.mocked(core.scanBones);
    const baseline = scanBonesMock.mock.calls.length;

    window.dispatchEvent(new Event("resize"));
    vi.advanceTimersByTime(20);

    expect(scanBonesMock.mock.calls.length).toBeGreaterThan(baseline);
  });

  it("does not re-scan on resize when watch is disabled", async () => {
    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.skeletonId = "watch-false";
    el.loading = false;
    el.options = { watch: false, watchDebounceMs: 10 };
    document.body.appendChild(el);

    await el.updateComplete;

    const scanBonesMock = vi.mocked(core.scanBones);
    const baseline = scanBonesMock.mock.calls.length;

    window.dispatchEvent(new Event("resize"));
    vi.advanceTimersByTime(20);

    expect(scanBonesMock.mock.calls.length).toBe(baseline);
  });

  it("shows overlay when loading flips true after a scan has run", async () => {
    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.skeletonId = "transition-test";
    el.loading = false;
    document.body.appendChild(el);
    await el.updateComplete;

    // Override mock so the scan that fires when loading→false returns distinct bones
    vi.mocked(core.scanBones).mockReturnValue([{ x: 10, y: 10, width: 50, height: 50, radius: 0, kind: "rect" }]);

    // Trigger a scan explicitly (simulates loading going false again after data loads)
    el.loading = true;
    await el.updateComplete;
    el.loading = false;
    await el.updateComplete; // updated() fires runScan here

    // Now flip back to loading — bones exist, overlay should appear
    el.loading = true;
    await el.updateComplete;

    const overlay = el.shadowRoot?.querySelector(".as-overlay");
    expect(overlay).not.toBeNull();
  });

  it("clears cache when cache: false is set in options", async () => {
    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.skeletonId = "cache-disabled";
    el.loading = false;
    el.options = { cache: true };
    document.body.appendChild(el);
    await el.updateComplete;

    // Trigger a scan to fill cache
    window.dispatchEvent(new Event("resize"));
    vi.advanceTimersByTime(200);

    expect(sessionStorage.getItem(`auto-skeleton:cache-disabled::${window.innerWidth}`)).not.toBeNull();

    el.options = { cache: false };
    await el.updateComplete;

    expect(sessionStorage.getItem(`auto-skeleton:cache-disabled::${window.innerWidth}`)).toBeNull();
  });

  it("applies debug class when debug option is true", async () => {
    const key = `auto-skeleton:debug-test::${window.innerWidth}`;
    sessionStorage.setItem(
      key,
      JSON.stringify([{ x: 0, y: 0, width: 100, height: 20, radius: 4, kind: "rect" }])
    );

    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.skeletonId = "debug-test";
    el.loading = true;
    el.options = { debug: true };
    document.body.appendChild(el);

    await el.updateComplete;

    const bone = el.shadowRoot?.querySelector(".as-bone");
    expect(bone?.classList.contains("as-debug")).toBe(true);
  });

  it("re-scans on DOM mutation when watch is enabled", async () => {
    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.skeletonId = "mutation-test";
    el.loading = false;
    el.options = { watch: true, watchDebounceMs: 10 };
    el.innerHTML = "<div>Initial</div>";
    document.body.appendChild(el);

    await el.updateComplete;

    const scanBonesMock = vi.mocked(core.scanBones);
    const baseline = scanBonesMock.mock.calls.length;

    // Mutate the content
    const div = el.querySelector("div");
    if (div) div.textContent = "Changed";
    
    // MutationObserver is async, let it fire its callback to queue the debounced scan
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(20);

    expect(scanBonesMock.mock.calls.length).toBeGreaterThan(baseline);
  });

  it("applies as-loading class if initialized with loading=true and bones in cache", async () => {
    const key = `auto-skeleton:initial-loading::${window.innerWidth}`;
    sessionStorage.setItem(
      key,
      JSON.stringify([{ x: 0, y: 0, width: 100, height: 20, radius: 4, kind: "rect" }])
    );

    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.skeletonId = "initial-loading";
    el.loading = true;
    document.body.appendChild(el);

    await el.updateComplete;

    expect(el.classList.contains("as-loading")).toBe(true);
    const overlay = el.shadowRoot?.querySelector(".as-overlay");
    expect(overlay).not.toBeNull();
  });

  it("updates as-loading class when id changes while loading", async () => {
    // Cache for 'id1'
    sessionStorage.setItem(
      `auto-skeleton:id1::${window.innerWidth}`,
      JSON.stringify([{ x: 0, y: 0, width: 100, height: 20, radius: 4, kind: "rect" }])
    );

    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.skeletonId = "id1";
    el.loading = true;
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.classList.contains("as-loading")).toBe(true);

    // Change to 'id2' which has no cache
    el.skeletonId = "id2";
    await el.updateComplete;

    expect(el.classList.contains("as-loading")).toBe(false);
  });
});
