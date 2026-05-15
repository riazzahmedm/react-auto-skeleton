import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "./index"; // registers auto-skeleton
import { AutoSkeleton } from "./AutoSkeleton";
import { clearAllCachedBones } from "./cache";

@customElement("inner-comp")
class InnerComp extends LitElement {
  render() {
    return html`
      <div id="inner-title" style="width: 100px; height: 20px;">Title</div>
      <div id="inner-avatar" data-skeleton-shape="circle" style="width: 50px; height: 50px;"></div>
    `;
  }
}

@customElement("outer-comp")
class OuterComp extends LitElement {
  render() {
    return html`
      <div id="outer-text">Some outer text</div>
      <inner-comp id="nested"></inner-comp>
    `;
  }
}

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

beforeEach(() => {
  document.body.innerHTML = "";
  clearAllCachedBones();
  vi.clearAllMocks();
  vi.useFakeTimers();

  // Mock computed styles globally for tests
  vi.spyOn(window, "getComputedStyle").mockImplementation((el: Element) => {
    return {
      display: "block",
      visibility: "visible",
      opacity: "1",
      fontSize: "16px",
      lineHeight: "20px",
      borderRadius: el.id === "inner-avatar" ? "50%" : "0px"
    } as unknown as CSSStyleDeclaration;
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AutoSkeleton Integration", () => {
  it("scans complex nested Shadow DOM structures accurately", async () => {
    const el = document.createElement("auto-skeleton") as AutoSkeleton;
    el.id = "complex-test";
    el.loading = false;
    el.innerHTML = `<outer-comp id="outer"></outer-comp>`;
    document.body.appendChild(el);

    await el.updateComplete;
    const outer = el.querySelector("#outer") as HTMLElement;
    await (outer as any).updateComplete;
    const inner = outer.shadowRoot?.querySelector("#nested") as HTMLElement;
    await (inner as any).updateComplete;

    // Mock positions
    mockRect(el, { top: 0, left: 0, width: 500, height: 500 });
    mockRect(outer, { top: 0, left: 0, width: 400, height: 400 });
    
    const outerText = outer.shadowRoot?.querySelector("#outer-text") as HTMLElement;
    mockRect(outerText, { top: 10, left: 10, width: 200, height: 20 });
    
    mockRect(inner, { top: 50, left: 10, width: 200, height: 100 });
    
    const innerTitle = inner.shadowRoot?.querySelector("#inner-title") as HTMLElement;
    const innerAvatar = inner.shadowRoot?.querySelector("#inner-avatar") as HTMLElement;
    mockRect(innerTitle, { top: 60, left: 20, width: 100, height: 20 });
    mockRect(innerAvatar, { top: 90, left: 20, width: 50, height: 50 });

    // Trigger scan
    (el as any).runScan();
    
    // Switch to loading
    el.loading = true;
    await el.updateComplete;

    const bones = (el as any).bones;
    
    // Check if we found the deep nested bones
    const hasOuterText = bones.some((b: any) => b.y === 10 && b.width === 200);
    const hasInnerTitle = bones.some((b: any) => b.y === 60 && b.width === 100);
    const hasInnerAvatar = bones.some((b: any) => b.y === 90 && b.kind === "circle");

    expect(hasOuterText).toBe(true);
    expect(hasInnerTitle).toBe(true);
    expect(hasInnerAvatar).toBe(true);
    
    // Total bones should be 3: outer-text, inner-title, inner-avatar
    // outer-comp and inner-comp should be skipped as containers
    expect(bones.length).toBe(3);
    
    const overlay = el.shadowRoot?.querySelector(".as-overlay");
    expect(overlay?.children.length).toBe(3);
  });
});
