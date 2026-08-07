<script setup lang="ts">
import type { Property, PropertyStatus } from '@gutierres/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const properties = ref<Property[]>([])
const error = ref('')
const loading = ref(true)

const statusLabel: Record<PropertyStatus, string> = {
  LAUNCH: 'Lançamento',
  UNDER_CONSTRUCTION: 'Em construção',
  READY: 'Pronto para morar',
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    properties.value = await api.listProperties()
  } catch {
    error.value = 'Não foi possível carregar os imóveis.'
  } finally {
    loading.value = false
  }
}

const onDelete = async (item: Property) => {
  if (!confirm(`Excluir "${item.title}"?`)) return
  await api.removeProperty(item.id)
  await load()
}

await load()
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="font-display text-3xl">Imóveis</h2>
        <p class="mt-1 text-sm text-ink/60">Empreendimentos, unidades e imagens.</p>
      </div>
      <NuxtLink
        to="/admin/imoveis/novo"
        class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
      >
        Novo imóvel
      </NuxtLink>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-ink/50">Carregando…</p>

    <div v-else class="overflow-hidden rounded-2xl border border-brand-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-brand-100 bg-brand-50/60 text-xs uppercase tracking-wider text-ink/50">
          <tr>
            <th class="px-4 py-3">Título</th>
            <th class="px-4 py-3">Categoria</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Unidades</th>
            <th class="px-4 py-3">Mídias</th>
            <th class="px-4 py-3">Pub.</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in properties" :key="item.id" class="border-b border-brand-50 last:border-0">
            <td class="px-4 py-3">
              <p class="font-medium">{{ item.title }}</p>
              <p class="text-xs text-ink/50">{{ item.slug }}</p>
            </td>
            <td class="px-4 py-3">{{ item.category?.name || '—' }}</td>
            <td class="px-4 py-3">{{ statusLabel[item.status] }}</td>
            <td class="px-4 py-3">{{ item.availableUnits }}</td>
            <td class="px-4 py-3">{{ item.media.length }}</td>
            <td class="px-4 py-3">{{ item.published ? 'Sim' : 'Não' }}</td>
            <td class="px-4 py-3 text-right">
              <NuxtLink :to="`/admin/imoveis/${item.id}`" class="text-brand-700 hover:underline">
                Editar
              </NuxtLink>
              <button type="button" class="ml-3 text-red-600 hover:underline" @click="onDelete(item)">
                Excluir
              </button>
            </td>
          </tr>
          <tr v-if="properties.length === 0">
            <td colspan="7" class="px-4 py-8 text-center text-ink/50">Nenhum imóvel cadastrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
