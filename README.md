# auto-skeleton

Auto-generated skeleton loader for React that scans your real UI and reuses its layout while data loads.

## Packages

- `@auto-skeleton/core`: DOM scanning and bone generation
- `@auto-skeleton/react`: React bindings/components

## Quick start

```bash
cd auto-skeleton
npm install
npm run demo:dev
```

## Install

```bash
npm install @auto-skeleton/react
```

```tsx
import { AutoSkeleton } from "@auto-skeleton/react";
import "@auto-skeleton/react/styles.css";
```

```tsx
<AutoSkeleton id="users-card" loading={loading}>
  <UsersCard />
</AutoSkeleton>
```

## Attribute overrides (MVP)

You can control generated bones per element without writing custom render logic:

- `data-skeleton-ignore`: skip this element
- `data-skeleton-shape="circle|rect"`: force a shape
- `data-skeleton-lines="N"`: force text line count for text containers
- `data-skeleton-container`: mark wrapper elements that should not become a large container bone

Example:

```tsx
<AutoSkeleton id="profile" loading={loading} options={{ debug: false }}>
  <article data-skeleton-container>
    <img src={avatarUrl} data-skeleton-shape="circle" />
    <h2 data-skeleton-lines="1">User name</h2>
    <p data-skeleton-lines="3">Bio text...</p>
    <span data-skeleton-ignore>Live badge</span>
  </article>
</AutoSkeleton>
```

## Debug mode

Use `options.debug = true` to visualize detected bones with dashed outlines while tuning your layout.

## Production-focused options

- `minSize`: ignore tiny elements
- `ignoreSelectors`: skip known noisy nodes
- `watch` (default `true`): re-scan when layout/content changes while not loading
- `watchDebounceMs` (default `120`): debounce re-scan frequency
- `cache` (default `true`): keep bones in memory + `sessionStorage`
- `animation`: `wave | pulse | none`

## Accessibility

- Supports reduced-motion automatically via `prefers-reduced-motion`.
- Skeleton overlay is `aria-hidden`.

## Validate before publish

```bash
npm run typecheck
npm run test
npm run build
npm run demo:build
```

## CI

GitHub Actions workflow runs `typecheck`, `test`, `build`, and `demo:build` on each push and pull request.

## Release and Versioning

- Changesets is used for package versioning/changelogs.
- Add a changeset with:

```bash
npm run changeset
```

- Apply version bumps locally:

```bash
npm run version-packages
```

- Publish manually (if needed):

```bash
npm run release
```

### GitHub workflows

- `.github/workflows/release-pr.yml`: creates or updates a release PR from changesets on `main`.
- `.github/workflows/publish-tags.yml`: publishes workspace packages when a `v*` git tag is pushed, with npm provenance.

Required repo secrets:
- `NPM_TOKEN`

## Performance Benchmark

Run scanner benchmark:

```bash
npm run perf:scan
```

Current budget policy:
- `scanBones` average runtime should remain below `80ms` in the benchmark harness.

## Browser Support Matrix

Official support target:
- Chrome (latest 2 versions)
- Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari macOS/iOS (latest 2 major versions)

Notes:
- Requires `MutationObserver`, `ResizeObserver`, and `sessionStorage` for full feature set.
- If `ResizeObserver` is unavailable, auto re-scan falls back to window resize events.
