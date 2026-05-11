import { useCallback, useEffect, useRef, useState } from "react";
import { scanBones, type Bone } from "@auto-skeleton/core";
import { clearCachedBones, getCachedBones, setCachedBones } from "./cache";
import type { AutoSkeletonOptions } from "./types";

export function useAutoSkeleton({
  id,
  loading,
  options
}: {
  id: string;
  loading: boolean;
  options?: AutoSkeletonOptions;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cacheEnabled = options?.cache ?? true;
  const [bones, setBones] = useState<Bone[] | null>(() => (cacheEnabled ? getCachedBones(id) : null));
  const scanTimerRef = useRef<number | null>(null);

  const runScan = useCallback(() => {
    if (!rootRef.current) return;
    const next = scanBones(rootRef.current, {
      ignoreSelectors: options?.ignoreSelectors,
      minSize: options?.minSize
    });
    setBones(next);
    setCachedBones(id, next, cacheEnabled);
  }, [id, options?.ignoreSelectors, options?.minSize, cacheEnabled]);

  useEffect(() => {
    if (!rootRef.current) return;
    if (loading) return;
    runScan();
  }, [loading, runScan]);

  useEffect(() => {
    if (!cacheEnabled) clearCachedBones(id);
  }, [id, cacheEnabled]);

  useEffect(() => {
    if (!rootRef.current) return;
    if (loading) return;
    if ((options?.watch ?? true) === false) return;

    const debounceMs = options?.watchDebounceMs ?? 120;
    const rootEl = rootRef.current;

    const schedule = () => {
      if (scanTimerRef.current !== null) window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = window.setTimeout(() => {
        runScan();
      }, debounceMs);
    };

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", schedule);
      return () => {
        if (scanTimerRef.current !== null) {
          window.clearTimeout(scanTimerRef.current);
          scanTimerRef.current = null;
        }
        window.removeEventListener("resize", schedule);
      };
    }

    const resizeObserver = new ResizeObserver(() => schedule());
    const mutationObserver = new MutationObserver(() => schedule());
    resizeObserver.observe(rootEl);
    mutationObserver.observe(rootEl, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    window.addEventListener("resize", schedule);

    return () => {
      if (scanTimerRef.current !== null) {
        window.clearTimeout(scanTimerRef.current);
        scanTimerRef.current = null;
      }
      window.removeEventListener("resize", schedule);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [loading, runScan, options?.watch, options?.watchDebounceMs]);

  const animation = options?.animation ?? "wave";
  const debug = options?.debug ?? false;
  const shouldShow = loading && !!bones && bones.length > 0;

  return {
    rootRef,
    bones,
    animation,
    debug,
    shouldShow
  };
}
