# @auto-skeleton/react

[![npm](https://img.shields.io/npm/v/@auto-skeleton/react?label=npm&color=cb3837)](https://www.npmjs.com/package/@auto-skeleton/react)
[![downloads](https://img.shields.io/npm/dm/@auto-skeleton/react?color=blue)](https://www.npmjs.com/package/@auto-skeleton/react)
[![license](https://img.shields.io/github/license/riazzahmedm/react-auto-skeleton)](https://github.com/riazzahmedm/react-auto-skeleton/blob/main/LICENSE)

Zero-config skeleton loaders for React. Wrap any component — auto-skeleton scans the live DOM at runtime and generates a pixel-accurate skeleton. No CLI, no build step, no config files to maintain.

**[Live demo →](https://riazzahmedm.github.io/react-auto-skeleton/)** · **[Docs →](https://riazzahmedm.github.io/react-auto-skeleton/docs/getting-started/)**

---

## Installation

```bash
npm install @auto-skeleton/react
```

---

## Quick start

```tsx
import { AutoSkeleton } from "@auto-skeleton/react";
import "@auto-skeleton/react/styles.css";

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useUser(userId);

  return (
    <AutoSkeleton id="user-profile" loading={isLoading}>
      <div className="profile">
        <img src={data?.avatar} alt="avatar" />
        <h2>{data?.name}</h2>
        <p>{data?.bio}</p>
      </div>
    </AutoSkeleton>
  );
}
```

---

## How it works

1. On first render where `loading` is false, the DOM is scanned with a `TreeWalker`
2. Each element is measured with `getBoundingClientRect` and classified as rect, circle, or text
3. Bones are cached in memory and `sessionStorage` keyed by `id` + viewport width
4. When `loading` is true, a pixel-accurate overlay replaces the hidden content

---

## Props

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `id` | `string` | ✅ | Unique cache key |
| `loading` | `boolean` | ✅ | Controls skeleton visibility |
| `className` | `string` | | Added to root wrapper |
| `options` | `object` | | See options below |

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `animation` | `"wave" \| "pulse" \| "none"` | `"wave"` | Skeleton animation |
| `debug` | `boolean` | `false` | Outline detected bones |
| `watch` | `boolean` | `true` | Re-scan on layout changes |
| `watchDebounceMs` | `number` | `120` | Debounce for re-scans |
| `cache` | `boolean` | `true` | Enable sessionStorage cache |
| `minSize` | `number` | `8` | Min element size (px) to create a bone |
| `ignoreSelectors` | `string[]` | `[]` | CSS selectors to skip |

---

## Data attributes

| Attribute | Effect |
|---|---|
| `data-skeleton-ignore` | Skip this element |
| `data-skeleton-shape="circle"` | Force circular bone |
| `data-skeleton-shape="rect"` | Force rectangular bone |
| `data-skeleton-lines="N"` | Force N text-line bones |
| `data-skeleton-container` | Scan children individually |

---

## Theming

```css
:root {
  --as-base: #e4e4e7;
  --as-highlight: rgba(255, 255, 255, 0.9);
}

.dark {
  --as-base: #27272a;
  --as-highlight: rgba(255, 255, 255, 0.05);
}
```

---

## Next.js

```tsx
// app/layout.tsx
import "@auto-skeleton/react/styles.css";
```

```tsx
"use client";
import { AutoSkeleton } from "@auto-skeleton/react";
```

---

## useAutoSkeleton hook

For custom rendering:

```tsx
import { useAutoSkeleton } from "@auto-skeleton/react";

const { ref, bones, isScanning } = useAutoSkeleton({
  id: "my-component",
  loading,
  options: { animation: "pulse" },
});
```

Returns `ref` (attach to container), `bones` (array of detected bone objects), `isScanning` (true during scan).

---

## Ecosystem

| Package | Description |
|---|---|
| [`@auto-skeleton/react`](https://www.npmjs.com/package/@auto-skeleton/react) | React component and hook |
| [`@auto-skeleton/vue`](https://www.npmjs.com/package/@auto-skeleton/vue) | Vue 3 component and composable |
| [`@auto-skeleton/lit`](https://www.npmjs.com/package/@auto-skeleton/lit) | Lit / Web Component |
| [`@auto-skeleton/core`](https://www.npmjs.com/package/@auto-skeleton/core) | Framework-agnostic DOM scanner |

## Contributors

- [@riazzahmedm](https://github.com/riazzahmedm)
- [@kishore-s-n](https://github.com/kishore-s-n)
- [@chithumonk](https://github.com/chithumonk)

## License

MIT
