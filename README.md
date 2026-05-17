# auto-skeleton

[![npm](https://img.shields.io/npm/v/@auto-skeleton/react?label=npm&color=cb3837)](https://www.npmjs.com/package/@auto-skeleton/react)
[![downloads](https://img.shields.io/npm/dm/@auto-skeleton/react?color=blue)](https://www.npmjs.com/package/@auto-skeleton/react)
[![stars](https://img.shields.io/github/stars/riazzahmedm/react-auto-skeleton?style=flat&color=yellow)](https://github.com/riazzahmedm/react-auto-skeleton/stargazers)
[![license](https://img.shields.io/github/license/riazzahmedm/react-auto-skeleton)](https://github.com/riazzahmedm/react-auto-skeleton/blob/main/LICENSE)
[![npm vue](https://img.shields.io/npm/v/@auto-skeleton/vue?label=vue&color=41b883)](https://www.npmjs.com/package/@auto-skeleton/vue)

Zero-config skeleton loaders for React. Wrap any component — auto-skeleton scans the live DOM at runtime and generates a pixel-accurate skeleton. No CLI, no build step, no config files to maintain.

**[Live demo →](https://riazzahmedm.github.io/react-auto-skeleton/)** · **[Docs →](https://riazzahmedm.github.io/react-auto-skeleton/docs/getting-started/)**

```tsx
<AutoSkeleton id="profile" loading={isLoading}>
  <ProfileCard />
</AutoSkeleton>
```

That's it. No shape definitions, no extra config.

---

## Why auto-skeleton

Most skeleton libraries make you define shapes manually — rectangles, circles, line counts — by hand. Others require a CLI build step to snapshot your UI into a static file you have to keep in sync.

auto-skeleton does neither. It measures your real rendered DOM with `getBoundingClientRect` at runtime, so skeletons are always accurate and always up to date — even as your layout changes.

| | auto-skeleton | Manual shapes | CLI snapshot tools |
|---|:---:|:---:|:---:|
| Zero config | ✅ | ❌ | ✅ |
| No build step | ✅ | ✅ | ❌ |
| Always in sync with layout | ✅ | ❌ | ❌ |
| Adapts to dynamic content | ✅ | ❌ | ❌ |
| Cached for instant re-loads | ✅ | — | ✅ |

---

## Packages

| Package | Description |
|---|---|
| [`@auto-skeleton/react`](https://www.npmjs.com/package/@auto-skeleton/react) | React component and hook |
| [`@auto-skeleton/vue`](https://www.npmjs.com/package/@auto-skeleton/vue) | Vue 3 component and composable |
| [`@auto-skeleton/lit`](https://www.npmjs.com/package/@auto-skeleton/lit) | Lit / Web Component |
| [`@auto-skeleton/core`](https://www.npmjs.com/package/@auto-skeleton/core) | Framework-agnostic DOM scanner |

---

## Installation

```bash
npm install @auto-skeleton/react
```

---

## Quick start (React)

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

## Quick start (Lit / Web Components)

```typescript
import "@auto-skeleton/lit";

// In your Lit template
html`
  <auto-skeleton id="profile" ?loading=${isLoading}>
    <div class="profile">
      <img src=${avatar} />
      <h2>${name}</h2>
      <p>${bio}</p>
    </div>
  </auto-skeleton>
`
```

## Quick start (Vue 3)

```vue
<!-- Vue 3 -->
<AutoSkeleton id="profile" :loading="isLoading">
  <ProfileCard />
</AutoSkeleton>
```

On first load, auto-skeleton scans the rendered DOM, extracts bone positions, and caches them. Every subsequent load shows the skeleton immediately — no layout shift.

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

.dark {
  --as-base: #27272a;
  --as-highlight: rgba(255, 255, 255, 0.05);
}
```

---

## Next.js

Add `"use client"` to any component that renders `<AutoSkeleton>`, and import styles in your root layout:

```tsx
// app/layout.tsx
import "@auto-skeleton/react/styles.css";
```

```tsx
"use client";
import { AutoSkeleton } from "@auto-skeleton/react";
```

---

## Accessibility

- The skeleton overlay is `aria-hidden="true"` — invisible to screen readers
- Animations are automatically disabled when `prefers-reduced-motion: reduce` is set

---

## Debug mode

Set `options.debug = true` to visualize detected bones with dashed outlines while tuning your layout:

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

Requires `MutationObserver`, `ResizeObserver`, and `sessionStorage`.

---

## Coming soon

- **React Native** — `@auto-skeleton/react-native`

---

## Contributors

- [@riazzahmedm](https://github.com/riazzahmedm)
- [@kishore-s-n](https://github.com/kishore-s-n)
- [@chithumonk](https://github.com/chithumonk)

---

## Contributing

```bash
git clone https://github.com/riazzahmedm/react-auto-skeleton
cd react-auto-skeleton
npm install
npm run demo:dev     # start the demo
npm test             # run tests
npm run build        # build all packages
```

---

## Keywords

skeleton loader, react skeleton, vue skeleton, lit skeleton, web components skeleton, zero-config, runtime DOM scanning, shimmer, placeholder, auto skeleton
