import { useSchemaOrg } from '@unhead/schema-org/vue'

function noIndexEnabled(value: boolean | string | undefined) {
  return value === true || value === 'true' || value === '1'
}

export function useSiteSeoHead(overrides?: {
  title?: string
  description?: string
  image?: string
  path?: string
  type?: 'website' | 'article'
}) {
  const config = useRuntimeConfig()
  const canonicalUrl = useCanonicalUrl(overrides?.path)

  const siteName = computed(() => String(config.public.siteName || 'Stefanny Gutierres').trim())
  const locality = computed(() => String(config.public.seoLocality || '').trim())
  const noIndex = computed(() => noIndexEnabled(config.public.noIndex as boolean | string | undefined))
  const pageTitle = computed(() => overrides?.title || 'Consultora de vendas imobiliárias')
  const socialTitle = computed(() =>
    overrides?.title ? `${overrides.title} | ${siteName.value}` : `${siteName.value} | ${pageTitle.value}`,
  )
  const description = computed(() => {
    if (overrides?.description) return overrides.description
    const localText = locality.value ? ` Atendimento em ${locality.value}.` : ''
    return `Consultora de vendas imobiliárias. Apresentação comercial de empreendimentos com curadoria e acompanhamento — sem registro CRECI.${localText}`
  })
  const ogImage = computed(
    () => String(overrides?.image || config.public.defaultOgImageUrl || '').trim(),
  )
  const ogType = computed(() => overrides?.type || 'website')

  useSeoMeta({
    title: pageTitle,
    description,
    ogSiteName: siteName,
    ogType,
    ogLocale: 'pt_BR',
    ogTitle: socialTitle,
    ogDescription: description,
    ogImage,
    ogImageAlt: socialTitle,
    ogUrl: canonicalUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: socialTitle,
    twitterDescription: description,
    twitterImage: ogImage,
    author: siteName,
  })

  useSchemaOrg(() => {
    const phone = String(config.public.businessPhone || config.public.whatsappNumber || '').replace(/\D/g, '')
    const tel = phone ? `+${phone}` : ''
    const contactEmail = String(config.public.contactEmail || '').trim()
    const instagram = String(config.public.instagramUrl || '').trim()
    const facebook = String(config.public.facebookUrl || '').trim()
    const sameAs = [instagram, facebook].filter(Boolean)
    const siteOrigin = canonicalUrl.value.replace(/\/empreendimentos\/.*$/, '').replace(/\/$/, '') || canonicalUrl.value

    const organization: Record<string, unknown> = {
      '@type': 'ProfessionalService',
      '@id': `${siteOrigin}/#organization`,
      name: siteName.value,
      url: `${siteOrigin}/`,
      description: description.value,
      image: String(config.public.defaultOgImageUrl || ogImage.value).trim(),
      areaServed: 'BR',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
        ...(locality.value ? { addressLocality: locality.value } : {}),
      },
    }

    if (tel) organization.telephone = tel
    if (sameAs.length) organization.sameAs = sameAs
    if (contactEmail || tel) {
      organization.contactPoint = {
        '@type': 'ContactPoint',
        contactType: 'sales',
        areaServed: 'BR',
        availableLanguage: 'Portuguese',
        ...(contactEmail ? { email: contactEmail } : {}),
        ...(tel ? { telephone: tel } : {}),
      }
    }

    const nodes: Record<string, unknown>[] = [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${siteOrigin}/#website`,
        url: `${siteOrigin}/`,
        name: siteName.value,
        description: description.value,
        inLanguage: 'pt-BR',
        publisher: { '@id': `${siteOrigin}/#organization` },
      },
    ]

    if (overrides?.title && overrides?.path?.includes('/empreendimentos/')) {
      nodes.push({
        '@type': 'RealEstateListing',
        '@id': `${canonicalUrl.value}#listing`,
        name: overrides.title,
        description: description.value,
        url: canonicalUrl.value,
        image: ogImage.value || undefined,
        inLanguage: 'pt-BR',
      })
    }

    return nodes
  })

  useHead(() => ({
    meta: [
      {
        name: 'robots',
        content: noIndex.value
          ? 'noindex, nofollow'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl.value },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'preconnect', href: 'https://images.unsplash.com' },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    ],
  }))
}
