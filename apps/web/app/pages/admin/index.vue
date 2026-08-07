<script setup lang="ts">
import type { LeadChannel, LeadStatus, PropertyStatus } from '@gutierres/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const properties = ref(await api.listProperties().catch(() => []))
const leads = ref(await api.listLeads().catch(() => []))

const stats = computed(() => ({
  properties: properties.value.length,
  published: properties.value.filter((p) => p.published).length,
  units: properties.value.reduce((sum, p) => sum + p.availableUnits, 0),
  leads: leads.value.length,
  newLeads: leads.value.filter((l) => l.status === 'NEW').length,
}))

const latestProperties = computed(() =>
  [...properties.value]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
)

const latestLeads = computed(() =>
  [...leads.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
)

const statusLabel: Record<PropertyStatus, string> = {
  LAUNCH: 'Lançamento',
  UNDER_CONSTRUCTION: 'Em construção',
  READY: 'Pronto para morar',
}

const channelLabel: Record<LeadChannel, string> = {
  WEBSITE: 'Site',
  ADSENSE: 'AdSense',
  WHATSAPP: 'WhatsApp',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  REFERRAL: 'Indicação',
  OTHER: 'Outro',
}

const leadStatusLabel: Record<LeadStatus, string> = {
  NEW: 'Novo',
  CONTACTED: 'Contatado',
  QUALIFIED: 'Qualificado',
  CONVERTED: 'Convertido',
  LOST: 'Perdido',
}

const formatDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="font-display text-3xl">Visão geral</h2>
      <p class="mt-1 text-sm text-ink/60">Gestão de empreendimentos e leads captados.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-brand-200 bg-white p-5">
        <p class="text-xs uppercase tracking-wider text-ink/50">Imóveis</p>
        <p class="mt-2 text-3xl font-semibold">{{ stats.properties }}</p>
      </div>
      <div class="rounded-2xl border border-brand-200 bg-white p-5">
        <p class="text-xs uppercase tracking-wider text-ink/50">Publicados</p>
        <p class="mt-2 text-3xl font-semibold">{{ stats.published }}</p>
      </div>
      <div class="rounded-2xl border border-brand-200 bg-white p-5">
        <p class="text-xs uppercase tracking-wider text-ink/50">Unidades disponíveis</p>
        <p class="mt-2 text-3xl font-semibold">{{ stats.units }}</p>
      </div>
      <div class="rounded-2xl border border-brand-200 bg-white p-5">
        <p class="text-xs uppercase tracking-wider text-ink/50">Leads novos</p>
        <p class="mt-2 text-3xl font-semibold">{{ stats.newLeads }} / {{ stats.leads }}</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <NuxtLink
        to="/admin/imoveis/novo"
        class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
      >
        Novo imóvel
      </NuxtLink>
      <NuxtLink
        to="/admin/leads"
        class="rounded-full border border-brand-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-50"
      >
        Ver leads
      </NuxtLink>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <section class="rounded-2xl border border-brand-200 bg-white">
        <div class="flex items-center justify-between border-b border-brand-100 px-5 py-4">
          <div>
            <h3 class="font-display text-xl">Últimos imóveis</h3>
            <p class="text-xs text-ink/50">5 mais recentes por atualização</p>
          </div>
          <NuxtLink to="/admin/imoveis" class="text-sm text-brand-700 hover:underline">Ver todos</NuxtLink>
        </div>
        <ul v-if="latestProperties.length" class="divide-y divide-brand-50">
          <li v-for="item in latestProperties" :key="item.id">
            <NuxtLink
              :to="`/admin/imoveis/${item.id}`"
              class="flex items-start justify-between gap-3 px-5 py-3.5 transition hover:bg-brand-50/50"
            >
              <div class="min-w-0">
                <p class="truncate font-medium">{{ item.title }}</p>
                <p class="mt-0.5 text-xs text-ink/50">
                  {{ item.category?.name || 'Sem categoria' }} · {{ statusLabel[item.status] }}
                </p>
              </div>
              <span class="shrink-0 text-xs text-ink/40">{{ formatDate(item.updatedAt) }}</span>
            </NuxtLink>
          </li>
        </ul>
        <p v-else class="px-5 py-8 text-center text-sm text-ink/50">Nenhum imóvel cadastrado.</p>
      </section>

      <section class="rounded-2xl border border-brand-200 bg-white">
        <div class="flex items-center justify-between border-b border-brand-100 px-5 py-4">
          <div>
            <h3 class="font-display text-xl">Últimos leads</h3>
            <p class="text-xs text-ink/50">5 mais recentes por criação</p>
          </div>
          <NuxtLink to="/admin/leads" class="text-sm text-brand-700 hover:underline">Ver todos</NuxtLink>
        </div>
        <ul v-if="latestLeads.length" class="divide-y divide-brand-50">
          <li
            v-for="lead in latestLeads"
            :key="lead.id"
            class="flex items-start justify-between gap-3 px-5 py-3.5"
          >
            <div class="min-w-0">
              <p class="truncate font-medium">{{ lead.fullName }}</p>
              <p class="mt-0.5 text-xs text-ink/50">
                {{ channelLabel[lead.channel] }} · {{ leadStatusLabel[lead.status] }}
                <span v-if="lead.email"> · {{ lead.email }}</span>
              </p>
            </div>
            <span class="shrink-0 text-xs text-ink/40">{{ formatDate(lead.createdAt) }}</span>
          </li>
        </ul>
        <p v-else class="px-5 py-8 text-center text-sm text-ink/50">Nenhum lead ainda.</p>
      </section>
    </div>
  </div>
</template>
