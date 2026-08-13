export function useWhatsapp(customMessage?: string) {
  const settings = useSiteSettings()
  const { trackWhatsApp } = useAnalytics()

  const buildHref = (message?: string) => {
    const digits = settings.whatsappNumber.value.replace(/\D/g, '')
    const text = encodeURIComponent(
      message ||
        settings.whatsappMessage.value ||
        'Olá! Gostaria de agendar uma consultoria imobiliária.',
    )
    return digits ? `https://wa.me/${digits}?text=${text}` : '#contato'
  }

  const whatsappHref = computed(() => buildHref(customMessage))

  const onWhatsAppClick = (placement = 'unknown') => {
    if (whatsappHref.value.startsWith('https://wa.me/')) {
      trackWhatsApp(placement)
    }
  }

  return { whatsappHref, onWhatsAppClick, buildHref }
}
