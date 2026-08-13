export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = resolveSiteOrigin(event)

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')

  if (noIndexFlag(config as { public?: Record<string, unknown> })) {
    return `User-agent: *
Disallow: /
`
  }

  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /api/',
    '',
    'User-agent: Mediapartners-Google',
    'Disallow: /admin',
    'Disallow: /admin/',
    '',
    'User-agent: AdsBot-Google',
    'Disallow: /admin',
    'Disallow: /admin/',
    '',
    ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : []),
  ]

  return lines.join('\n')
})
