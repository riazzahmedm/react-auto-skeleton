import { SkeletonOverlay } from "./SkeletonOverlay";
import type { AutoSkeletonProps } from "./types";
import { useAutoSkeleton } from "./useAutoSkeleton";

import "./styles.css";

export function AutoSkeleton({ id, loading, children, className, options }: AutoSkeletonProps) {
  const { rootRef, bones, animation, debug, shouldShow, rootClassName } = useAutoSkeleton({
    id,
    loading,
    options
  });

  const classes = [rootClassName, className, shouldShow ? "as-loading" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={classes}>
      {children}
      {shouldShow && bones ? <SkeletonOverlay bones={bones} animation={animation} debug={debug} /> : null}
    </div>
  );
}
