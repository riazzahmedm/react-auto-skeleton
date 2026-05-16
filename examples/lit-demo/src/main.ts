import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import '@auto-skeleton/lit';

@customElement('user-avatar')
export class UserAvatar extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) size = '40px';

  static styles = css`
    :host { display: inline-block; }
    .avatar {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      overflow: hidden;
      user-select: none;
    }
  `;

  render() {
    const initials = this.name.split(' ').map(n => n[0]).join('').toUpperCase();
    return html`
      <div class="avatar" 
           style="width: ${this.size}; height: ${this.size}; font-size: calc(${this.size} * 0.4);"
           data-skeleton-shape="circle">
        ${initials}
      </div>
    `;
  }
}

@customElement('feed-post')
export class FeedPost extends LitElement {
  @property({ type: String }) author = '';
  @property({ type: String }) content = '';
  @property({ type: String }) time = '';

  static styles = css`
    .post {
      background: white;
      border: 1px solid #e4e4e7;
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .author-info { display: flex; flex-direction: column; }
    .name { font-weight: 600; color: #18181b; font-size: 0.95rem; }
    .time { font-size: 0.8rem; color: #71717a; }
    .body { 
      font-size: 1rem; 
      line-height: 1.5; 
      color: #3f3f46;
      margin-bottom: 1rem;
    }
    .actions {
      display: flex;
      gap: 1.5rem;
      border-top: 1px solid #f4f4f5;
      padding-top: 0.75rem;
      color: #71717a;
      font-size: 0.875rem;
    }
    .action { cursor: pointer; display: flex; align-items: center; gap: 0.25rem; }
    .action:hover { color: #3b82f6; }
  `;

  render() {
    return html`
      <div class="post">
        <div class="header">
          <user-avatar .name=${this.author}></user-avatar>
          <div class="author-info">
            <span class="name">${this.author}</span>
            <span class="time">${this.time}</span>
          </div>
        </div>
        <div class="body" data-skeleton-lines="3">
          ${this.content}
        </div>
        <div class="actions" data-skeleton-ignore>
          <div class="action">Like</div>
          <div class="action">Comment</div>
          <div class="action">Share</div>
        </div>
      </div>
    `;
  }
}

@customElement('demo-app')
export class DemoApp extends LitElement {
  @state() private shellLoading = true;
  @state() private contentLoading = true;
  @state() private view = 'feed';

