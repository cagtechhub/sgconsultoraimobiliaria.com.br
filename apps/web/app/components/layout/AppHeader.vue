<script setup lang="ts">
import { ArrowRight, Menu, X } from 'lucide-vue-next'

const { whatsappHref, onWhatsAppClick } = useWhatsapp()

const navLinks = [
  { label: 'Empreendimentos', href: '/empreendimentos' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Cases', href: '/#cases' },
  { label: 'Contato', href: '/#contato' },
]

const mobileOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function closeMobileMenu() {
  mobileOpen.value = false
}

function onMobileWhatsAppClick() {
  onWhatsAppClick('header_mobile')
  closeMobileMenu()
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-colors duration-200"
    :class="scrolled ? 'header-bar-scrolled' : 'header-bar'"
  >
    <div class="container-page">
      <nav
        class="flex h-[4.5rem] items-center justify-between sm:h-20"
        aria-label="Navegação principal"
      >
        <LayoutAppLogo variant="header" />

        <div class="hidden items-center gap-8 lg:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            class="focus-ring rounded-sm text-sm font-medium tracking-wide text-text-on-dark-muted transition-colors duration-150 hover:text-brand-gold-light py-1"
            :to="link.href"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <a
            :href="whatsappHref"
            class="focus-ring hidden sm:inline-flex items-center gap-2 rounded-sm border border-primary/40 bg-surface-dark-raised px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary transition-colors duration-150 hover:bg-primary hover:text-ink"
            target="_blank"
            rel="noopener noreferrer"
            @click="onWhatsAppClick('header')"
          >
            Falar no WhatsApp
            <ArrowRight class="size-3.5" aria-hidden="true" />
          </a>

          <NuxtLink
            to="/#contato"
            class="hidden sm:flex items-center"
            aria-label="Stefanny Gutierres - Perfil"
          >
            <img
              src="/img/consultora.webp"
              alt="Stefanny Gutierres"
              class="size-8 rounded-full object-cover ring-1 ring-primary/50"
            />
          </NuxtLink>

          <button
            class="focus-ring grid size-10 place-items-center rounded-sm text-brand-gold-light lg:hidden"
            type="button"
            aria-label="Abrir menu"
            @click="mobileOpen = true"
          >
            <Menu class="size-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </div>

    <div v-if="mobileOpen" class="fixed inset-0 z-50 bg-ink/95 backdrop-blur-xl lg:hidden">
      <div
        class="relative ml-auto flex h-full w-full max-w-sm flex-col overflow-hidden p-6 text-white shadow-soft justify-between"
        style="background: linear-gradient(160deg, #0a0a0a 0%, #110f0d 40%, #161310 100%)"
      >
        <div
          class="pointer-events-none absolute inset-x-0 top-0 h-px"
          style="background: linear-gradient(90deg, transparent, #c5a059, transparent)"
          aria-hidden="true"
        />

        <div>
          <div class="flex items-center justify-between">
            <LayoutAppLogo variant="header" />
            <button
              class="focus-ring grid size-10 place-items-center rounded-sm bg-white/5 text-primary"
              type="button"
              aria-label="Fechar menu"
              @click="mobileOpen = false"
            >
              <X class="size-5" aria-hidden="true" />
            </button>
          </div>

          <div class="mt-8 flex flex-col gap-4 py-4">
            <span
              class="text-[11px] font-semibold uppercase tracking-[0.25em] text-text-on-dark-muted"
            >
              Navegação Exclusiva
            </span>
            <NuxtLink
              v-for="link in navLinks"
              :key="link.href"
              class="focus-ring rounded-sm font-display text-2xl text-text-on-dark transition-colors hover:text-primary"
              :to="link.href"
              @click="closeMobileMenu"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex flex-col gap-4 border-t border-stroke-dark/60 pt-4">
          <div class="space-y-1">
            <p class="text-[11px] uppercase tracking-wider text-text-on-dark-muted font-semibold">
              Private Real Estate Advisory
            </p>
            <p class="text-xs text-text-muted">Curadoria direta com incorporadoras autorizadas.</p>
          </div>
          <a
            :href="whatsappHref"
            class="focus-ring inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold text-ink shadow-lg transition-all hover:bg-primary-hover active:scale-[0.98]"
            target="_blank"
            rel="noopener noreferrer"
            @click="onMobileWhatsAppClick"
          >
            Falar no WhatsApp
            <ArrowRight class="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
