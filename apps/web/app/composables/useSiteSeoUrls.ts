function normalizeOrigin(value: string) {
  return value.trim().replace(/\/$/, '')
}

export function limitSeoText(value: string, max: number) {
  const trimmed = value.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, Math.max(0, max - 1))}…`
}

export function usePublicSiteOrigin() {
  const { siteUrl } = useSiteSettings()
  let requestOrigin = ''
  if (import.meta.server) {
    try {
      requestOrigin = normalizeOrigin(useRequestURL().origin)
    } catch {
      requestOrigin = ''
    }
  }

  return computed(() => {
    const configured = normalizeOrigin(siteUrl.value)
    if (configured) return configured
    if (requestOrigin) return requestOrigin
    if (import.meta.client) return window.location.origin.replace(/\/$/, '')
    return ''
  })
}

/** Canonical da página atual (ou path explícito). Vazio se a origem ainda não existir. */
export function useCanonicalUrl(path?: string) {
  const origin = usePublicSiteOrigin()
  const route = useRoute()

  return computed(() => {
    const o = origin.value
    if (!o) return ''
    const raw = path ?? route.path ?? '/'
    const cleanPath = raw === '/' ? '/' : raw.replace(/\/$/, '')
    const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
    return `${o}${normalized}`
  })
}
