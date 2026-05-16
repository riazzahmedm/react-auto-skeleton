import type { ScanOptions } from "@auto-skeleton/core";

export type AutoSkeletonOptions = ScanOptions & {
  animation?: "wave" | "pulse" | "none";
  debug?: boolean;
  watch?: boolean;
  watchDebounceMs?: number;
  cache?: boolean;
};

export type AutoSkeletonProps = {
  id: string;
  loading: boolean;
  options?: AutoSkeletonOptions;
};
