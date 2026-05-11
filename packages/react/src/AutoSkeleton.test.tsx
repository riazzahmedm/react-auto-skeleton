import React from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import * as core from "@auto-skeleton/core";
import { AutoSkeleton } from "./AutoSkeleton";

vi.mock("@auto-skeleton/core", () => ({
  scanBones: vi.fn(() => [{ x: 0, y: 0, width: 100, height: 20, radius: 4, kind: "rect" }])
}));

beforeEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.mocked(core.scanBones).mockReturnValue([{ x: 0, y: 0, width: 100, height: 20, radius: 4, kind: "rect" }]);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AutoSkeleton", () => {
  it("renders overlay when loading and cache is prefilled", () => {
    const key = `auto-skeleton:test::${window.innerWidth}`;
    sessionStorage.setItem(
      key,
      JSON.stringify([{ x: 0, y: 0, width: 100, height: 20, radius: 4, kind: "rect" }])
    );

    const { container } = render(
      <AutoSkeleton id="test" loading options={{ animation: "none" }}>
        <div>content</div>
      </AutoSkeleton>
    );

    expect(container.querySelector(".as-overlay")).not.toBeNull();
  });

  it("does not render overlay when loading is false", () => {
    render(
      <AutoSkeleton id="test2" loading={false}>
        <div>content</div>
      </AutoSkeleton>
    );

    expect(screen.getByText("content")).not.toBeNull();
    expect(document.querySelector(".as-overlay")).toBeNull();
  });

  it("re-scans on resize when watch is enabled", () => {
    render(
      <AutoSkeleton id="watch-true" loading={false} options={{ watch: true, watchDebounceMs: 10 }}>
        <div>content</div>
      </AutoSkeleton>
    );

    const scanBonesMock = vi.mocked(core.scanBones);
    const baseline = scanBonesMock.mock.calls.length;

    window.dispatchEvent(new Event("resize"));
    vi.advanceTimersByTime(12);

    expect(scanBonesMock.mock.calls.length).toBeGreaterThan(baseline);
  });

  it("does not re-scan on resize when watch is disabled", () => {
    render(
      <AutoSkeleton id="watch-false" loading={false} options={{ watch: false, watchDebounceMs: 10 }}>
        <div>content</div>
      </AutoSkeleton>
    );

    const scanBonesMock = vi.mocked(core.scanBones);
    const baseline = scanBonesMock.mock.calls.length;

    window.dispatchEvent(new Event("resize"));
    vi.advanceTimersByTime(12);

    expect(scanBonesMock.mock.calls.length).toBe(baseline);
  });
});
