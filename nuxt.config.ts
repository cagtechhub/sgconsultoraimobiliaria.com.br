export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2026-04-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/eslint', 'nuxt-security', '@nuxt/image'],
  runtimeConfig: {
    public: {
      siteUrl: '',
      siteName: 'Stefanny Gutierres',
      noIndex: false,
      seoLocality: 'Brasil',
      businessAddress: '',
      businessPhone: '',
      contactEmail: 'contato@gutierresconsultoria.com.br',
      whatsappNumber: '',
      whatsappMessage: 'Olá! Gostaria de agendar uma consultoria imobiliária.',
      instagramUrl: '',
      facebookUrl: '',
      linkedinUrl: '',
      defaultOgImageUrl:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      ga4MeasurementId: '',
      metaPixelId: '',
    },
  },
  app: {
    head: {
      titleTemplate: '%s | Stefanny Gutierres',
      htmlAttrs: { lang: 'pt-BR' },
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    exposeConfig: true,
    editorSupport: true,
  },
  routeRules: {
    '/img/**': {
      headers: { 'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable' },
    },
    '/favicon.svg': {
      headers: { 'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable' },
    },
  },
  security: {
    enabled: true,
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://www.googletagmanager.com',
          'https://connect.facebook.net',
          'https://wa.me',
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'style-src-elem': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': [
          "'self'",
          'data:',
          'https://images.unsplash.com',
          'https://*.google-analytics.com',
          'https://*.facebook.net',
        ],
        'connect-src': ["'self'", 'https://*.google-analytics.com'],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'report-uri': '/csp-report',
      },
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'no-referrer',
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
      },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true,
      },
      xPermittedCrossDomainPolicies: 'none',
      xDownloadOptions: 'noopen',
    },
  },
})
