<script setup lang="ts">
import { ArrowRight, Menu, X } from 'lucide-vue-next'

const { whatsappHref } = useWhatsapp()

const navLinks = [
  { label: 'Empreendimentos', href: '/#empreendimentos' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Depoimentos', href: '/#depoimentos' },
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
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
    :class="scrolled ? 'header-bar-scrolled' : 'header-bar'"
  >
    <div class="container-page">
      <nav class="flex h-[4.5rem] items-center justify-between sm:h-20" aria-label="Navegação principal">
        <LayoutAppLogo variant="header" />

        <div class="hidden items-center gap-8 lg:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            class="focus-ring rounded-md text-sm font-medium tracking-wide text-white/75 transition hover:text-[#e5c48b]"
            :to="link.href"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <a
          :href="whatsappHref"
          class="focus-ring hidden items-center gap-2 rounded-md border border-[#c5a059]/40 bg-[#c5a059]/10 px-5 py-2.5 text-sm font-semibold text-[#e5c48b] transition hover:border-[#e5c48b]/60 hover:bg-[#c5a059]/15 lg:inline-flex"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fale comigo
          <ArrowRight class="size-4" aria-hidden="true" />
        </a>

        <button
          class="focus-ring grid size-10 place-items-center rounded-md text-[#e5c48b] lg:hidden"
          type="button"
          aria-label="Abrir menu"
          @click="mobileOpen = true"
        >
          <Menu class="size-6" aria-hidden="true" />
        </button>
      </nav>
    </div>

    <div v-if="mobileOpen" class="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm lg:hidden">
      <div
        class="relative ml-auto flex h-full w-full max-w-sm flex-col overflow-hidden p-6 text-white shadow-soft"
        style="background: linear-gradient(160deg, #0a0a0a 0%, #110f0d 40%, #161310 100%)"
      >
        <div
          class="pointer-events-none absolute inset-x-0 top-0 h-px"
          style="background: linear-gradient(90deg, transparent, #e5c48b, transparent)"
          aria-hidden="true"
        />

        <div class="flex items-center justify-between">
          <LayoutAppLogo variant="header" />
          <button
            class="focus-ring grid size-10 place-items-center rounded-md bg-white/5 text-[#e5c48b]"
            type="button"
            aria-label="Fechar menu"
            @click="mobileOpen = false"
          >
            <X class="size-5" aria-hidden="true" />
          </button>
        </div>

        <div class="mt-10 grid gap-4">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            class="focus-ring rounded-md py-2 text-lg font-medium text-white/85 transition hover:text-[#e5c48b]"
            :to="link.href"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <a
          :href="whatsappHref"
          class="focus-ring mt-auto inline-flex items-center justify-center gap-2 rounded-md px-6 py-4 font-semibold text-ink transition hover:opacity-90"
          style="background: linear-gradient(135deg, #e5c48b 0%, #c5a059 50%, #a8854a 100%)"
          target="_blank"
          rel="noopener noreferrer"
          @click="closeMobileMenu"
        >
          Fale comigo
          <ArrowRight class="size-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </header>
</template>
