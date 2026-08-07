<script setup lang="ts">
import { createPropertySchema, type PropertyCategory, type PropertyStatus } from '@gutierres/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const error = ref('')
const loading = ref(false)
const slugManual = ref(false)
const categories = ref<PropertyCategory[]>(await api.listCategories().catch(() => []))

const form = reactive({
  title: '',
  slug: '',
  description: '',
  location: '',
  status: 'LAUNCH' as PropertyStatus,
  constructionStartDate: '',
  constructionEndDate: '',
  availableUnits: 0,
  featured: false,
  published: true,
  categoryId: '',
})

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

watch(
  () => form.title,
  (title) => {
    if (!slugManual.value) {
      form.slug = toSlug(title)
    }
  }
)

const onSlugInput = () => {
  slugManual.value = true
}

const formatError = (e: unknown) => {
  if (e && typeof e === 'object' && 'data' in e) {
    const data = (e as { data?: { message?: string; issues?: Record<string, string[]> } }).data
    if (data?.message) return data.message
    if (data?.issues) {
      return Object.entries(data.issues)
        .flatMap(([field, msgs]) => (msgs || []).map((m) => `${field}: ${m}`))
        .join(' · ')
    }
  }
  if (e instanceof Error && e.message) return e.message
  return 'Não foi possível criar o imóvel. Verifique os campos.'
}

const onSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    const payload = createPropertySchema.parse({
      title: form.title,
      slug: form.slug || toSlug(form.title),
      description: form.description,
      location: form.location,
      status: form.status,
      constructionStartDate: form.constructionStartDate || null,
      constructionEndDate: form.constructionEndDate || null,
      availableUnits: Number(form.availableUnits) || 0,
      featured: form.featured,
      published: form.published,
      categoryId: form.categoryId || null,
    })
    const created = await api.createProperty(payload)
    await navigateTo(`/admin/imoveis/${created.id}`)
  } catch (e: unknown) {
    error.value = formatError(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div>
      <NuxtLink to="/admin/imoveis" class="text-sm text-brand-700 hover:underline">← Voltar</NuxtLink>
      <h2 class="mt-2 font-display text-3xl">Novo imóvel</h2>
    </div>

    <form class="space-y-4 rounded-2xl border border-brand-200 bg-white p-6" @submit.prevent="onSubmit">
      <label class="block text-sm">
        Título
        <input v-model="form.title" required class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
      </label>
      <label class="block text-sm">
        Slug
        <input
          v-model="form.slug"
          required
          class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          @input="onSlugInput"
        />
      </label>
      <label class="block text-sm">
        Localização
        <input v-model="form.location" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
      </label>
      <label class="block text-sm">
        Categoria
        <select v-model="form.categoryId" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2">
          <option value="">Sem categoria</option>
          <option v-for="cat in categories.filter((c) => c.active)" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </label>
      <label class="block text-sm">
        Descrição
        <textarea
          v-model="form.description"
          required
          rows="6"
          minlength="10"
          class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
        />
      </label>
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block text-sm">
          Status
          <select v-model="form.status" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2">
            <option value="LAUNCH">Lançamento</option>
            <option value="UNDER_CONSTRUCTION">Em construção</option>
            <option value="READY">Pronto para morar</option>
          </select>
        </label>
        <label class="block text-sm">
          Unidades disponíveis
          <input
            v-model.number="form.availableUnits"
            type="number"
            min="0"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
        <label class="block text-sm">
          Início da obra
          <input
            v-model="form.constructionStartDate"
            type="date"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
        <label class="block text-sm">
          Conclusão
          <input
            v-model="form.constructionEndDate"
            type="date"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
      </div>
      <div class="flex gap-6 text-sm">
        <label class="inline-flex items-center gap-2">
          <input v-model="form.featured" type="checkbox" />
          Destaque
        </label>
        <label class="inline-flex items-center gap-2">
          <input v-model="form.published" type="checkbox" />
          Publicado
        </label>
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button
        type="submit"
        class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
        :disabled="loading"
      >
        {{ loading ? 'Salvando…' : 'Criar imóvel' }}
      </button>
    </form>
  </div>
</template>
