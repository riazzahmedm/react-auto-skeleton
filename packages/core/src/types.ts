export type Bone = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  kind: "rect" | "circle";
};

export type ScanOptions = {
  ignoreSelectors?: string[];
  minSize?: number;
};
