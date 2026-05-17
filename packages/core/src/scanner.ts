import type { Bone, ScanOptions } from "./types";

const DEFAULT_MIN_SIZE = 8;
const DEFAULT_TEXT_LINE_HEIGHT_FACTOR = 0.72;
const DEFAULT_TEXT_RADIUS = 4;

type ForcedShape = Bone["kind"] | null;

function isVisible(el: Element): boolean {
  if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) return false;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse") return false;
  // Use parseFloat so an empty string (e.g. SVG elements in jsdom) is treated as "not 0"
  if (style.opacity !== "" && Number(style.opacity) === 0) return false;
  
  // Check for zero-sized elements that aren't display: contents
  const rect = el.getBoundingClientRect();
  if (style.display !== "contents" && (rect.width === 0 || rect.height === 0)) return false;
  
  return true;
}

function toRadius(style: CSSStyleDeclaration, width: number, height: number): number {
  const radiusStr = style.borderRadius || "0";
  // Handle complex cases like "10px 20px" or "50%"
  const firstValue = radiusStr.split(" ")[0];
  
  if (firstValue.endsWith("%")) {
    const percent = parseFloat(firstValue);
    return Math.min((percent / 100) * Math.min(width, height), Math.min(width, height) / 2);
  }
  
  const raw = parseFloat(firstValue || "0");
  if (Number.isNaN(raw)) return 0;
  return Math.min(raw, Math.min(width, height) / 2);
}

function autoKind(width: number, height: number, radius: number): Bone["kind"] {
  const nearSquare = Math.abs(width - height) <= 2;
  const likelyCircle = nearSquare && radius >= Math.min(width, height) * 0.45;
  return likelyCircle ? "circle" : "rect";
}

function forcedShape(el: HTMLElement): ForcedShape {
  const shape = el.dataset.skeletonShape;
  if (shape === "circle" || shape === "rect") return shape;
  return null;
}

function explicitLineCount(el: HTMLElement): number | null {
  const raw = el.dataset.skeletonLines;
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function shouldIgnore(el: HTMLElement, options: ScanOptions): boolean {
  if (el.dataset.noSkeleton !== undefined) return true;
  if (el.dataset.skeletonIgnore !== undefined) return true;
  if (options.ignoreSelectors?.some((selector) => el.matches(selector))) return true;
  return false;
}

function isMarkedContainer(el: HTMLElement): boolean {
  return el.dataset.skeletonContainer !== undefined;
}

function hasDirectTextNode(el: HTMLElement): boolean {
  for (const n of Array.from(el.childNodes)) {
    if (n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim().length > 0) {
      return true;
    }
  }
  return false;
}

function hasVisibleElementChildren(el: Element): boolean {
  for (const c of Array.from(el.children)) {
    if (isVisible(c)) return true;
  }
  if (el.shadowRoot) {
    for (const c of Array.from(el.shadowRoot.children)) {
      if (isVisible(c)) return true;
    }
  }
  return false;
}

function shouldUseTextMode(el: Element, forced: ForcedShape): boolean {
  return el instanceof HTMLElement && !forced && hasDirectTextNode(el);
}

function shouldSkipContainerBone(el: Element, forced: ForcedShape): boolean {
  if (forced) return false;
  if (el instanceof HTMLElement && isMarkedContainer(el)) return true;
  return hasVisibleElementChildren(el) && !(el instanceof HTMLElement && hasDirectTextNode(el));
}

function makeTextBones(el: HTMLElement, rootRect: DOMRect, minSize: number): Bone[] {
  const rect = el.getBoundingClientRect();
  if (rect.width < minSize || rect.height < minSize) return [];

  const style = window.getComputedStyle(el);
  const fontSize = parseFloat(style.fontSize || "16") || 16;
  const lineHeightRaw = parseFloat(style.lineHeight || "0");
  const lineHeight = Number.isFinite(lineHeightRaw) && lineHeightRaw > 0 ? lineHeightRaw : fontSize * 1.4;
  const estimatedLines = Math.max(1, Math.round(rect.height / lineHeight));
  const lines = explicitLineCount(el) ?? estimatedLines;

  const bones: Bone[] = [];
  for (let i = 0; i < lines; i++) {
    const isLast = i === lines - 1;
    const y = rect.top - rootRect.top + i * lineHeight;
    const height = Math.max(minSize, Math.round(lineHeight * DEFAULT_TEXT_LINE_HEIGHT_FACTOR));
    const width = Math.round(rect.width * (isLast && lines > 1 ? 0.75 : 1));

    bones.push({
      x: Math.round(rect.left - rootRect.left),
      y: Math.round(y),
      width,
      height,
      radius: DEFAULT_TEXT_RADIUS,
      kind: "rect"
    });
  }

  return bones;
}

export function scanBones(root: HTMLElement, options: ScanOptions = {}): Bone[] {
  const minSize = options.minSize ?? DEFAULT_MIN_SIZE;
  const rootRect = root.getBoundingClientRect();
  const rootStyle = window.getComputedStyle(root);
  
  // Account for root border as the overlay is usually absolute inside the root
  const rootBorderLeft = parseFloat(rootStyle.borderLeftWidth) || 0;
  const rootBorderTop = parseFloat(rootStyle.borderTopWidth) || 0;

  const bones: Bone[] = [];

  function walk(current: Element) {
    if (!isVisible(current) || (current instanceof HTMLElement && shouldIgnore(current, options))) {
      return;
    }

    // Skip <slot> elements themselves - they are just portals
    if (current.tagName === "SLOT") {
      for (const child of Array.from(current.children)) {
        walk(child);
      }
      return;
    }

    const forced = current instanceof HTMLElement ? forcedShape(current) : null;

    if (shouldUseTextMode(current, forced)) {
      bones.push(...makeTextBones(current as HTMLElement, rootRect, minSize));
    } else {
      const isContainer = shouldSkipContainerBone(current, forced);
      
      if (!isContainer) {
        const rect = current.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);

        if (width >= minSize && height >= minSize) {
          const style = window.getComputedStyle(current);
          const radius = toRadius(style, width, height);

          bones.push({
            x: Math.round(rect.left - rootRect.left - rootBorderLeft),
            y: Math.round(rect.top - rootRect.top - rootBorderTop),
            width,
            height,
            radius,
            kind: forced ?? autoKind(width, height, radius)
          });
        }
      }

      // Traverse children in Light DOM
      for (const child of Array.from(current.children)) {
        walk(child);
      }

      // Traverse children in Shadow DOM if it exists
      if (current.shadowRoot) {
        for (const child of Array.from(current.shadowRoot.children)) {
          walk(child);
        }
      }
    }
  }

  // Start walking from light DOM children to avoid scanning the root itself as a bone
  for (const child of Array.from(root.children)) {
    walk(child);
  }

  // Also walk shadow DOM children of root (e.g. when root is a custom element / Lit component)
  if (root.shadowRoot) {
    for (const child of Array.from(root.shadowRoot.children)) {
      walk(child);
    }
  }

  return dedupeBones(bones);
}

function dedupeBones(bones: Bone[]): Bone[] {
  const seen = new Set<string>();
  const output: Bone[] = [];

  for (const b of bones) {
    const key = `${b.x}:${b.y}:${b.width}:${b.height}:${b.radius}:${b.kind}`;
    if (!seen.has(key)) {
      seen.add(key);
      output.push(b);
    }
  }

  return output;
}
