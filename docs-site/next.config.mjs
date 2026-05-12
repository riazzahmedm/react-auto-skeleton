import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

export default withNextra({
  basePath: '/react-auto-skeleton/docs',
  images: { unoptimized: true },
  trailingSlash: true,
})
