import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span style={{ fontWeight: 700, fontSize: 16 }}>
      auto<span style={{ color: '#7c3aed' }}>-skeleton</span>
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
      <meta name="description" content="Zero-config skeleton loaders for React" />
    </>
  ),
  navbar: {
    extraContent: (
      <a
        href="/react-auto-skeleton/"
        target="_blank"
        rel="noreferrer"
        style={{ fontSize: 14, opacity: 0.7, marginRight: 8 }}
      >
        Demo ↗
      </a>
    ),
  },
  footer: {
    text: (
      <span style={{ fontSize: 13 }}>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://github.com/riazzahmedm" target="_blank" rel="noreferrer">
          Riaz Ahmed
        </a>
        {' · '}
        <a href="https://www.npmjs.com/package/@auto-skeleton/react" target="_blank" rel="noreferrer">
          npm
        </a>
      </span>
    ),
  },
  sidebar: { defaultMenuCollapseLevel: 1 },
}

export default config
