import { getRequestURL } from 'h3'

type SitemapProperty = {
  slug: string
  updatedAt?: string | Date
  published?: boolean
}

function noIndexFlag(config: { public?: Record<string, unknown> }) {
  const value = config.public?.noIndex
  return value === true || value === 'true' || value === '1'
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function toLastmod(value?: string | Date) {
  if (!value) return new Date().toISOString().slice(0, 10)
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10)
  return date.toISOString().slice(0, 10)
}

function urlEntry(loc: string, opts: { lastmod?: string; changefreq: string; priority: string }) {
  const lastmod = opts.lastmod ? `\n    <lastmod>${escapeXml(opts.lastmod)}</lastmod>` : ''
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod}
    <changefreq>${opts.changefreq}</changefreq>
    <priority>${opts.priority}</priority>
  </url>`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (noIndexFlag(config as { public?: Record<string, unknown> })) {
    setResponseStatus(event, 404)
    setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
    return 'Not found'
  }

  const configured = String(config.public?.siteUrl || '')
    .trim()
    .replace(/\/$/, '')
  const origin = configured || getRequestURL(event).origin
  const apiUrl = String(config.public?.apiUrl || 'http://localhost:3001').replace(/\/$/, '')

  let properties: SitemapProperty[] = []
  try {
    properties = await $fetch<SitemapProperty[]>(`${apiUrl}/properties`)
  } catch {
    properties = []
  }

  const propertyUrls = properties
    .filter((item) => item.slug)
    .map((item) =>
      urlEntry(`${origin}/empreendimentos/${item.slug}`, {
        lastmod: toLastmod(item.updatedAt),
        changefreq: 'weekly',
        priority: '0.8',
      }),
    )

  const staticUrls = [
    urlEntry(`${origin}/`, {
      lastmod: toLastmod(),
      changefreq: 'weekly',
      priority: '1',
    }),
  ]

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=300, s-maxage=600')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...propertyUrls].join('\n')}
</urlset>
`
})
