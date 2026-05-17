# @auto-skeleton/vue

Zero-config skeleton loaders for Vue 3. Wraps any component — `auto-skeleton` scans the live DOM at runtime and generates a pixel-accurate skeleton overlay. No manual shapes, no config files, no CLI step.

## Installation

```bash
npm install @auto-skeleton/vue
```

## Quick start

```vue
<script setup lang="ts">
import { ref } from "vue";
import { AutoSkeleton } from "@auto-skeleton/vue";
import "@auto-skeleton/vue/styles.css";

const loading = ref(true);
</script>

<template>
  <AutoSkeleton id="user-profile" :loading="loading">
    <UserProfileCard />
  </AutoSkeleton>
</template>
```

When `loading` is `true`, the real UI is replaced with a skeleton that mirrors its exact layout. When `loading` flips back to `false`, the real content reappears instantly from cache.

## Props

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `id` | `string` | ✅ | Unique cache key per instance. |
| `loading` | `boolean` | ✅ | Shows the skeleton overlay when `true`. |
| `options` | `AutoSkeletonOptions` | | Fine-tune animation, caching, and scan behaviour. |

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `animation` | `"wave" \| "pulse" \| "none"` | `"wave"` | Skeleton animation style. |
| `debug` | `boolean` | `false` | Outline detected bones with dashed borders. |
| `watch` | `boolean` | `true` | Re-scan when layout changes while not loading. |
| `watchDebounceMs` | `number` | `120` | Debounce delay for watcher-triggered re-scans. |
| `cache` | `boolean` | `true` | Cache bones in memory and `sessionStorage`. |
| `minSize` | `number` | `8` | Minimum element dimension (px) to generate a bone. |
| `ignoreSelectors` | `string[]` | `[]` | CSS selectors for elements to skip. |

## Data attributes

Fine-tune individual elements without changing render logic:

```html
<img data-skeleton-shape="circle" />
<p  data-skeleton-lines="3" />
<div data-skeleton-ignore></div>
<nav data-skeleton-container></nav>
```

## Theming

Override CSS custom properties to match your design system:

```css
:root {
  --as-base: #e4e4e7;
  --as-highlight: rgba(255, 255, 255, 0.9);
}
```

## `useAutoSkeleton` composable

Low-level composable for custom integrations:

```ts
import { useAutoSkeleton } from "@auto-skeleton/vue";

const { rootRef, bones, shouldShow, animation, debug } = useAutoSkeleton(
  toRef(props, "id"),
  toRef(props, "loading"),
  toRef(props, "options")
);
```

## Ecosystem

| Package | Description |
|---|---|
| [`@auto-skeleton/react`](https://www.npmjs.com/package/@auto-skeleton/react) | React component and hook |
| [`@auto-skeleton/vue`](https://www.npmjs.com/package/@auto-skeleton/vue) | Vue 3 component and composable |
| [`@auto-skeleton/lit`](https://www.npmjs.com/package/@auto-skeleton/lit) | Lit / Web Component |
| [`@auto-skeleton/core`](https://www.npmjs.com/package/@auto-skeleton/core) | Framework-agnostic DOM scanner |

## License

MIT
