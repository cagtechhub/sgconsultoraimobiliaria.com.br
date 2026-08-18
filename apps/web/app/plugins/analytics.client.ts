function loadGa4(measurementId: string) {
  if (typeof window === 'undefined' || window.gtag) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: false,
    anonymize_ip: true,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)
}

function loadMetaPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.fbq) return

  const fbq: Window['fbq'] = function (...args: unknown[]) {
    if (fbq?.callMethod) {
      fbq.callMethod(...args)
    } else {
      fbq.queue = fbq.queue || []
      fbq.queue.push(args)
    }
  } as Window['fbq']

  fbq.queue = []
  window.fbq = fbq
  window._fbq = fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  window.fbq('init', pixelId)

  // noscript fallback image
  if (!document.getElementById('meta-pixel-noscript')) {
    const img = document.createElement('img')
    img.id = 'meta-pixel-noscript'
    img.height = 1
    img.width = 1
    img.style.display = 'none'
    img.alt = ''
    img.src = `https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`
    document.body.appendChild(img)
  }
}

export default defineNuxtPlugin({
  name: 'analytics',
  enforce: 'post',
  setup() {
    if (!import.meta.client) return

    const settings = useSiteSettings()
    const router = useRouter()
    const { trackPageView } = useAnalytics()

    const gaId = settings.ga4MeasurementId.value.trim()
    const pixelId = settings.metaPixelId.value.trim()
    const gaAlreadyInHead =
      typeof document !== 'undefined' &&
      Boolean(document.querySelector('script[src*="googletagmanager.com/gtag/js"]'))

    if (gaId && !gaAlreadyInHead) loadGa4(gaId)
    if (pixelId) loadMetaPixel(pixelId)

    const initialPath = router.currentRoute.value.fullPath
    if (!initialPath.startsWith('/admin')) {
      requestAnimationFrame(() => {
        if (gaAlreadyInHead) {
          if (pixelId && typeof window.fbq === 'function') {
            window.fbq('track', 'PageView')
          }
          return
        }
        trackPageView(initialPath)
      })
    }

    router.afterEach((to, from) => {
      if (to.path.startsWith('/admin')) return
      if (to.fullPath === from.fullPath) return
      requestAnimationFrame(() => trackPageView(to.fullPath))
    })
  },
})
