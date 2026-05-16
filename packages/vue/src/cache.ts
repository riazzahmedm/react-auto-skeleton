import type { Bone } from "@auto-skeleton/core";

const memory = new Map<string, Bone[]>();

function key(id: string): string {
  const bp = typeof window !== "undefined" ? window.innerWidth : 0;
  return `${id}::${bp}`;
}

export function getCachedBones(id: string): Bone[] | null {
  const k = key(id);
  if (memory.has(k)) return memory.get(k) ?? null;

  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(`auto-skeleton:${k}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Bone[];
    if (!Array.isArray(parsed)) return null;
    memory.set(k, parsed);
    return parsed;
  } catch {
    return null;
  }
}

export function setCachedBones(id: string, bones: Bone[], enabled = true): void {
  if (!enabled) return;
  const k = key(id);
  memory.set(k, bones);
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(`auto-skeleton:${k}`, JSON.stringify(bones));
}

export function clearCachedBones(id: string): void {
  const k = key(id);
  memory.delete(k);
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(`auto-skeleton:${k}`);
}
