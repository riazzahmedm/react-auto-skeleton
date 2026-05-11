import type { Bone } from "@auto-skeleton/core";

export function SkeletonOverlay({
  bones,
  animation,
  debug
}: {
  bones: Bone[];
  animation: "wave" | "pulse" | "none";
  debug: boolean;
}) {
  return (
    <div className="as-overlay" aria-hidden="true">
      {bones.map((b, i) => (
        <span
          key={`${b.x}-${b.y}-${i}`}
          className={`as-bone as-${animation}${debug ? " as-debug" : ""}`}
          style={{
            left: b.x,
            top: b.y,
            width: b.width,
            height: b.height,
            borderRadius: b.kind === "circle" ? "50%" : `${b.radius}px`
          }}
        />
      ))}
    </div>
  );
}
