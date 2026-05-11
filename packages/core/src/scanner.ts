import type { Bone, ScanOptions } from "./types";

const DEFAULT_MIN_SIZE = 8;
const DEFAULT_TEXT_LINE_HEIGHT_FACTOR = 0.72;
const DEFAULT_TEXT_RADIUS = 4;

type ForcedShape = Bone["kind"] | null;

function isVisible(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (Number(style.opacity) === 0) return false;
  return true;
}

function toRadius(style: CSSStyleDeclaration, width: number, height: number): number {
  const raw = parseFloat(style.borderRadius || "0");
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

function hasVisibleElementChildren(el: HTMLElement): boolean {
  for (const c of Array.from(el.children)) {
    if (isVisible(c)) return true;
  }
  return false;
}

function shouldUseTextMode(el: HTMLElement, forced: ForcedShape): boolean {
  return !forced && hasDirectTextNode(el);
}

function shouldSkipContainerBone(el: HTMLElement, forced: ForcedShape): boolean {
  if (forced) return false;
  if (isMarkedContainer(el)) return true;
  return hasVisibleElementChildren(el) && !hasDirectTextNode(el);
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
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  const bones: Bone[] = [];

  let current = walker.currentNode as Element | null;
  while (current) {
    if (isVisible(current) && !shouldIgnore(current as HTMLElement, options)) {
      const el = current as HTMLElement;
      const forced = forcedShape(el);

      if (shouldUseTextMode(el, forced)) {
        bones.push(...makeTextBones(el, rootRect, minSize));
      } else if (!shouldSkipContainerBone(el, forced)) {
        const rect = el.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);

        if (width >= minSize && height >= minSize) {
          const style = window.getComputedStyle(el);
          const radius = toRadius(style, width, height);

          bones.push({
            x: Math.round(rect.left - rootRect.left),
            y: Math.round(rect.top - rootRect.top),
            width,
            height,
            radius,
            kind: forced ?? autoKind(width, height, radius)
          });
        }
      }

    }

    current = walker.nextNode() as Element | null;
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
