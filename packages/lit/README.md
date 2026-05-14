# @auto-skeleton/lit

Zero-config skeleton loaders for Lit and Web Components. It scans your live DOM at runtime to generate pixel-accurate skeleton bones automatically.

## Installation

```bash
npm install @auto-skeleton/lit @auto-skeleton/core
```

## Setup

Import the package once at your app's entry point to register the `<auto-skeleton>` custom element.

```typescript
import '@auto-skeleton/lit';
```

## Usage

### Simple Example
Wrap any component or HTML fragment with `<auto-skeleton>`. Use the `loading` property to toggle between the skeleton and the actual content.

> **Note:** The `id` property is required for layout caching.

```typescript
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@auto-skeleton/lit';

@customElement('simple-card')
export class SimpleCard extends LitElement {
  @state() private isLoading = true;

  render() {
    return html`
      <auto-skeleton id="card-1" .loading=${this.isLoading}>
        <div class="card">
          <h2>Hello World</h2>
          <p>This content will be automatically scanned.</p>
        </div>
      </auto-skeleton>
    `;
  }
}
```

### Advanced Configuration
Pass an `options` object to customize the animation, debugging, and scanning behavior.

```typescript
render() {
  const skeletonOptions = {
    animation: 'pulse', // 'wave' | 'pulse' | 'none'
    debug: true,        // Show dashed outlines around detected bones
    cache: true,        // Enable/disable sessionStorage caching
    watch: true,        // Re-scan automatically on resize/DOM changes
    minSize: 10,        // Ignore elements smaller than 10px
    ignoreSelectors: ['.badge'] // CSS selectors to exclude
  };

  return html`
    <auto-skeleton id="adv-card" .loading=${this.isLoading} .options=${skeletonOptions}>
      <div class="card">
        <span class="badge">New</span>
        <h3>Advanced Card</h3>
      </div>
    </auto-skeleton>
  `;
}
```

### Fine-tuning with Data Attributes
Use standard data attributes on your HTML elements to guide the scanner for complex layouts.

| Attribute | Effect |
| :--- | :--- |
| `data-skeleton-ignore` | Skip this element entirely. |
| `data-skeleton-shape="circle"` | Force a circular bone (ideal for avatars). |
| `data-skeleton-lines="3"` | Force a specific number of text lines for a paragraph. |
| `data-skeleton-container` | Skip this element itself but scan its children. |

```html
<div class="profile">
  <!-- Force a circle for the avatar -->
  <div class="avatar" data-skeleton-shape="circle">JD</div>
  
  <!-- Force 2 lines for the bio -->
  <p data-skeleton-lines="2">${this.bio}</p>
  
  <!-- Hide the "Follow" button from the skeleton -->
  <button data-skeleton-ignore>Follow</button>
</div>
```

### Custom Theming
Override colors and animations using CSS variables.

```css
auto-skeleton {
  --as-base: #e4e4e7;          /* Bone background */
  --as-highlight: #ffffff;      /* Wave animation shimmer */
}

/* Dark Mode Example */
@media (prefers-color-scheme: dark) {
  auto-skeleton {
    --as-base: #27272a;
    --as-highlight: rgba(255, 255, 255, 0.05);
  }
}
```

### Complex Implementation
A full-featured example using nested components and multiple skeleton regions.

```typescript
@customElement('social-feed')
export class SocialFeed extends LitElement {
  @state() private loading = true;

  render() {
    return html`
      <!-- Navigation Shell -->
      <auto-skeleton id="nav" .loading=${this.loading}>
        <nav>
          <div class="logo">App</div>
          <div class="user-profile" data-skeleton-shape="circle">JD</div>
        </nav>
      </auto-skeleton>

      <!-- Main Content Area -->
      <auto-skeleton id="feed" .loading=${this.loading}>
        <div class="feed-container" data-skeleton-container>
          ${[1, 2, 3].map(() => html`
            <div class="post">
              <div class="header">
                <div class="avatar" data-skeleton-shape="circle"></div>
                <div class="meta">
                  <div class="name">User Name</div>
                  <div class="date">2 hours ago</div>
                </div>
              </div>
              <div class="body" data-skeleton-lines="3">
                Post content goes here with multiple lines of text...
              </div>
            </div>
          `)}
        </div>
      </auto-skeleton>
    `;
  }
}
```

## TypeScript Support

The package includes full TypeScript definitions:

```typescript
import type { AutoSkeletonOptions } from '@auto-skeleton/lit';
```

## License

MIT
