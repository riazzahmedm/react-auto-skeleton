import { LitElement, html, css, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { scanBones, type Bone } from "@auto-skeleton/core";
import { clearCachedBones, getCachedBones, setCachedBones } from "./cache";
import type { AutoSkeletonOptions } from "./types";

@customElement("auto-skeleton")
export class AutoSkeleton extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: Boolean }) loading = false;
  @property({ type: Object }) options: AutoSkeletonOptions = {};

  @state() private bones: Bone[] | null = null;

  private scanTimer: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .as-root {
      position: relative;
    }

    :host(.as-loading) slot {
      visibility: hidden;
    }

    .as-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 10;
    }

    .as-bone {
      position: absolute;
      background: var(--as-base, #e4e4e7);
      overflow: hidden;
    }

    .as-bone.as-wave::after {
      content: "";
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--as-highlight, rgba(255, 255, 255, 0.9)) 45%,
        transparent 100%
      );
      animation: as-wave 1.2s infinite;
    }

    .as-bone.as-pulse {
      animation: as-pulse 1.1s ease-in-out infinite;
    }

    .as-bone.as-debug {
      outline: 1px dashed var(--as-debug, rgba(255, 99, 71, 0.45));
      outline-offset: -1px;
    }

    @keyframes as-wave {
      100% {
        transform: translateX(100%);
      }
    }

    @keyframes as-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.55;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .as-bone.as-wave::after,
      .as-bone.as-pulse {
        animation: none;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.cacheEnabled) {
      this.bones = getCachedBones(this.id);
    }
    this.setupWatchers();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanupWatchers();
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    const idChanged = changedProperties.has("id");
    const optionsChanged = changedProperties.has("options");
    const loadingChanged = changedProperties.has("loading");

    if (idChanged || (optionsChanged && !this.cacheEnabled)) {
      if (this.cacheEnabled) {
        this.bones = getCachedBones(this.id);
      } else {
        this.bones = null;
        clearCachedBones(this.id);
      }
    }

    if (idChanged || optionsChanged || loadingChanged) {
      if (this.loading) {
        this.cleanupWatchers();
      } else {
        this.setupWatchers();
      }
    }
  }

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("loading") && !this.loading) {
      this.runScan();
    }

    if (
      changedProperties.has("loading") ||
      changedProperties.has("id") ||
      changedProperties.has("options")
    ) {
      this.updateHostClass();
    }
  }

  private get cacheEnabled() {
    return this.options.cache ?? true;
  }

  private updateHostClass() {
    if (this.shouldShow) {
      this.classList.add("as-loading");
    } else {
      this.classList.remove("as-loading");
    }
  }

  private runScan() {
    const next = scanBones(this, {
      ignoreSelectors: this.options.ignoreSelectors,
      minSize: this.options.minSize
    });
    this.bones = next;
    setCachedBones(this.id, next, this.cacheEnabled);
    this.updateHostClass();
  }

  private setupWatchers() {
    this.cleanupWatchers();
    if (this.loading) return;
    if ((this.options.watch ?? true) === false) return;

    const debounceMs = this.options.watchDebounceMs ?? 120;

    const schedule = () => {
      if (this.scanTimer !== null) window.clearTimeout(this.scanTimer);
      this.scanTimer = window.setTimeout(() => {
        this.runScan();
      }, debounceMs);
    };

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => schedule());
      this.resizeObserver.observe(this);
    }
    
    this.mutationObserver = new MutationObserver(() => schedule());
    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });

    window.addEventListener("resize", schedule);
    this._windowResizeHandler = schedule;
  }

  private _windowResizeHandler: (() => void) | null = null;

  private cleanupWatchers() {
    if (this.scanTimer !== null) {
      window.clearTimeout(this.scanTimer);
      this.scanTimer = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    if (this._windowResizeHandler) {
      window.removeEventListener("resize", this._windowResizeHandler);
      this._windowResizeHandler = null;
    }
  }

  private get shouldShow() {
    return this.loading && !!this.bones && this.bones.length > 0;
  }

  render() {
    const animation = this.options.animation ?? "wave";
    const debug = this.options.debug ?? false;

    return html`
      <div class="as-root">
        <slot></slot>
        ${this.shouldShow && this.bones
          ? html`
              <div class="as-overlay" aria-hidden="true">
                ${this.bones.map(
                  (b, i) => html`
                    <span
                      class="as-bone as-${animation}${debug ? " as-debug" : ""}"
                      style="left: ${b.x}px; top: ${b.y}px; width: ${b.width}px; height: ${b.height}px; border-radius: ${b.kind ===
                      "circle"
                        ? "50%"
                        : `${b.radius}px`}"
                    ></span>
                  `
                )}
              </div>
            `
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "auto-skeleton": AutoSkeleton;
  }
}
