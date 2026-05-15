import { describe, expect, it, vi } from "vitest";
import { scanBones } from "./scanner";

function mockRect(el: Element, rect: Partial<DOMRect>): void {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
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
}

describe("scanBones", () => {
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

    const shadow = host.attachShadow({ mode: "open" });
    const inner = document.createElement("div");
    inner.textContent = "shadow content";
    shadow.appendChild(inner);

    mockRect(root, { top: 0, left: 0, width: 500, height: 500 });
    mockRect(host, { top: 10, left: 10, width: 200, height: 50 });
    mockRect(inner, { top: 15, left: 15, width: 100, height: 20 });

    vi.spyOn(window, "getComputedStyle").mockImplementation(() => {
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
    // Should find bones for both host and inner div (unless host is a container)
    // By default, host has children (in shadow dom), so it might be skipped if it has no direct text.
    // Let's verify we found the inner shadow content.
    expect(bones.some(b => b.x === 15 && b.y === 15)).toBe(true);
  });
});
