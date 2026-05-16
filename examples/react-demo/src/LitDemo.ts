/**
 * LitDemo.ts — Lit web components used in the React demo's "Lit & Web Components" section.
 * These are registered as custom elements and used via JSX as standard HTML tags.
 */
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@auto-skeleton/lit";

/** Small circular avatar with gradient background */
@customElement("as-demo-avatar")
export class AsDemoAvatar extends LitElement {
  @property({ type: String }) name = "";
  @property({ type: String }) size = "48px";

  static styles = css`
    :host { display: inline-block; flex-shrink: 0; }
    .avatar {
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed 0%, #06d6a0 100%);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 1rem;
      user-select: none; overflow: hidden;
    }
  `;

  render() {
    const initial = this.name.trim()[0]?.toUpperCase() ?? "?";
    return html`
      <div
        class="avatar"
        data-skeleton-shape="circle"
        style="width: ${this.size}; height: ${this.size}; font-size: calc(${this.size} * 0.38);"
      >${initial}</div>
    `;
  }
}

/** A single team-member card inside its own shadow root */
@customElement("as-demo-member-card")
export class AsDemoMemberCard extends LitElement {
  @property({ type: String }) name = "";
  @property({ type: String }) role = "";
  @property({ type: String }) tag = "";

  static styles = css`
    :host { display: block; }
    .card {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 18px 20px;
      border-radius: 14px;
      border: 1px solid var(--border, rgba(255,255,255,0.07));
      background: var(--bg-card, #0f0f1a);
      transition: border-color 0.2s;
    }
    .card:hover { border-color: rgba(124,58,237,0.35); }
    .info { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1; }
    .name {
      font-weight: 600; font-size: 14px; color: var(--text, #e2e4f0);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .role { font-size: 12px; color: var(--text-muted, #4a5068); }
    .tag {
      display: inline-block; font-size: 10px; font-weight: 600;
      padding: 2px 8px; border-radius: 999px; margin-top: 4px;
      background: rgba(124,58,237,0.12); color: #a78bfa;
      border: 1px solid rgba(124,58,237,0.2);
      width: fit-content;
    }
  `;

  render() {
    return html`
      <div class="card">
        <as-demo-avatar .name=${this.name} size="44px"></as-demo-avatar>
        <div class="info">
          <div class="name" data-skeleton-lines="1">${this.name}</div>
          <div class="role" data-skeleton-lines="1">${this.role}</div>
          <span class="tag">${this.tag}</span>
        </div>
      </div>
    `;
  }
}

/** Container grid of member cards */
@customElement("as-demo-team-grid")
export class AsDemoTeamGrid extends LitElement {
  static styles = css`
    :host { display: block; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 10px;
    }
  `;

  render() {
    return html`
      <div class="grid" data-skeleton-container>
        <as-demo-member-card name="Alex Rivers" role="Senior Engineer" tag="Lit"></as-demo-member-card>
        <as-demo-member-card name="Sarah Chen" role="Product Designer" tag="Web Components"></as-demo-member-card>
        <as-demo-member-card name="Marcus Webb" role="DevRel" tag="Open Source"></as-demo-member-card>
        <as-demo-member-card name="Yuki Tanaka" role="Frontend Architect" tag="Shadow DOM"></as-demo-member-card>
      </div>
    `;
  }
}
