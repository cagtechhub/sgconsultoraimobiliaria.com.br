import type { SiteSettings } from '@gutierres/shared'

const DEFAULT_SITE_NAME = 'Stefanny Gutierres'
const DEFAULT_CONTACT_EMAIL = 'contato@gutierresconsultoria.com.br'
const DEFAULT_WHATSAPP_MESSAGE =
  'Olá! Gostaria de agendar uma consultoria imobiliária.'

export type PublicSiteSettingsState = {
  siteUrl: string
  siteName: string
  seoLocality: string
  noIndex: boolean
  businessAddress: string
  businessPhone: string
  contactEmail: string
  whatsappNumber: string
  whatsappMessage: string
  instagramUrl: string
  facebookUrl: string
  linkedinUrl: string
  defaultOgImageUrl: string
  ga4MeasurementId: string
  metaPixelId: string
}

const asString = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback

const asBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === '1') return true
  if (value === 'false' || value === '0') return false
  return fallback
}

const pickString = (value: unknown, fallback: string) => {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed || fallback
}

export function overlaySiteSettings(
  settings: SiteSettings,
  fallback: PublicSiteSettingsState,
): PublicSiteSettingsState {
  return {
    siteUrl: pickString(settings.siteUrl, fallback.siteUrl),
    siteName: pickString(settings.siteName, fallback.siteName),
    seoLocality: pickString(settings.seoLocality, fallback.seoLocality),
    noIndex:
      typeof settings.noIndex === 'boolean' ? settings.noIndex : fallback.noIndex,
    businessAddress: pickString(settings.businessAddress, fallback.businessAddress),
    businessPhone: pickString(settings.businessPhone, fallback.businessPhone),
    contactEmail: pickString(settings.contactEmail, fallback.contactEmail),
    whatsappNumber: pickString(settings.whatsappNumber, fallback.whatsappNumber),
    whatsappMessage: pickString(settings.whatsappMessage, fallback.whatsappMessage),
    instagramUrl: pickString(settings.instagramUrl, fallback.instagramUrl),
    facebookUrl: pickString(settings.facebookUrl, fallback.facebookUrl),
    linkedinUrl: pickString(settings.linkedinUrl, fallback.linkedinUrl),
    defaultOgImageUrl: pickString(settings.defaultOgImageUrl, fallback.defaultOgImageUrl),
    ga4MeasurementId: pickString(settings.ga4MeasurementId, fallback.ga4MeasurementId),
    metaPixelId: pickString(settings.metaPixelId, fallback.metaPixelId),
  }
}

function fromRuntimeConfig(): PublicSiteSettingsState {
  const config = useRuntimeConfig()
  const publicConfig = config.public as Record<string, unknown>
  return {
    siteUrl: asString(publicConfig.siteUrl),
    siteName: asString(publicConfig.siteName, DEFAULT_SITE_NAME),
    seoLocality: asString(publicConfig.seoLocality, 'Brasil'),
    noIndex: asBoolean(publicConfig.noIndex),
    businessAddress: asString(publicConfig.businessAddress),
    businessPhone: asString(publicConfig.businessPhone),
    contactEmail: asString(publicConfig.contactEmail, DEFAULT_CONTACT_EMAIL),
    whatsappNumber: asString(publicConfig.whatsappNumber),
    whatsappMessage: asString(publicConfig.whatsappMessage, DEFAULT_WHATSAPP_MESSAGE),
    instagramUrl: asString(publicConfig.instagramUrl),
    facebookUrl: asString(publicConfig.facebookUrl),
    linkedinUrl: asString(publicConfig.linkedinUrl),
    defaultOgImageUrl: asString(publicConfig.defaultOgImageUrl),
    ga4MeasurementId: asString(publicConfig.ga4MeasurementId),
    metaPixelId: asString(publicConfig.metaPixelId),
  }
}

export function useSiteSettingsState() {
  return useState<PublicSiteSettingsState>('site-settings', fromRuntimeConfig)
}

export async function loadSiteSettings() {
  const state = useSiteSettingsState()
  const fallback = fromRuntimeConfig()
  const base = resolveApiBase()
  if (!base) {
    state.value = fallback
    return state.value
  }

  try {
    const settings = await $fetch<SiteSettings>(`${base}/settings`)
    state.value = overlaySiteSettings(settings, fallback)
    return settings
  } catch {
    state.value = fallback
    return state.value
  }
}

export function useSiteSettings() {
  const state = useSiteSettingsState()

  return {
    siteUrl: computed(() => state.value.siteUrl),
    siteName: computed(() => state.value.siteName.trim() || DEFAULT_SITE_NAME),
    seoLocality: computed(() => state.value.seoLocality),
    noIndex: computed(() => state.value.noIndex),
    contactEmail: computed(() => state.value.contactEmail.trim() || DEFAULT_CONTACT_EMAIL),
    businessPhone: computed(() => state.value.businessPhone),
    businessAddress: computed(() => state.value.businessAddress),
    whatsappNumber: computed(() => state.value.whatsappNumber),
    whatsappMessage: computed(
      () => state.value.whatsappMessage || DEFAULT_WHATSAPP_MESSAGE,
    ),
    instagramUrl: computed(() => state.value.instagramUrl),
    facebookUrl: computed(() => state.value.facebookUrl),
    linkedinUrl: computed(() => state.value.linkedinUrl),
    defaultOgImageUrl: computed(() => state.value.defaultOgImageUrl),
    ga4MeasurementId: computed(() => state.value.ga4MeasurementId),
    metaPixelId: computed(() => state.value.metaPixelId),
    load: loadSiteSettings,
  }
}
