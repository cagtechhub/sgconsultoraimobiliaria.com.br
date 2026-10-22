<script setup lang="ts">
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, PhoneCall } from 'lucide-vue-next'
import type { Component } from 'vue'

const { whatsappHref, onWhatsAppClick } = useWhatsapp()
const currentYear = new Date().getFullYear()
const { instagramUrl, facebookUrl, linkedinUrl, contactEmail, businessPhone } = useSiteSettings()

const displayPhone = computed(() => businessPhone.value || 'WhatsApp disponível')

const footerLinks = [
  { label: 'Empreendimentos', href: '/empreendimentos' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Cases', href: '/#cases' },
  { label: 'Contato', href: '/#contato' },
]

type FooterSocialLink = {
  label: string
  href: string
  icon: Component
}

const socialLinks = computed<FooterSocialLink[]>(() => {
  const links: FooterSocialLink[] = [
    { label: 'WhatsApp', href: whatsappHref.value, icon: MessageCircle },
  ]
  if (instagramUrl.value)
    links.push({ label: 'Instagram', href: instagramUrl.value, icon: Instagram })
  if (facebookUrl.value) links.push({ label: 'Facebook', href: facebookUrl.value, icon: Facebook })
  if (linkedinUrl.value) links.push({ label: 'LinkedIn', href: linkedinUrl.value, icon: Linkedin })
  return links
})
</script>

<template>
  <footer class="relative z-20 w-full bg-ink text-text-on-dark-muted">
    <!-- Top metallic gold hairline -->
    <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

    <div class="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 items-start gap-12 md:grid-cols-12">
        <!-- Brand & Profile Column (5 cols) -->
        <div class="flex flex-col gap-5 md:col-span-5">
          <div class="flex items-center gap-4">
            <LayoutAppLogo variant="footer" />
          </div>

          <p class="max-w-sm text-sm leading-relaxed text-text-on-dark-muted">
            Consultoria de vendas e assessoria boutique especializada em lançamentos de alto padrão
            e curadoria para investidores qualificados.
          </p>

          <div class="flex items-center gap-4 pt-2">
            <img
              src="/img/consultora.webp"
              alt="Stefanny Gutierres"
              class="size-11 rounded-full object-cover ring-1 ring-primary/60"
            />
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-text-on-dark">Stefanny Gutierres</span>
              <span class="text-xs font-semibold uppercase tracking-wider text-primary">
                Consultora &amp; Estrategista
              </span>
            </div>
          </div>
        </div>

        <!-- Navigation Column (3 cols) -->
        <div class="flex flex-col gap-4 md:col-span-3">
          <span class="text-xs font-semibold uppercase tracking-widest text-primary font-label">
            Navegação
          </span>
          <nav class="flex flex-col gap-2.5" aria-label="Navegação do rodapé">
            <NuxtLink
              v-for="link in footerLinks"
              :key="link.href"
              :to="link.href"
              class="focus-ring w-fit text-sm text-text-on-dark-muted transition-colors duration-150 hover:text-brand-gold-light"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <div class="mt-2 flex flex-col gap-2 pt-2 text-xs text-text-on-dark-muted">
            <a
              class="focus-ring inline-flex items-center gap-2 hover:text-primary transition-colors duration-150"
              :href="`mailto:${contactEmail}`"
            >
              <Mail class="size-3.5 text-primary" aria-hidden="true" />
              {{ contactEmail }}
            </a>
            <a
              class="focus-ring inline-flex items-center gap-2 hover:text-primary transition-colors duration-150"
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              @click="onWhatsAppClick('footer_phone')"
            >
              <PhoneCall class="size-3.5 text-primary" aria-hidden="true" />
              {{ displayPhone }}
            </a>
          </div>
        </div>

        <!-- Compliance & Legal Column (4 cols) -->
        <div class="flex flex-col gap-4 md:col-span-4">
          <span class="text-xs font-semibold uppercase tracking-widest text-primary font-label">
            Transparência &amp; Conformidade
          </span>

          <div class="rounded-md border border-stroke-dark bg-surface-dark-raised p-4">
            <p class="text-xs leading-relaxed text-text-on-dark-muted">
              Não sou corretora de imóveis; não possuo registro CRECI. Atuação exclusiva em
              consultoria comercial e curadoria estratégica de lançamentos imobiliários.
            </p>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.label"
              class="focus-ring grid size-9 place-items-center rounded-sm border border-stroke-dark bg-surface-dark text-text-on-dark-muted transition hover:border-primary/50 hover:text-primary"
            >
              <component :is="social.icon" class="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div class="my-10 h-[1px] w-full bg-stroke-dark" />

      <div
        class="flex flex-col items-center justify-between gap-4 text-xs text-text-on-dark-muted sm:flex-row"
      >
        <p>
          © {{ currentYear }} Stefanny Gutierres Consultoria Imobiliária. Todos os direitos
          reservados.
        </p>
        <div class="flex items-center gap-2">
          <span class="text-xs uppercase tracking-widest text-primary font-label">
            High-End Real Estate Advisory
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
