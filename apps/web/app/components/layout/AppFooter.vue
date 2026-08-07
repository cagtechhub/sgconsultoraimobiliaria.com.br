<script setup lang="ts">
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, PhoneCall } from 'lucide-vue-next'
import type { Component } from 'vue'

const config = useRuntimeConfig()
const { whatsappHref, onWhatsAppClick } = useWhatsapp()
const currentYear = new Date().getFullYear()

const siteName = computed(() => String(config.public.siteName || 'Stefanny Gutierres'))
const instagramUrl = computed(() => String(config.public.instagramUrl || ''))
const facebookUrl = computed(() => String(config.public.facebookUrl || ''))
const linkedinUrl = computed(() => String(config.public.linkedinUrl || ''))
const contactEmail = computed(() => String(config.public.contactEmail || 'contato@gutierresconsultoria.com.br'))
const displayPhone = computed(() => String(config.public.businessPhone || 'WhatsApp disponível'))
const businessAddress = computed(() => String(config.public.businessAddress || 'Atendimento consultivo online'))

const footerLinks = [
  { label: 'Empreendimentos', href: '/empreendimentos' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Depoimentos', href: '/#depoimentos' },
  { label: 'Contato', href: '/#contato' },
]

type FooterSocialLink = {
  label: string
  href: string
  icon: Component
}

const socialLinks = computed<FooterSocialLink[]>(() => {
  const links: FooterSocialLink[] = [{ label: 'WhatsApp', href: whatsappHref.value, icon: MessageCircle }]

  if (instagramUrl.value) links.push({ label: 'Instagram', href: instagramUrl.value, icon: Instagram })
  if (facebookUrl.value) links.push({ label: 'Facebook', href: facebookUrl.value, icon: Facebook })
  if (linkedinUrl.value) links.push({ label: 'LinkedIn', href: linkedinUrl.value, icon: Linkedin })

  return links
})
</script>

<template>
  <footer class="footer-bar relative text-white/70">
    <div class="footer-bar-glow" aria-hidden="true" />

    <div class="container-page relative py-16">
      <div class="grid gap-10 lg:grid-cols-[1.15fr_0.75fr_0.9fr] lg:items-start">
        <div>
          <LayoutAppLogo variant="footer" />
          <p class="max-w-md text-sm leading-7 text-white/65">
            Consultora de vendas imobiliárias. Atuo na apresentação e condução comercial de
            empreendimentos, conectando compradores às incorporadoras parceiras.
            <strong class="mt-2 block font-medium text-[#e5c48b]/90">
              Não somos corretora de imóveis e não possuímos registro CRECI.
            </strong>
          </p>

          <a
            :href="whatsappHref"
            class="focus-ring mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#c5a059] px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#e5c48b]"
            target="_blank"
            rel="noopener noreferrer"
            @click="onWhatsAppClick('footer_cta')"
          >
            Receber curadoria
            <ArrowRight class="size-4" aria-hidden="true" />
          </a>
        </div>

        <div>
          <h3 class="mb-4 text-sm font-semibold uppercase tracking-widest text-[#c5a059]">
            Navegação
          </h3>
          <nav class="grid gap-3" aria-label="Navegação do rodapé">
            <NuxtLink
              v-for="link in footerLinks"
              :key="link.href"
              :to="link.href"
              class="focus-ring w-fit rounded-md text-sm text-white/60 transition hover:text-[#e5c48b]"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>

        <div>
          <h3 class="mb-4 text-sm font-semibold uppercase tracking-widest text-[#c5a059]">
            Contato e redes
          </h3>

          <div class="grid gap-3 text-sm text-white/60">
            <a
              class="focus-ring inline-flex items-center gap-3 rounded-md transition hover:text-[#e5c48b]"
              :href="`mailto:${contactEmail}`"
            >
              <Mail class="size-4 text-[#e5c48b]" aria-hidden="true" />
              {{ contactEmail }}
            </a>
            <a
              class="focus-ring inline-flex items-center gap-3 rounded-md transition hover:text-[#e5c48b]"
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              @click="onWhatsAppClick('footer_phone')"
            >
              <PhoneCall class="size-4 text-[#e5c48b]" aria-hidden="true" />
              {{ displayPhone }}
            </a>
            <p class="inline-flex items-center gap-3">
              <MapPin class="size-4 text-[#e5c48b]" aria-hidden="true" />
              {{ businessAddress }}
            </p>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              class="focus-ring grid size-11 place-items-center rounded-md border border-[#c5a059]/20 bg-[#c5a059]/5 text-[#e5c48b] transition hover:border-[#e5c48b]/40 hover:bg-[#c5a059]/10"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.label"
            >
              <component :is="social.icon" class="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-3 border-t pt-8 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"
        style="border-color: rgba(197, 160, 89, 0.15)"
      >
        <p>© {{ currentYear }} {{ siteName }}. Todos os direitos reservados.</p>
        <p>Consultoria de vendas imobiliárias — sem registro CRECI.</p>
      </div>
    </div>
  </footer>
</template>
