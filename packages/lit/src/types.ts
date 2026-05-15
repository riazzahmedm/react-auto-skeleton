import type { ScanOptions } from "@auto-skeleton/core";

export type AutoSkeletonOptions = ScanOptions & {
  animation?: "wave" | "pulse" | "none";
  debug?: boolean;
  /** Re-scan when layout/content mutates while not loading. */
  watch?: boolean;
  /** Debounce for watcher-driven re-scan. */
  watchDebounceMs?: number;
  /** Disable sessionStorage caching if needed. */
  cache?: boolean;
};
