import { useJsonLdGraph } from './useJsonLdGraph'
import { limitSeoText, useCanonicalUrl, usePublicSiteOrigin } from './useSiteSeoUrls'

function trimUrl(value: string) {
  return value.trim().replace(/\/$/, '')
}

function absoluteAssetUrl(origin: string, value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (!origin) return trimmed
  return `${trimUrl(origin)}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`
}

/** Metadados globais: canônico, robots, Open Graph, Twitter e Schema.org. */
export function useSiteSeoHead() {
  const settings = useSiteSettings()
  const route = useRoute()
  const canonicalUrl = useCanonicalUrl()
  const origin = usePublicSiteOrigin()
  const runtimeConfig = useRuntimeConfig()

  const isAdminRoute = computed(
    () => route.path === '/admin' || route.path.startsWith('/admin/'),
  )

  const siteName = computed(() => settings.siteName.value.trim())
  const locality = computed(() => settings.seoLocality.value.trim())
  const ga4Id = computed(() => {
    const raw = settings.ga4MeasurementId.value.trim()
    return /^G-[A-Z0-9]+$/i.test(raw) ? raw : ''
  })
  const googleSiteVerification = computed(() =>
    String(runtimeConfig.public.googleSiteVerification || '').trim(),
  )
  const noIndex = computed(() => {
    if (isAdminRoute.value) return true
    return settings.noIndex.value
  })

  const pageTitle = computed(() => {
    const loc = locality.value
    if (loc) return `Consultoria imobiliária em ${loc}`
    return 'Consultora de vendas imobiliárias'
  })

  const documentTitle = computed(() =>
    limitSeoText(`${pageTitle.value} | ${siteName.value}`, 65),
  )

  const metaDescription = computed(() => {
    const loc = locality.value
    const name = siteName.value
    const localBit = loc ? ` em ${loc}` : ''
    const core = `${name}: consultoria de vendas imobiliárias${localBit}. Curadoria de empreendimentos e acompanhamento comercial — sem registro CRECI.`
    return limitSeoText(core, 160)
  })

  const ogImage = computed(() =>
    absoluteAssetUrl(origin.value, settings.defaultOgImageUrl.value),
  )

  const sameAs = computed(() =>
    [settings.instagramUrl.value, settings.facebookUrl.value, settings.linkedinUrl.value]
      .map((url) => url.trim())
      .filter((url) => url.length > 0 && /^https?:\/\//i.test(url)),
  )

  const seoKeywords = computed(() =>
    [
      'consultoria imobiliária',
      'empreendimentos',
      'curadoria de imóveis',
      'consultora de vendas',
      'lançamentos imobiliários',
      siteName.value,
    ]
      .filter(Boolean)
      .join(', '),
  )

  useSeoMeta({
    title: documentTitle,
    description: metaDescription,
    applicationName: siteName,
    keywords: seoKeywords,
    ogSiteName: siteName,
    ogType: 'website',
    ogLocale: 'pt_BR',
    ogTitle: documentTitle,
    ogDescription: metaDescription,
    ogImage,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: `${siteName.value} — consultoria imobiliária`,
    ogUrl: canonicalUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: documentTitle,
    twitterDescription: metaDescription,
    twitterImage: ogImage,
    themeColor: '#11100e',
    author: siteName,
  })

  const schemaNodes = computed(() => {
    if (isAdminRoute.value) return []
    const baseOrigin = trimUrl(origin.value)
    const url = canonicalUrl.value || (baseOrigin ? `${baseOrigin}/` : '')
    if (!url) return []

    const phoneDigits = String(
      settings.businessPhone.value || settings.whatsappNumber.value || '',
    ).replace(/\D/g, '')
    const tel = phoneDigits ? `+${phoneDigits}` : ''
    const addressLine = settings.businessAddress.value.trim()
    const contactEmail = settings.contactEmail.value.trim()
    const logoUrl = baseOrigin ? `${baseOrigin}/img/logo-mark.png` : ''

    const organization: Record<string, unknown> = {
      '@type': 'ProfessionalService',
      '@id': `${baseOrigin || url}/#organization`,
      name: siteName.value,
      url: baseOrigin ? `${baseOrigin}/` : url,
      description: metaDescription.value,
      areaServed: 'BR',
    }

    if (logoUrl) {
      organization.logo = { '@type': 'ImageObject', url: logoUrl }
      organization.image = logoUrl
    }

    if (sameAs.value.length) organization.sameAs = [...sameAs.value]
    if (tel) organization.telephone = tel
    if (contactEmail || tel) {
      organization.contactPoint = {
        '@type': 'ContactPoint',
        contactType: 'sales',
        areaServed: 'BR',
        availableLanguage: ['Portuguese'],
        ...(contactEmail ? { email: contactEmail } : {}),
        ...(tel ? { telephone: tel } : {}),
      }
    }

    const graph: Array<Record<string, unknown>> = [organization]

    if (tel || addressLine || locality.value) {
      const postal: Record<string, string> = {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
      }
      if (addressLine) postal.streetAddress = addressLine
      if (locality.value) postal.addressLocality = locality.value

      graph.push({
        '@type': 'LocalBusiness',
        '@id': `${baseOrigin || url}/#localbusiness`,
        name: siteName.value,
        url: baseOrigin ? `${baseOrigin}/` : url,
        description: metaDescription.value,
        parentOrganization: { '@id': `${baseOrigin || url}/#organization` },
        ...(logoUrl ? { image: logoUrl } : {}),
        ...(sameAs.value.length ? { sameAs: [...sameAs.value] } : {}),
        ...(tel ? { telephone: tel } : {}),
        address: postal,
      })
    }

    graph.push({
      '@type': 'WebSite',
      '@id': `${baseOrigin || url}/#website`,
      url: baseOrigin ? `${baseOrigin}/` : url,
      name: siteName.value,
      description: metaDescription.value,
      inLanguage: 'pt-BR',
      publisher: { '@id': `${baseOrigin || url}/#organization` },
    })

    return graph
  })

  useJsonLdGraph('schema-site', () => schemaNodes.value)

  useHead(() => {
    const admin = isAdminRoute.value
    const canon = admin ? '' : canonicalUrl.value
    const hreflang =
      canon && !noIndex.value
        ? ([
            { rel: 'alternate' as const, hreflang: 'pt-BR', href: canon },
            { rel: 'alternate' as const, hreflang: 'x-default', href: canon },
          ] as const)
        : ([] as const)

    const measurementId = ga4Id.value
    const gaScripts =
      !admin && measurementId
        ? [
            {
              key: 'ga4-src',
              src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`,
              async: true,
            },
            {
              key: 'ga4-inline',
              innerHTML: [
                'window.dataLayer=window.dataLayer||[];',
                'function gtag(){dataLayer.push(arguments);}',
                'window.gtag=window.gtag||gtag;',
                "gtag('js',new Date());",
                `gtag('config','${measurementId}');`,
              ].join(''),
            },
          ]
        : []

    return {
      title: admin ? `${siteName.value} | Admin` : undefined,
      meta: [
        {
          name: 'robots',
          content: noIndex.value
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        ...(googleSiteVerification.value
          ? [
              {
                name: 'google-site-verification',
                content: googleSiteVerification.value,
              },
            ]
          : []),
      ],
      script: gaScripts,
      link: [
        ...(canon ? [{ rel: 'canonical' as const, href: canon }] : []),
        ...hreflang,
        ...(admin
          ? []
          : [
              { rel: 'preconnect' as const, href: 'https://fonts.googleapis.com' },
              {
                rel: 'preconnect' as const,
                href: 'https://fonts.gstatic.com',
                crossorigin: 'anonymous' as const,
              },
            ]),
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        {
          rel: 'apple-touch-icon',
          href: '/img/logo-mark.png',
          sizes: '180x180',
        },
      ],
    }
  })
}
