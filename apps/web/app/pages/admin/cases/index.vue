<script setup lang="ts">
import type { SoldCase } from '@gutierres/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth', 
})

const api = useAdminApi()
const items = ref<SoldCase[]>([])
const error = ref('')
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const showForm = ref(false)
const editingId = ref<string | null>(null)
const coverFileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  propertyTitle: '',
  location: '',
  coverUrl: '',
  clientName: '',
  clientRole: '',
  quote: '',
  soldAt: '',
  sortOrder: 0,
  active: true,
})

const editingItem = computed(() => items.value.find((item) => item.id === editingId.value) || null)

const resetForm = () => {
  editingId.value = null
  form.propertyTitle = ''
  form.location = ''
  form.coverUrl = ''
  form.clientName = ''
  form.clientRole = ''
  form.quote = ''
  form.soldAt = ''
  form.sortOrder = 0
  form.active = true
}

const toDateInput = (value: Date | string | null | undefined) => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    items.value = await api.listSoldCases()
  } catch {
    error.value = 'Não foi possível carregar os cases vendidos.'
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (item: SoldCase) => {
  editingId.value = item.id
  form.propertyTitle = item.propertyTitle
  form.location = item.location
  form.coverUrl = item.coverUrl || ''
  form.clientName = item.clientName
  form.clientRole = item.clientRole
  form.quote = item.quote
  form.soldAt = toDateInput(item.soldAt)
  form.sortOrder = item.sortOrder
  form.active = item.active
  showForm.value = true
}

const onSubmit = async () => {
  saving.value = true
  error.value = ''
  try {
    const payload = {
      propertyTitle: form.propertyTitle,
      location: form.location,
      coverUrl: form.coverUrl || null,
      clientName: form.clientName,
      clientRole: form.clientRole,
      quote: form.quote,
      soldAt: form.soldAt || null,
      sortOrder: Number(form.sortOrder) || 0,
      active: form.active,
    }
    if (editingId.value) {
      await api.updateSoldCase(editingId.value, payload)
    } else {
      const created = await api.createSoldCase(payload)
      editingId.value = created.id
    }
    await load()
    if (editingId.value) {
      const current = items.value.find((item) => item.id === editingId.value)
      if (current) openEdit(current)
    } else {
      showForm.value = false
      resetForm()
    }
  } catch {
    error.value = 'Falha ao salvar case vendido.'
  } finally {
    saving.value = false
  }
}

const onDelete = async (item: SoldCase) => {
  if (!confirm(`Excluir case "${item.propertyTitle}"?`)) return
  await api.removeSoldCase(item.id)
  if (editingId.value === item.id) {
    showForm.value = false
    resetForm()
  }
  await load()
}

const onCoverSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !editingId.value) return

  uploading.value = true
  error.value = ''
  try {
    const updated = await api.uploadSoldCaseCover(editingId.value, file)
    form.coverUrl = updated.coverUrl || ''
    await load()
  } catch {
    error.value = 'Falha ao enviar a imagem de capa.'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

const onRemoveCover = async () => {
  if (!editingId.value) return
  if (!confirm('Remover a imagem de capa?')) return
  uploading.value = true
  error.value = ''
  try {
    await api.removeSoldCaseCover(editingId.value)
    form.coverUrl = ''
    await load()
  } catch {
    error.value = 'Falha ao remover a capa.'
  } finally {
    uploading.value = false
  }
}

const formatSoldAt = (value: Date | string | null) => {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric',
  })
}

const closeForm = () => {
  showForm.value = false
  resetForm()
}

const triggerCoverPicker = () => {
  coverFileInput.value?.click()
}

