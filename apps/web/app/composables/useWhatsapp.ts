export function useWhatsapp(customMessage?: string) {
  const config = useRuntimeConfig()
  const { trackWhatsApp } = useAnalytics()

  const whatsappHref = computed(() => {
    const digits = String(config.public.whatsappNumber || '').replace(/\D/g, '')
    const message = encodeURIComponent(
      customMessage ||
        String(config.public.whatsappMessage || 'Olá! Gostaria de saber mais sobre os empreendimentos.'),
    )
    return digits ? `https://wa.me/${digits}?text=${message}` : '#contato'
  })

  const onWhatsAppClick = (placement = 'unknown') => {
    if (whatsappHref.value.startsWith('https://wa.me/')) {
      trackWhatsApp(placement)
    }
  }

  return { whatsappHref, onWhatsAppClick }
}
