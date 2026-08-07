<script setup lang="ts">
import type {
  Property,
  PropertyCategory,
  PropertyMedia,
  PropertyStatus,
  UpdatePropertyInput,
} from '@gutierres/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const route = useRoute()
const api = useAdminApi()
const id = computed(() => String(route.params.id))

const property = ref<Property | null>(null)
const categories = ref<PropertyCategory[]>([])
const mediaItems = ref<PropertyMedia[]>([])
const error = ref('')
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const dragFrom = ref<number | null>(null)

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

const toDateInput = (value?: Date | string | null) => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  return date.toISOString().slice(0, 10)
}

const kindLabel = {
  IMAGE: 'Imagem',
  VIDEO: 'Vídeo',
  DOCUMENT: 'Documento',
} as const

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    ;[property.value, categories.value] = await Promise.all([
      api.getProperty(id.value),
      api.listCategories(),
    ])
    mediaItems.value = [...property.value.media].sort((a, b) => a.sortOrder - b.sortOrder)
    form.title = property.value.title
    form.slug = property.value.slug
    form.description = property.value.description
    form.location = property.value.location
    form.status = property.value.status
    form.constructionStartDate = toDateInput(property.value.constructionStartDate)
    form.constructionEndDate = toDateInput(property.value.constructionEndDate)
    form.availableUnits = property.value.availableUnits
    form.featured = property.value.featured
    form.published = property.value.published
    form.categoryId = property.value.categoryId ?? ''
  } catch {
    error.value = 'Imóvel não encontrado.'
  } finally {
    loading.value = false
  }
}

const onSave = async () => {
  saving.value = true
  error.value = ''
  try {
    const payload: UpdatePropertyInput = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      location: form.location,
      status: form.status,
      constructionStartDate: form.constructionStartDate ? new Date(form.constructionStartDate) : null,
      constructionEndDate: form.constructionEndDate ? new Date(form.constructionEndDate) : null,
      availableUnits: Number(form.availableUnits) || 0,
      featured: form.featured,
      published: form.published,
      categoryId: form.categoryId || null,
    }
    property.value = await api.updateProperty(id.value, payload)
  } catch {
    error.value = 'Falha ao salvar.'
  } finally {
    saving.value = false
  }
}

const onUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return
  uploading.value = true
  error.value = ''
  try {
    for (const file of Array.from(files)) {
      await api.uploadPropertyMedia(id.value, file)
    }
    await load()
  } catch {
    error.value = 'Falha no upload. Aceitos: imagens, vídeos (mp4/webm), PDF e DOCX.'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

const onRemoveMedia = async (mediaId: string) => {
  if (!confirm('Remover este arquivo?')) return
  await api.removePropertyMedia(id.value, mediaId)
  await load()
}

const onSetCover = async (mediaId: string) => {
  error.value = ''
  try {
    await api.setPropertyCoverMedia(id.value, mediaId)
    await load()
  } catch {
    error.value = 'Só imagens podem ser capa do empreendimento.'
  }
}

const persistOrder = async () => {
  const mediaIds = mediaItems.value.map((m) => m.id)
  await api.reorderPropertyMedia(id.value, mediaIds)
  mediaItems.value = mediaItems.value.map((item, index) => ({ ...item, sortOrder: index }))
}

const onDragStart = (index: number) => {
  dragFrom.value = index
}

const onDrop = async (index: number) => {
  if (dragFrom.value === null || dragFrom.value === index) return
  const next = [...mediaItems.value]
  const [moved] = next.splice(dragFrom.value, 1)
  if (!moved) return
  next.splice(index, 0, moved)
  mediaItems.value = next
  dragFrom.value = null
  try {
    await persistOrder()
  } catch {
    error.value = 'Falha ao reordenar mídias.'
    await load()
  }
}

await load()
</script>

<template>
  <div class="space-y-6">
    <div>
      <NuxtLink to="/admin/imoveis" class="text-sm text-brand-700 hover:underline">← Voltar</NuxtLink>
      <h2 class="mt-2 font-display text-3xl">{{ property?.title || 'Editar imóvel' }}</h2>
    </div>

    <p v-if="loading" class="text-sm text-ink/50">Carregando…</p>
    <p v-else-if="error && !property" class="text-sm text-red-600">{{ error }}</p>

    <template v-else-if="property">
      <form class="space-y-4 rounded-2xl border border-brand-200 bg-white p-6" @submit.prevent="onSave">
        <label class="block text-sm">
          Título
          <input v-model="form.title" required class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          Slug
          <input v-model="form.slug" required class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          Localização
          <input v-model="form.location" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          Categoria
          <select v-model="form.categoryId" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2">
            <option value="">Sem categoria</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </label>
        <label class="block text-sm">
          Descrição
          <textarea
            v-model="form.description"
            required
            rows="6"
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
          :disabled="saving"
        >
          {{ saving ? 'Salvando…' : 'Salvar alterações' }}
        </button>
      </form>

      <section class="rounded-2xl border border-brand-200 bg-white p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-display text-xl">Mídias</h3>
            <p class="text-xs text-ink/50">
              Imagens, vídeos, PDF e DOCX. Arraste para reordenar. Defina a capa (somente imagem).
            </p>
          </div>
          <label
            class="cursor-pointer rounded-full border border-brand-300 px-4 py-2 text-sm font-medium hover:bg-brand-50"
          >
            {{ uploading ? 'Enviando…' : 'Adicionar arquivos' }}
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/webm,video/quicktime,application/pdf,.pdf,.docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              class="hidden"
              :disabled="uploading"
              @change="onUpload"
            />
          </label>
        </div>

        <div
          v-if="mediaItems.length"
          class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <article
            v-for="(item, index) in mediaItems"
            :key="item.id"
            draggable="true"
            class="group overflow-hidden rounded-xl border bg-brand-50/20 transition"
            :class="item.isCover ? 'border-brand-500 ring-2 ring-brand-300/50' : 'border-brand-100'"
            @dragstart="onDragStart(index)"
            @dragover.prevent
            @drop.prevent="onDrop(index)"
          >
            <div class="relative flex h-40 items-center justify-center bg-[#11100e]/5">
              <img
                v-if="item.kind === 'IMAGE'"
                :src="item.url"
                :alt="item.fileName"
                class="h-full w-full object-cover"
              />
              <video
                v-else-if="item.kind === 'VIDEO'"
                :src="item.url"
                class="h-full w-full object-cover"
                muted
                playsinline
                controls
              />
              <div v-else class="px-4 text-center">
                <p class="text-sm font-semibold text-brand-800">{{ kindLabel.DOCUMENT }}</p>
                <a
                  :href="item.url"
                  target="_blank"
                  rel="noopener"
                  class="mt-1 block truncate text-xs text-brand-700 hover:underline"
                >
                  {{ item.fileName }}
                </a>
              </div>
              <span
                v-if="item.isCover"
                class="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
              >
                Capa
              </span>
              <span
                class="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white"
              >
                {{ kindLabel[item.kind] }}
              </span>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs text-ink/60">
              <span class="cursor-grab select-none" title="Arraste para reordenar">⠿ #{{ index + 1 }}</span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-if="item.kind === 'IMAGE' && !item.isCover"
                  type="button"
                  class="text-brand-700 hover:underline"
                  @click="onSetCover(item.id)"
                >
                  Definir capa
                </button>
                <a :href="item.url" target="_blank" rel="noopener" class="hover:underline">Abrir</a>
                <button type="button" class="text-red-600 hover:underline" @click="onRemoveMedia(item.id)">
                  Remover
                </button>
              </div>
            </div>
          </article>
        </div>
        <p v-else class="mt-4 text-sm text-ink/50">Nenhuma mídia enviada.</p>
      </section>
    </template>
  </div>
</template>
