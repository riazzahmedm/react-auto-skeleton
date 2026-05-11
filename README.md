# auto-skeleton

Zero-config skeleton loaders for React. Wraps any component and auto-generates a pixel-accurate skeleton by scanning the real DOM — no manual shape definitions needed.

```tsx
<AutoSkeleton id="profile" loading={isLoading}>
  <ProfileCard />
</AutoSkeleton>
```

When `loading` is true, the real UI is replaced with a skeleton that mirrors its exact layout.

---

## Packages

| Package | Description |
|---|---|
| [`@auto-skeleton/react`](https://www.npmjs.com/package/@auto-skeleton/react) | React component and hook |
| [`@auto-skeleton/core`](https://www.npmjs.com/package/@auto-skeleton/core) | Framework-agnostic DOM scanner |

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

On first load, `auto-skeleton` scans the rendered DOM, extracts bone positions, and caches them. Every subsequent load shows the skeleton immediately — no layout shift.

---

## How it works

1. On the first non-loading render, the DOM inside `<AutoSkeleton>` is scanned using a `TreeWalker`
2. Each visible element is measured with `getBoundingClientRect` and classified as a rect, circle, or text block
3. Bone positions are stored in memory and `sessionStorage` keyed by `id` + viewport width
4. When `loading` switches back to `true`, an absolutely-positioned overlay renders the cached bones
5. The real content is hidden (`visibility: hidden`) so the layout is preserved during loading

---

## Props

```tsx
<AutoSkeleton
  id="unique-id"         // required — used as the cache key
  loading={boolean}      // required — controls when the skeleton shows
  className="..."        // optional — added to the root wrapper div
  options={...}          // optional — see options table below
>
  {children}
</AutoSkeleton>
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `animation` | `"wave" \| "pulse" \| "none"` | `"wave"` | Skeleton animation style |
| `debug` | `boolean` | `false` | Outline detected bones with dashed borders |
| `watch` | `boolean` | `true` | Re-scan when layout changes while not loading |
| `watchDebounceMs` | `number` | `120` | Debounce delay for watcher-triggered re-scans |
| `cache` | `boolean` | `true` | Cache bones in memory and `sessionStorage` |
| `minSize` | `number` | `8` | Minimum element size in px to generate a bone for |
| `ignoreSelectors` | `string[]` | `[]` | CSS selectors for elements to skip during scan |

---

## Data attribute overrides

Fine-tune how individual elements are scanned without changing render logic:

| Attribute | Effect |
|---|---|
| `data-skeleton-ignore` | Skip this element entirely |
| `data-skeleton-shape="circle"` | Force a circular bone |
| `data-skeleton-shape="rect"` | Force a rectangular bone |
| `data-skeleton-lines="N"` | Force N text lines instead of auto-detecting |
| `data-skeleton-container` | Treat as a container — scan children instead of creating one large bone |

```tsx
<AutoSkeleton id="profile" loading={loading}>
  <article data-skeleton-container>
    <img src={avatar} data-skeleton-shape="circle" />
    <h2 data-skeleton-lines="1">{name}</h2>
    <p data-skeleton-lines="3">{bio}</p>
    <span data-skeleton-ignore>Live</span>
  </article>
</AutoSkeleton>
```

---

## Theming

Override CSS variables to match your design system:

```css
:root {
  --as-base: #e4e4e7;          /* bone background */
  --as-highlight: rgba(255, 255, 255, 0.9);  /* wave shimmer */
}
```

---

## Accessibility

- The skeleton overlay is `aria-hidden="true"` — invisible to screen readers
- Animations are automatically disabled when `prefers-reduced-motion: reduce` is set

---

## Debug mode

Set `options.debug = true` to visualize detected bones with dashed red outlines while tuning your layout:

```tsx
<AutoSkeleton id="card" loading={loading} options={{ debug: true }}>
  <Card />
</AutoSkeleton>
```

---

## Using the core scanner directly

For non-React environments, `@auto-skeleton/core` exposes the scanner:

```ts
import { scanBones } from "@auto-skeleton/core";

const bones = scanBones(document.getElementById("root"), {
  minSize: 8,
  ignoreSelectors: [".no-skeleton"]
});
// bones: Array<{ x, y, width, height, radius, kind }>
```

---

## Browser support

Latest 2 versions of Chrome, Edge, Firefox, and Safari (macOS + iOS).

Requires `MutationObserver`, `ResizeObserver`, and `sessionStorage`. Falls back to `window resize` events if `ResizeObserver` is unavailable.

---

## Contributing

```bash
git clone https://github.com/riazzahmedm/react-auto-skeleton
cd react-auto-skeleton
npm install
npm run demo:dev     # start the demo
npm test             # run tests
npm run build        # build all packages
npm run perf:scan    # run performance benchmark (budget: <80ms avg)
```

To release:

```bash
npm run changeset          # describe your changes
npm run version-packages   # bump versions + generate changelogs
npm run release            # publish to npm
```
