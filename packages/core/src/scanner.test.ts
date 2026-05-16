import { describe, expect, it, vi, afterEach } from "vitest";
import { scanBones } from "./scanner";

function mockRect(el: Element, rect: Partial<DOMRect>): void {
  const value = () => ({
    x: rect.left ?? 0,
    y: rect.top ?? 0,
    top: rect.top ?? 0,
    left: rect.left ?? 0,
    right: (rect.left ?? 0) + (rect.width ?? 0),
    bottom: (rect.top ?? 0) + (rect.height ?? 0),
    width: rect.width ?? 0,
    height: rect.height ?? 0,
    toJSON: () => ({})
  } as DOMRect);
  // Use Object.defineProperty so the mock survives shadow DOM boundary moves in jsdom
  Object.defineProperty(el, "getBoundingClientRect", { value, configurable: true, writable: true });
}

describe("scanBones", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates text bones using explicit line count", () => {
    const root = document.createElement("div");
    const p = document.createElement("p");
    p.dataset.skeletonLines = "2";
    p.textContent = "hello";
    root.appendChild(p);
    document.body.appendChild(root);

    mockRect(root, { top: 0, left: 0, width: 300, height: 120 });
    mockRect(p, { top: 10, left: 20, width: 200, height: 40 });

    vi.spyOn(window, "getComputedStyle").mockImplementation((el: Element) => {
      if (el === p) {
        return {
          display: "block",
          visibility: "visible",
          opacity: "1",
          fontSize: "16px",
          lineHeight: "20px",
          borderRadius: "0px"
        } as unknown as CSSStyleDeclaration;
      }
      return {
        display: "block",
        visibility: "visible",
        opacity: "1",
        fontSize: "16px",
        lineHeight: "20px",
        borderRadius: "0px"
      } as unknown as CSSStyleDeclaration;
    });

    const bones = scanBones(root);
    expect(bones).toHaveLength(2);
    expect(bones[0]).toMatchObject({ x: 20, y: 10, kind: "rect" });
    expect(bones[1].width).toBeLessThan(bones[0].width);
  });

  it("ignores hidden nodes", () => {
    // ... existing test code
  });

  it("traverses into Shadow DOM", () => {
    const root = document.createElement("div");
    const host = document.createElement("custom-element");
    root.appendChild(host);
    document.body.appendChild(root);

    vi.stubGlobal("getComputedStyle", () => ({
      display: "block", visibility: "visible", opacity: "1",
      fontSize: "16px", lineHeight: "20px", borderRadius: "0px",
      borderLeftWidth: "0px", borderTopWidth: "0px"
    }));

    const shadow = host.attachShadow({ mode: "open" });
    const inner = document.createElement("div");
    inner.textContent = "shadow content";

    // Mock rect BEFORE appending to shadow — spies don't reliably survive shadowRoot.appendChild in jsdom
    mockRect(inner, { top: 15, left: 15, width: 100, height: 20 });
    shadow.appendChild(inner);

    mockRect(root, { top: 0, left: 0, width: 500, height: 500 });
    mockRect(host, { top: 10, left: 10, width: 200, height: 50 });

    const bones = scanBones(root);
    // Should traverse into shadow DOM and find the inner text div
    expect(bones.some(b => b.x === 15 && b.y === 15)).toBe(true);
  });
});