  static styles = css`
    :host { 
      display: block; 
      min-height: 100vh; 
      background: #f8fafc; 
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .nav {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 0.75rem 1.5rem;
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo { font-weight: 900; font-size: 1.25rem; color: #0f172a; display: flex; align-items: center; gap: 0.5rem; }
    .logo-icon { width: 32px; height: 32px; background: #3b82f6; border-radius: 8px; }
    
    .container {
      max-width: 1000px;
      margin: 2rem auto;
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
      padding: 0 1.5rem;
    }

    aside { display: flex; flex-direction: column; gap: 2rem; }
    
    .profile-mini {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
    }
    .profile-mini h3 { margin: 0.75rem 0 0.25rem; font-size: 1.125rem; }
    .profile-mini p { margin: 0; color: #64748b; font-size: 0.875rem; }

    .nav-links {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 0.5rem;
    }
    .link {
      padding: 0.75rem 1rem;
      border-radius: 10px;
      color: #475569;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .link.active { background: #eff6ff; color: #1d4ed8; }
    .link:not(.active):hover { background: #f1f5f9; }

    .controls {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 0.75rem 1.25rem;
      border-radius: 9999px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid #e2e8f0;
      z-index: 100;
    }
    .status-pill {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      background: #f1f5f9;
      color: #64748b;
    }
    .status-pill.cached { background: #dcfce7; color: #166534; }
    
    button {
      border: none;
      padding: 0.625rem 1.25rem;
      border-radius: 9999px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
      font-size: 0.875rem;
    }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-secondary { background: #f1f5f9; color: #475569; }

    .explore-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
    .explore-item { aspect-ratio: 1; background: #e2e8f0; }

    .notif-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .notif-item {
      background: white; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0;
      display: flex; align-items: center; gap: 1rem;
    }
    .notif-dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; }

    @media (max-width: 850px) {
      .container { grid-template-columns: 1fr; }
      aside { display: none; }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.initialLoad();
  }

  private initialLoad() {
    this.shellLoading = true;
    this.contentLoading = true;
    setTimeout(() => { this.shellLoading = false; }, 1200);
    setTimeout(() => { this.contentLoading = false; }, 2500);
  }

  private setView(view: string) {
    if (this.view === view) return;
    this.view = view;
    this.contentLoading = true;
    setTimeout(() => { this.contentLoading = false; }, 1500);
  }

  private clearCache() {
    sessionStorage.clear();
    window.location.reload();
  }

  private renderContent() {
    if (this.view === 'feed') {
      return html`
        <main data-skeleton-container>
          <feed-post author="Alex Rivers" time="2 hours ago" content="Just finished implementing recursive Shadow DOM traversal for the auto-skeleton project!"></feed-post>
          <feed-post author="Sarah Chen" time="5 hours ago" content="Does anyone have tips for optimizing Lit components in high-density data grids?"></feed-post>
          <feed-post author="Michael Scott" time="Yesterday" content="Sometimes I'll start a sentence and I don't even know where it's going."></feed-post>
        </main>
      `;
    }
    if (this.view === 'explore') {
      return html`
        <main><div class="explore-grid" data-skeleton-container>${Array(9).fill(0).map(() => html`<div class="explore-item"></div>`)}</div></main>
      `;
    }
    if (this.view === 'notifications') {
      return html`
        <main><div class="notif-list" data-skeleton-container>${Array(5).fill(0).map((_, i) => html`<div class="notif-item"><div class="notif-dot"></div><user-avatar name="U${i}" size="32px"></user-avatar><div>New alert ${i}</div></div>`)}</div></main>
      `;
    }
    return html`<main></main>`;
  }

  render() {
    const isCached = !!sessionStorage.getItem(`auto-skeleton:social-content-${this.view}::${window.innerWidth}`);

    return html`
      <auto-skeleton skeleton-id="social-nav" .loading=${this.shellLoading}>
        <nav class="nav">
          <div class="logo"><div class="logo-icon"></div>SkeletonSocial</div>
          <user-avatar name="Jane Doe" size="32px"></user-avatar>
        </nav>
      </auto-skeleton>

      <div class="container">
        <aside>
          <auto-skeleton skeleton-id="social-profile" .loading=${this.shellLoading}>
            <div class="profile-mini">
              <user-avatar name="Jane Doe" size="80px"></user-avatar>
              <h3>Jane Doe</h3>
              <p>Product Designer</p>
            </div>
          </auto-skeleton>

          <auto-skeleton skeleton-id="social-links" .loading=${this.shellLoading}>
            <div class="nav-links">
              <div class="link ${this.view === 'feed' ? 'active' : ''}" @click=${() => this.setView('feed')}>Feed</div>
              <div class="link ${this.view === 'explore' ? 'active' : ''}" @click=${() => this.setView('explore')}>Explore</div>
              <div class="link ${this.view === 'notifications' ? 'active' : ''}" @click=${() => this.setView('notifications')}>Notifications</div>
            </div>
          </auto-skeleton>
        </aside>

        <auto-skeleton skeleton-id="social-content-${this.view}" .loading=${this.contentLoading}>
          ${this.renderContent()}
        </auto-skeleton>
      </div>

      <div class="controls">
        <div class="status-pill ${isCached ? 'cached' : ''}">
          ${isCached ? '✨ Layout Cached' : '🆕 First Scan Needed'}
        </div>
        <button class="btn-primary" @click=${this.initialLoad}>Reload</button>
        <button class="btn-secondary" @click=${this.clearCache}>Clear Cache</button>
      </div>
    `;
  }
}

const app = document.getElementById('app');
if (app) { app.innerHTML = '<demo-app></demo-app>'; }
