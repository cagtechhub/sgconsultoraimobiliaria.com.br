<script setup lang="ts">
import type { PropertyCategory } from '@gutierres/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const categories = ref<PropertyCategory[]>([])
const error = ref('')
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const editingId = ref<string | null>(null)
const slugManual = ref(false)

const form = reactive({
  name: '',
  slug: '',
  description: '',
  sortOrder: 0,
  active: true,
})

const modalTitle = computed(() => (editingId.value ? 'Editar categoria' : 'Nova categoria'))

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

watch(
  () => form.name,
  (name) => {
    if (!slugManual.value) form.slug = toSlug(name)
  },
)

const resetForm = () => {
  editingId.value = null
  slugManual.value = false
  form.name = ''
  form.slug = ''
  form.description = ''
  form.sortOrder = 0
  form.active = true
}

const closeForm = () => {
  showForm.value = false
  resetForm()
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    categories.value = await api.listCategories()
  } catch {
    error.value = 'Não foi possível carregar as categorias.'
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (item: PropertyCategory) => {
  editingId.value = item.id
  slugManual.value = true
  form.name = item.name
  form.slug = item.slug
  form.description = item.description ?? ''
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
      slug: form.slug || toSlug(form.name),
      description: form.description || null,
      sortOrder: Number(form.sortOrder) || 0,
      active: form.active,
    }
    if (editingId.value) {
      await api.updateCategory(editingId.value, payload)
    } else {
      await api.createCategory(payload)
    }
    closeForm()
    await load()
  } catch {
    error.value = 'Falha ao salvar categoria.'
  } finally {
    saving.value = false
  }
}

const onDelete = async (item: PropertyCategory) => {
  if (!confirm(`Excluir a categoria "${item.name}"?`)) return
  await api.removeCategory(item.id)
  await load()
}

const onBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) closeForm()
}

const onEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showForm.value) closeForm()
}

onMounted(() => window.addEventListener('keydown', onEscape))
onUnmounted(() => window.removeEventListener('keydown', onEscape))

await load()
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="font-display text-3xl">Categorias</h2>
        <p class="mt-1 text-sm text-ink/60">Organize os empreendimentos por categoria.</p>
      </div>
      <button
        type="button"
        class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
        @click="openCreate"
      >
        Nova categoria
      </button>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-ink/50">Carregando…</p>

    <div v-else class="overflow-hidden rounded-2xl border border-brand-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-brand-100 bg-brand-50/60 text-xs uppercase tracking-wider text-ink/50">
          <tr>
            <th class="px-4 py-3">Nome</th>
            <th class="px-4 py-3">Slug</th>
            <th class="px-4 py-3">Ordem</th>
            <th class="px-4 py-3">Ativa</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categories" :key="item.id" class="border-b border-brand-50 last:border-0">
            <td class="px-4 py-3 font-medium">{{ item.name }}</td>
            <td class="px-4 py-3 text-ink/60">{{ item.slug }}</td>
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
          <tr v-if="categories.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-ink/50">Nenhuma categoria cadastrada.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 sm:pt-16"
        @click="onBackdropClick"
      >
        <div
          class="mb-10 w-full max-w-lg overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-soft"
          role="dialog"
          aria-modal="true"
          :aria-label="modalTitle"
        >
          <div class="flex items-center justify-between border-b border-brand-100 px-5 py-4">
            <h3 class="font-display text-xl text-ink">{{ modalTitle }}</h3>
            <button
              type="button"
              class="grid size-8 place-items-center rounded-full text-xl text-ink/50 hover:bg-brand-50"
              aria-label="Fechar"
              @click="closeForm"
            >
              ×
            </button>
          </div>

          <form class="grid gap-4 p-5 sm:grid-cols-2" @submit.prevent="onSubmit">
            <label class="block text-sm text-ink/70">
              Nome
              <input
                v-model="form.name"
                required
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
              />
            </label>
            <label class="block text-sm text-ink/70">
              Slug
              <input
                v-model="form.slug"
                required
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
                @input="slugManual = true"
              />
            </label>
            <label class="block text-sm text-ink/70 sm:col-span-2">
              Descrição
              <textarea
                v-model="form.description"
                rows="3"
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
              />
            </label>
            <label class="block text-sm text-ink/70">
              Ordem
              <input
                v-model.number="form.sortOrder"
                type="number"
                min="0"
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
              />
            </label>
            <label class="mt-7 inline-flex items-center gap-2 text-sm text-ink/70">
              <input v-model="form.active" type="checkbox" />
              Ativa
            </label>
            <div class="flex justify-end gap-2 sm:col-span-2">
              <button
                type="button"
                class="rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-ink hover:bg-brand-50"
                @click="closeForm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
                :disabled="saving"
              >
                {{ saving ? 'Salvando…' : editingId ? 'Salvar' : 'Criar categoria' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
