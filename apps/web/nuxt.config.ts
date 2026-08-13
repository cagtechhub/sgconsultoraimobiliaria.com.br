function envOrigin(value: string | undefined) {
  if (!value) return ''
  try {
    return new URL(value).origin
  } catch {
    return value.replace(/\/$/, '')
  }
}

const publicApiBase =
  process.env.NUXT_PUBLIC_API_BASE?.trim() || 'http://localhost:3001'
const publicApiOrigin = envOrigin(publicApiBase)
const publicSupabaseOrigin = envOrigin(process.env.NUXT_PUBLIC_SUPABASE_URL)

export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2026-04-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', 'nuxt-security'],
  build: {
    transpile: ['@gutierres/shared'],
  },
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE?.trim() || '',
    public: {
      siteUrl: '',
      siteName: 'Stefanny Gutierres',
      apiBase: publicApiBase,
      supabaseUrl: '',
      supabaseAnonKey: '',
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
    '/admin/**': {
      robots: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    },
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
          'https://www.google-analytics.com',
          'https://connect.facebook.net',
          'https://wa.me',
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'style-src-elem': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          'https://images.unsplash.com',
          'https://*.supabase.co',
          'http://127.0.0.1:54321',
          'https://*.google-analytics.com',
          'https://www.google-analytics.com',
          'https://*.googletagmanager.com',
          'https://*.facebook.com',
          'https://*.facebook.net',
          'https://www.facebook.com',
          'https://cdnm.com.br/',
        ],
        'media-src': ["'self'", 'blob:', 'https://*.supabase.co', 'http://127.0.0.1:54321'],
        'connect-src': [
          "'self'",
          publicApiOrigin,
          'http://localhost:3001',
          'http://127.0.0.1:3001',
          'https://*.google-analytics.com',
          'https://www.google-analytics.com',
          'https://analytics.google.com',
          'https://*.analytics.google.com',
          'https://*.googletagmanager.com',
          'https://www.facebook.com',
          'https://*.facebook.com',
          'https://connect.facebook.net',
          'https://*.supabase.co',
          'wss://*.supabase.co',
          'http://127.0.0.1:54321',
          'ws://127.0.0.1:54321',
          ...(publicSupabaseOrigin ? [publicSupabaseOrigin] : []),
        ],
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
