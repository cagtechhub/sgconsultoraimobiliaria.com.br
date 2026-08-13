import { getRequestURL } from 'h3'

/** Origem absoluta do site para sitemaps/robots (env → request). */
export function resolveSiteOrigin(event?: Parameters<typeof getRequestURL>[0]) {
  const config = useRuntimeConfig(event)
  const fromEnv = String(config.public?.siteUrl || '')
    .trim()
    .replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (event) {
    try {
      return getRequestURL(event).origin
    } catch {
      /* ignore */
    }
  }
  return ''
}

export function noIndexFlag(config: { public?: Record<string, unknown> }) {
  const value = config.public?.noIndex
  return value === true || value === 'true' || value === '1'
}
