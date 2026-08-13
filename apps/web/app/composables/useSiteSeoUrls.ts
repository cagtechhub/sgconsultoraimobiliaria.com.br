function normalizeOrigin(value: string) {
  return value.trim().replace(/\/$/, '')
}

export function usePublicSiteOrigin() {
  const { siteUrl } = useSiteSettings()
  const requestUrl = import.meta.server ? useRequestURL() : null

  return computed(() => {
    const configured = normalizeOrigin(siteUrl.value)
    if (configured) return configured
    if (requestUrl) return normalizeOrigin(requestUrl.origin)
    if (import.meta.client) return window.location.origin.replace(/\/$/, '')
    return ''
  })
}

/** Canonical da página atual (ou path explícito). */
export function useCanonicalUrl(path?: string) {
  const origin = usePublicSiteOrigin()
  const route = useRoute()

  return computed(() => {
    const raw = path ?? route.path ?? '/'
    const cleanPath = raw === '/' ? '/' : raw.replace(/\/$/, '')
    const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
    return `${origin.value}${normalized}`
  })
}
