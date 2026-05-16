import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref, nextTick } from "vue";
import { useAutoSkeleton } from "./useAutoSkeleton";

// ── helpers ───────────────────────────────────────────────────────────────────

function mockRect(el: Element, rect: Partial<DOMRect>): void {
  Object.defineProperty(el, "getBoundingClientRect", {
    configurable: true,
    writable: true,
    value: () => ({
      x: rect.left ?? 0,
      y: rect.top ?? 0,
      top: rect.top ?? 0,
      left: rect.left ?? 0,
      right: (rect.left ?? 0) + (rect.width ?? 0),
      bottom: (rect.top ?? 0) + (rect.height ?? 0),
      width: rect.width ?? 0,
      height: rect.height ?? 0,
      toJSON: () => ({})
    } as DOMRect)
  });
}

// ── setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  document.body.innerHTML = "";
  vi.stubGlobal("getComputedStyle", () => ({
    display: "block",
    visibility: "visible",
    opacity: "1",
    fontSize: "16px",
    lineHeight: "20px",
    borderRadius: "0px",
    borderLeftWidth: "0px",
    borderTopWidth: "0px"
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  sessionStorage.clear();
});

// ── tests ─────────────────────────────────────────────────────────────────────

describe("useAutoSkeleton", () => {
  it("scans bones when loading flips from true to false", async () => {
    const root = document.createElement("div");
    const child = document.createElement("div");
    root.appendChild(child);
    document.body.appendChild(root);

    mockRect(root, { top: 0, left: 0, width: 300, height: 100 });
    mockRect(child, { top: 10, left: 10, width: 100, height: 40 });

    const id = ref("test-scan");
    const loading = ref(true);
    const options = ref(undefined);

    const { rootRef, bones } = useAutoSkeleton(id, loading, options);
    // Manually wire rootRef since we're not inside a component
    (rootRef as any).value = root;

    expect(bones.value).toBeNull();

    loading.value = false;
    await nextTick();

    expect(bones.value).not.toBeNull();
    expect(bones.value!.length).toBeGreaterThan(0);
    expect(bones.value![0]).toMatchObject({ x: 10, y: 10, width: 100, height: 40 });
  });

  it("shouldShow is true only when loading=true and bones exist", async () => {
    const root = document.createElement("div");
    const child = document.createElement("div");
    root.appendChild(child);
    document.body.appendChild(root);

    mockRect(root, { top: 0, left: 0, width: 300, height: 100 });
    mockRect(child, { top: 0, left: 0, width: 100, height: 40 });

    const id = ref("test-show");
    const loading = ref(true);
    const options = ref(undefined);

    const { rootRef, shouldShow } = useAutoSkeleton(id, loading, options);
    (rootRef as any).value = root;

    // loading=true but no bones yet → should not show
    expect(shouldShow.value).toBe(false);

    // scan by flipping loading
    loading.value = false;
    await nextTick();
    expect(shouldShow.value).toBe(false); // loading=false → don't show

    loading.value = true;
    await nextTick();
    expect(shouldShow.value).toBe(true); // loading=true + bones exist → show
  });

  it("caches bones in sessionStorage", async () => {
    const root = document.createElement("div");
    const child = document.createElement("div");
    root.appendChild(child);
    document.body.appendChild(root);

    mockRect(root, { top: 0, left: 0, width: 300, height: 100 });
    mockRect(child, { top: 5, left: 5, width: 80, height: 30 });

    const id = ref("test-cache");
    const loading = ref(true);
    const options = ref(undefined);

    const { rootRef } = useAutoSkeleton(id, loading, options);
    (rootRef as any).value = root;

    loading.value = false;
    await nextTick();

    const key = `auto-skeleton:test-cache::${window.innerWidth}`;
    const stored = sessionStorage.getItem(key);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0]).toMatchObject({ x: 5, y: 5 });
  });

  it("does not cache when cache option is false", async () => {
    const root = document.createElement("div");
    const child = document.createElement("div");
    root.appendChild(child);
    document.body.appendChild(root);

    mockRect(root, { top: 0, left: 0, width: 300, height: 100 });
    mockRect(child, { top: 0, left: 0, width: 100, height: 40 });

    const id = ref("test-no-cache");
    const loading = ref(true);
    const options = ref<any>({ cache: false });

    const { rootRef } = useAutoSkeleton(id, loading, options);
    (rootRef as any).value = root;

    loading.value = false;
    await nextTick();

    const key = `auto-skeleton:test-no-cache::${window.innerWidth}`;
    expect(sessionStorage.getItem(key)).toBeNull();
  });

  it("setupWatchers does not add a window resize listener when ResizeObserver is available", () => {
    const addSpy = vi.spyOn(window, "addEventListener");

    const root = document.createElement("div");
    document.body.appendChild(root);
    mockRect(root, { top: 0, left: 0, width: 300, height: 100 });

    const id = ref("test-resize");
    const loading = ref(false);
    const options = ref(undefined);

    const { rootRef } = useAutoSkeleton(id, loading, options);
    (rootRef as any).value = root;

    // Trigger watcher setup via loading flip
    loading.value = true;
    loading.value = false;

    const resizeCalls = addSpy.mock.calls.filter(([event]) => event === "resize");
    // ResizeObserver is available in jsdom — resize listener should NOT be added
    expect(resizeCalls.length).toBe(0);

    addSpy.mockRestore();
  });

  it("animation defaults to wave", () => {
    const { animation } = useAutoSkeleton(ref("x"), ref(false), ref(undefined));
    expect(animation.value).toBe("wave");
  });

  it("respects custom animation option", () => {
    const { animation } = useAutoSkeleton(ref("x"), ref(false), ref({ animation: "pulse" } as any));
    expect(animation.value).toBe("pulse");
  });
});
