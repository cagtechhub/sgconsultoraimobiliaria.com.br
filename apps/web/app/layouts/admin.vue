<script setup lang="ts">
const route = useRoute()
const { logout } = useAdminApi()

const links = [
  { to: '/admin', label: 'Visão geral', exact: true },
  { to: '/admin/imoveis', label: 'Imóveis' },
  { to: '/admin/categorias', label: 'Categorias' },
  { to: '/admin/leads', label: 'Leads' },
  { to: '/admin/cases', label: 'Cases vendidos' },
  { to: '/admin/configuracoes', label: 'Configurações' },
]

const isActive = (to: string, exact = false) => {
  if (exact) return route.path === to
  return route.path === to || route.path.startsWith(`${to}/`)
}

const onLogout = async () => {
  await logout()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#f7f4ef] text-ink">
    <header class="border-b border-brand-200/60 bg-[#11100e] text-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-brand-300">Painel</p>
          <h1 class="font-display text-xl text-white">Gutierres Admin</h1>
        </div>
        <nav class="flex flex-wrap items-center gap-2">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-full px-3 py-1.5 text-sm transition"
            :class="
              isActive(link.to, link.exact)
                ? 'bg-brand-500/20 text-brand-200'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            "
          >
            {{ link.label }}
          </NuxtLink>
          <button
            type="button"
            class="rounded-full border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/5"
            @click="onLogout"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-5 py-8">
      <slot />
    </main>
  </div>
</template>
