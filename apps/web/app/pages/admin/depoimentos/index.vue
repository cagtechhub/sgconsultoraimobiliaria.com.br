<script setup lang="ts">
import type { Testimonial } from '@gutierres/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const items = ref<Testimonial[]>([])
const error = ref('')
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  name: '',
  role: '',
  quote: '',
  rating: 5,
  sortOrder: 0,
  active: true,
})

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.role = ''
  form.quote = ''
  form.rating = 5
  form.sortOrder = 0
  form.active = true
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    items.value = await api.listTestimonials()
  } catch {
    error.value = 'Não foi possível carregar os depoimentos.'
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (item: Testimonial) => {
  editingId.value = item.id
  form.name = item.name
  form.role = item.role
  form.quote = item.quote
  form.rating = item.rating
  form.sortOrder = item.sortOrder
  form.active = item.active
  showForm.value = true
}

const onSubmit = async () => {
  saving.value = true
  error.value = ''
  try {
    const payload = {
      name: form.name,
      role: form.role,
      quote: form.quote,
      rating: Number(form.rating) || 5,
      sortOrder: Number(form.sortOrder) || 0,
      active: form.active,
    }
    if (editingId.value) {
      await api.updateTestimonial(editingId.value, payload)
    } else {
      await api.createTestimonial(payload)
    }
    showForm.value = false
    resetForm()
    await load()
  } catch {
    error.value = 'Falha ao salvar depoimento.'
  } finally {
    saving.value = false
  }
}

const onDelete = async (item: Testimonial) => {
  if (!confirm(`Excluir depoimento de "${item.name}"?`)) return
  await api.removeTestimonial(item.id)
  await load()
}

await load()
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="font-display text-3xl">Depoimentos</h2>
        <p class="mt-1 text-sm text-ink/60">Exibidos na seção de depoimentos da home.</p>
      </div>
      <button
        type="button"
        class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
        @click="openCreate"
      >
        Novo depoimento
      </button>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-ink/50">Carregando…</p>

    <form
      v-if="showForm"
      class="space-y-4 rounded-2xl border border-brand-200 bg-white p-6"
      @submit.prevent="onSubmit"
    >
      <h3 class="font-display text-xl">{{ editingId ? 'Editar' : 'Novo' }} depoimento</h3>
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block text-sm">
          Nome
          <input v-model="form.name" required class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          Papel / contexto
          <input v-model="form.role" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
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
          Nota (1–5)
          <input
            v-model.number="form.rating"
            type="number"
            min="1"
            max="5"
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
        <label class="inline-flex items-center gap-2 text-sm">
          <input v-model="form.active" type="checkbox" />
          Ativo
        </label>
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
          @click="showForm = false; resetForm()"
        >
          Cancelar
        </button>
      </div>
    </form>

    <div v-if="!loading" class="overflow-hidden rounded-2xl border border-brand-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-brand-100 bg-brand-50/60 text-xs uppercase tracking-wider text-ink/50">
          <tr>
            <th class="px-4 py-3">Nome</th>
            <th class="px-4 py-3">Ordem</th>
            <th class="px-4 py-3">Nota</th>
            <th class="px-4 py-3">Ativo</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-b border-brand-50 last:border-0">
            <td class="px-4 py-3">
              <p class="font-medium">{{ item.name }}</p>
              <p class="line-clamp-1 text-xs text-ink/50">{{ item.quote }}</p>
            </td>
            <td class="px-4 py-3">{{ item.sortOrder }}</td>
            <td class="px-4 py-3">{{ item.rating }}</td>
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
      <p v-if="!items.length" class="px-4 py-6 text-sm text-ink/50">Nenhum depoimento cadastrado.</p>
    </div>
  </div>
</template>