await load()
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="font-display text-3xl">Cases vendidos</h2>
        <p class="mt-1 text-sm text-ink/60">
          Imóveis vendidos com depoimento do cliente, exibidos na home.
        </p>
      </div>
      <button
        type="button"
        class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
        @click="openCreate"
      >
        Novo case
      </button>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-ink/50">Carregando…</p>

    <form
      v-if="showForm"
      class="space-y-4 rounded-2xl border border-brand-200 bg-white p-6"
      @submit.prevent="onSubmit"
    >
      <h3 class="font-display text-xl">{{ editingId ? 'Editar' : 'Novo' }} case vendido</h3>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block text-sm">
          Título do imóvel
          <input
            v-model="form.propertyTitle"
            required
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
        <label class="block text-sm">
          Localização
          <input v-model="form.location" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          Nome do cliente
          <input
            v-model="form.clientName"
            required
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
        <label class="block text-sm">
          Papel / contexto
          <input
            v-model="form.clientRole"
            placeholder="Ex.: Compradora em Campinas"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
        <label class="block text-sm sm:col-span-2">
          Depoimento
          <textarea
            v-model="form.quote"
            required
            rows="4"
            minlength="10"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
        <label class="block text-sm">
          Data da venda
          <input
            v-model="form.soldAt"
            type="date"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
        <label class="block text-sm">
          Ordem
          <input
            v-model.number="form.sortOrder"
            type="number"
            min="0"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
        <label class="block text-sm sm:col-span-2">
          URL da capa (opcional)
          <input
            v-model="form.coverUrl"
            type="url"
            placeholder="https://…"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
        <label class="inline-flex items-center gap-2 text-sm">
          <input v-model="form.active" type="checkbox" />
          Ativo
        </label>
      </div>

      <div
        v-if="editingId"
        class="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 p-4"
      >
        <p class="text-sm font-medium text-ink">Imagem de capa</p>
        <p class="mt-1 text-xs text-ink/50">
          Salve o case primeiro para enviar o arquivo. Aceita apenas imagens.
        </p>
        <div v-if="editingItem?.coverUrl || form.coverUrl" class="mt-3 overflow-hidden rounded-lg">
          <img
            :src="editingItem?.coverUrl || form.coverUrl"
            alt="Capa do case"
            class="h-40 w-full object-cover"
          />
        </div>
        <div class="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            class="rounded-full border border-brand-300 px-4 py-2 text-sm font-medium hover:bg-brand-50 disabled:opacity-60"
            :disabled="uploading"
            @click="triggerCoverPicker"
          >
            {{ uploading ? 'Enviando…' : 'Enviar imagem' }}
          </button>
          <button
            v-if="editingItem?.coverUrl || form.coverUrl"
            type="button"
            class="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
            :disabled="uploading"
            @click="onRemoveCover"
          >
            Remover capa
          </button>
          <input
            ref="coverFileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onCoverSelected"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
          :disabled="saving"
        >
          {{ saving ? 'Salvando…' : 'Salvar' }}
        </button>
        <button
          type="button"
          class="rounded-full border border-brand-200 px-5 py-2.5 text-sm"
          @click="closeForm"
        >
          Cancelar
        </button>
      </div>
    </form>

    <div v-if="!loading" class="overflow-hidden rounded-2xl border border-brand-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-brand-100 bg-brand-50/60 text-xs uppercase tracking-wider text-ink/50">
          <tr>
            <th class="px-4 py-3">Imóvel</th>
            <th class="px-4 py-3">Cliente</th>
            <th class="px-4 py-3">Venda</th>
            <th class="px-4 py-3">Ordem</th>
            <th class="px-4 py-3">Ativo</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-b border-brand-50 last:border-0">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img
                  v-if="item.coverUrl"
                  :src="item.coverUrl"
                  :alt="item.propertyTitle"
                  class="size-12 rounded-lg object-cover"
                />
                <div class="min-w-0">
                  <p class="font-medium">{{ item.propertyTitle }}</p>
                  <p class="text-xs text-ink/50">{{ item.location || 'Sem localização' }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <p>{{ item.clientName }}</p>
              <p class="line-clamp-1 text-xs text-ink/50">{{ item.quote }}</p>
            </td>
            <td class="px-4 py-3">{{ formatSoldAt(item.soldAt) }}</td>
            <td class="px-4 py-3">{{ item.sortOrder }}</td>
            <td class="px-4 py-3">{{ item.active ? 'Sim' : 'Não' }}</td>
            <td class="px-4 py-3 text-right">
              <button type="button" class="text-brand-700 hover:underline" @click="openEdit(item)">
                Editar
              </button>
              <button type="button" class="ml-3 text-red-600 hover:underline" @click="onDelete(item)">
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!items.length" class="px-4 py-6 text-sm text-ink/50">Nenhum case cadastrado.</p>
    </div>
  </div>
</template>
