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
    const root = document.createElement("div");
    const visible = document.createElement("div");
    const hidden = document.createElement("div");
    root.appendChild(visible);
    root.appendChild(hidden);
    mockRect(visible, { top: 0, left: 0, width: 100, height: 16 });
    mockRect(hidden, { top: 20, left: 0, width: 100, height: 16 });
    document.body.appendChild(root);
    mockRect(root, { top: 0, left: 0, width: 200, height: 200 });

    vi.spyOn(window, "getComputedStyle").mockImplementation((el: Element) => {
      if (el === hidden) {
        return {
          display: "none",
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
    expect(bones).toHaveLength(1);
  });
});
