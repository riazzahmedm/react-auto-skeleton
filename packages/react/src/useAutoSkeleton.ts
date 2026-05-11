import { useEffect, useMemo, useRef, useState } from "react";
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

  function runScan(): void {
    if (!rootRef.current) return;
    const next = scanBones(rootRef.current, {
      ignoreSelectors: options?.ignoreSelectors,
      minSize: options?.minSize
    });
    setBones(next);
    setCachedBones(id, next, cacheEnabled);
  }

  useEffect(() => {
    if (!rootRef.current) return;
    if (loading) return;
    runScan();
  }, [id, loading, options?.ignoreSelectors, options?.minSize, cacheEnabled]);

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
  }, [id, loading, options?.watch, options?.watchDebounceMs, options?.ignoreSelectors, options?.minSize, cacheEnabled]);

  const animation = options?.animation ?? "wave";
  const debug = options?.debug ?? false;
  const shouldShow = loading && !!bones && bones.length > 0;

  const rootClassName = useMemo(() => "as-root", []);

  return {
    rootRef,
    bones,
    animation,
    debug,
    shouldShow,
    rootClassName
  };
}
