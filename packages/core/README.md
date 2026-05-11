# @auto-skeleton/core

Framework-agnostic DOM scanner that powers [auto-skeleton](https://github.com/riazzahmedm/react-auto-skeleton). Scans a DOM element and returns a list of bones — the positions and shapes needed to render a skeleton loader.

If you're using React, install [`@auto-skeleton/react`](https://www.npmjs.com/package/@auto-skeleton/react) instead — it includes this package.

---

## Installation

```bash
npm install @auto-skeleton/core
```

---

## Usage

```ts
import { scanBones } from "@auto-skeleton/core";

const bones = scanBones(document.getElementById("root"), {
  minSize: 8,
  ignoreSelectors: [".no-skeleton", "[data-live]"]
});

// bones: Array<{ x, y, width, height, radius, kind: "rect" | "circle" }>
```

Each bone is positioned relative to the root element and ready to render as an absolutely-positioned overlay.

---

## API

### `scanBones(root, options?)`

Scans `root` and returns an array of `Bone` objects.

| Option | Type | Default | Description |
|---|---|---|---|
| `minSize` | `number` | `8` | Minimum element size in px to generate a bone for |
| `ignoreSelectors` | `string[]` | `[]` | CSS selectors for elements to skip |

### `Bone`

```ts
type Bone = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  kind: "rect" | "circle";
};
```

---

## Data attribute overrides

Elements inside the scanned tree can influence scanning behaviour:

| Attribute | Effect |
|---|---|
| `data-skeleton-ignore` | Skip this element |
| `data-skeleton-shape="circle\|rect"` | Force a shape |
| `data-skeleton-lines="N"` | Force N text lines |
| `data-skeleton-container` | Scan children instead of creating one large bone |

---

## Browser support

Latest 2 versions of Chrome, Edge, Firefox, and Safari. Requires `MutationObserver` and `ResizeObserver`.
