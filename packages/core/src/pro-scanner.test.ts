import { describe, expect, it, vi, beforeEach } from "vitest";
import { scanBones } from "./scanner";

function mockRect(el: Element, rect: Partial<DOMRect>): void {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    x: rect.left ?? 0, y: rect.top ?? 0, top: rect.top ?? 0, left: rect.left ?? 0,
    width: rect.width ?? 0, height: rect.height ?? 0,
    bottom: (rect.top ?? 0) + (rect.height ?? 0), right: (rect.left ?? 0) + (rect.width ?? 0),
    toJSON: () => ({})
  } as DOMRect);
}

function mockStyle(el: Element, styles: Partial<CSSStyleDeclaration>): void {
  vi.spyOn(window, "getComputedStyle").mockImplementation((target) => {
    if (target === el) return { 
        display: "block", visibility: "visible", opacity: "1", 
        borderLeftWidth: "0px", borderTopWidth: "0px", borderRadius: "0px",
        ...styles 
    } as any;
    return { display: "block", visibility: "visible", opacity: "1" } as any;
  });
}

describe("Pro Scanner Stress Tests", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("handles SVG elements correctly", () => {
    const root = document.createElement("div");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    svg.appendChild(circle);
    root.appendChild(svg);
    document.body.appendChild(root);

    mockRect(root, { top: 0, left: 0, width: 500, height: 500 });
    mockRect(svg, { top: 10, left: 10, width: 100, height: 100 });
    mockRect(circle, { top: 20, left: 20, width: 50, height: 50 });

    const bones = scanBones(root);
    expect(bones.some(b => b.x === 20 && b.y === 20)).toBe(true);
  });

  it("accounts for root border in bone positioning", () => {
    const root = document.createElement("div");
    const inner = document.createElement("div");
    root.appendChild(inner);
    document.body.appendChild(root);

    vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
        if (el === root) return { borderLeftWidth: "10px", borderTopWidth: "15px", display: "block", visibility: "visible", opacity: "1" } as any;
        return { display: "block", visibility: "visible", opacity: "1", borderLeftWidth: "0px", borderTopWidth: "0px" } as any;
    });

    mockRect(root, { top: 0, left: 0, width: 500, height: 500 });
    mockRect(inner, { top: 100, left: 100, width: 50, height: 50 });

    const bones = scanBones(root);
    // x = 100 (rect.left) - 0 (rootRect.left) - 10 (rootBorderLeft) = 90
    expect(bones[0].x).toBe(90);
    expect(bones[0].y).toBe(85);
  });

  it("correctly parses complex border-radius", () => {
    const root = document.createElement("div");
    const el = document.createElement("div");
    root.appendChild(el);
    document.body.appendChild(root);

    vi.spyOn(window, "getComputedStyle").mockImplementation((target) => {
        if (target === el) return { borderRadius: "50%", display: "block", visibility: "visible", opacity: "1" } as any;
        return { display: "block", visibility: "visible", opacity: "1", borderRadius: "0px" } as any;
    });

    mockRect(root, { top: 0, left: 0, width: 500, height: 500 });
    mockRect(el, { top: 0, left: 0, width: 100, height: 100 });

    const bones = scanBones(root);
    expect(bones[0].radius).toBe(50);
  });

  it("skips display: none elements but scans display: contents", () => {
    const root = document.createElement("div");
    const contents = document.createElement("div");
    const inner = document.createElement("div");
    
    contents.style.display = "contents";
    contents.appendChild(inner);
    root.appendChild(contents);
    document.body.appendChild(root);

    vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
        if (el === contents) return { display: "contents", visibility: "visible", opacity: "1" } as any;
        return { display: "block", visibility: "visible", opacity: "1" } as any;
    });

    mockRect(root, { top: 0, left: 0, width: 500, height: 500 });
    mockRect(contents, { top: 0, left: 0, width: 0, height: 0 }); // display: contents has no rect
    mockRect(inner, { top: 50, left: 50, width: 100, height: 100 });

    const bones = scanBones(root);
    expect(bones.length).toBe(1);
    expect(bones[0].x).toBe(50);
  });
});
