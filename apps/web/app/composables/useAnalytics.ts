type AnalyticsParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] }
    _fbq?: Window['fbq']
  }
}

export function useAnalytics() {
  const config = useRuntimeConfig()
  const route = useRoute()

  const gaId = computed(() => String(config.public.ga4MeasurementId || '').trim())
  const pixelId = computed(() => String(config.public.metaPixelId || '').trim())

  const isAdminRoute = (path = route.path) => path.startsWith('/admin')

  const trackPageView = (path?: string, title?: string) => {
    if (!import.meta.client || isAdminRoute(path)) return

    const pagePath = path || route.fullPath
    const pageTitle = title || (typeof document !== 'undefined' ? document.title : pagePath)
    const pageLocation = typeof window !== 'undefined' ? window.location.href : pagePath

    if (gaId.value && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: pageLocation,
      })
    }

    if (pixelId.value && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView')
    }
  }

  const trackEvent = (name: string, params: AnalyticsParams = {}) => {
    if (!import.meta.client || isAdminRoute()) return

    if (gaId.value && typeof window.gtag === 'function') {
      window.gtag('event', name, params)
    }
  }

  /** Eventos Meta padrão (Lead, Contact, ViewContent, etc.) */
  const trackMeta = (event: string, params: AnalyticsParams = {}) => {
    if (!import.meta.client || isAdminRoute()) return
    if (pixelId.value && typeof window.fbq === 'function') {
      window.fbq('track', event, params)
    }
  }

  const trackLead = (source = 'contact_form') => {
    trackEvent('generate_lead', { method: source })
    trackMeta('Lead', { content_name: source })
  }

  const trackWhatsApp = (placement = 'unknown') => {
    trackEvent('whatsapp_click', { placement })
    trackMeta('Contact', { content_name: `whatsapp_${placement}` })
  }

  const trackViewContent = (payload: { id: string; name: string; category?: string }) => {
    trackEvent('view_item', {
      item_id: payload.id,
      item_name: payload.name,
      item_category: payload.category || 'empreendimento',
    })
    if (pixelId.value && typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_ids: [payload.id],
        content_name: payload.name,
        content_type: 'product',
      })
    }
  }

  return {
    gaId,
    pixelId,
    trackPageView,
    trackEvent,
    trackMeta,
    trackLead,
    trackWhatsApp,
    trackViewContent,
  }
}
