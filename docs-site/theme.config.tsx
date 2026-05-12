import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontFamily: "'Inter', ui-sans-serif, sans-serif",
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: '-0.025em',
      }}>
        auto<span style={{ color: '#a78bfa' }}>-skeleton</span>
      </span>
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 7px',
        borderRadius: 6,
        background: 'rgba(124,58,237,0.12)',
        color: '#a78bfa',
        border: '1px solid rgba(124,58,237,0.18)',
        letterSpacing: '0.02em',
        fontFamily: "'JetBrains Mono', monospace",
      }}>v0.0.5</span>
    </span>
  ),

  project: {
    link: 'https://github.com/riazzahmedm/react-auto-skeleton',
  },

  docsRepositoryBase: 'https://github.com/riazzahmedm/react-auto-skeleton/blob/main/docs-site',

  useNextSeoProps() {
    return { titleTemplate: '%s – auto-skeleton' }
  },

  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Zero-config skeleton loaders for React. Scans the real DOM and generates pixel-accurate skeletons automatically." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://api.fontshare.com" />
    </>
  ),

  navbar: {
    extraContent: (
      <a
        href="/react-auto-skeleton/"
        target="_blank"
        rel="noreferrer"
        style={{
          fontSize: 12,
          fontWeight: 500,
          opacity: 0.6,
          marginRight: 4,
          textDecoration: 'none',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
      >
        Demo ↗
      </a>
    ),
  },

  footer: {
    text: (
      <span style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif", opacity: 0.6 }}>
        MIT {new Date().getFullYear()} ·{' '}
        <a
          href="https://github.com/riazzahmedm"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
        >
          Riaz Ahmed
        </a>
        {' · '}
        <a
          href="https://www.npmjs.com/package/@auto-skeleton/react"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
        >
          npm
        </a>
        {' · '}
        <a
          href="https://github.com/riazzahmedm/react-auto-skeleton"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
        >
          GitHub
        </a>
      </span>
    ),
  },

  primaryHue: 262,
  primarySaturation: 72,

  sidebar: { defaultMenuCollapseLevel: 1 },

  darkMode: true,
}

export default config
