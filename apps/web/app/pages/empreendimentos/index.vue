<script setup lang="ts">
import { Filter, SearchX } from 'lucide-vue-next'
import type { Property, PropertyCategory, PropertyStatus } from '@gutierres/shared'
import type { Project } from '~/types/project'
import { mapPropertyToProject } from '~/utils/mapProperty'
import { useSchemaOrg } from '@unhead/schema-org/vue'

const settings = useSiteSettings()
const origin = usePublicSiteOrigin()

const listTitle = computed(() =>
  limitSeoText(`Empreendimentos | ${settings.siteName.value}`, 65),
)
const listDescription = computed(() =>
  limitSeoText(
    'Lista completa de empreendimentos com curadoria comercial. Filtre por categoria e disponibilidade.',
    160,
  ),
)
const listCanonical = computed(() => {
  const o = origin.value
  return o ? `${o}/empreendimentos` : ''
})

useSeoMeta({
  title: listTitle,
  description: listDescription,
  ogTitle: listTitle,
  ogDescription: listDescription,
  ogUrl: listCanonical,
  twitterTitle: listTitle,
  twitterDescription: listDescription,
})

useHead(() => ({
  link: listCanonical.value ? [{ rel: 'canonical', href: listCanonical.value }] : [],
}))

const route = useRoute()
const router = useRouter()
const baseUrl = useApiBase()

const statusOptions: { value: PropertyStatus | ''; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'LAUNCH', label: 'Lançamento' },
  { value: 'UNDER_CONSTRUCTION', label: 'Em construção' },
  { value: 'READY', label: 'Pronto para morar' },
]

const selectedCategory = computed({
  get: () => String(route.query.categoria || ''),
  set: (value: string) => {
    void router.replace({
      query: {
        ...route.query,
        categoria: value || undefined,
      },
    })
  },
})

const selectedStatus = computed({
  get: () => String(route.query.disponibilidade || ''),
  set: (value: string) => {
    void router.replace({
      query: {
        ...route.query,
        disponibilidade: value || undefined,
      },
    })
  },
})

const { data: categories } = await useAsyncData(
  'property-categories',
  () => $fetch<PropertyCategory[]>(`${baseUrl.value}/categories`),
  { default: () => [] },
)

const { data: projects, pending } = await useAsyncData(
  'properties-list',
  async () => {
    const category = String(route.query.categoria || '')
    const status = String(route.query.disponibilidade || '')
    const query = new URLSearchParams()
    if (category) query.set('category', category)
    if (status) query.set('status', status)
    const qs = query.toString()
    const items = await $fetch<Property[]>(
      `${baseUrl.value}/properties${qs ? `?${qs}` : ''}`,
    )
    return items.map(mapPropertyToProject)
  },
  {
    default: () => [] as Project[],
    watch: [() => route.query.categoria, () => route.query.disponibilidade],
  },
)

useSchemaOrg(() => {
  const listUrl = listCanonical.value || '/empreendimentos'
  const home = origin.value ? `${origin.value}/` : '/'
  const items = (projects.value || []).slice(0, 20).map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.title,
    url: origin.value
      ? `${origin.value}/empreendimentos/${item.slug}`
      : `/empreendimentos/${item.slug}`,
  }))

  return [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: home },
        { '@type': 'ListItem', position: 2, name: 'Empreendimentos', item: listUrl },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Empreendimentos',
      url: listUrl,
      numberOfItems: items.length,
      itemListElement: items,
    },
  ]
})

const resultLabel = computed(() => {
  const count = projects.value.length
  if (pending.value) return 'Buscando empreendimentos…'
  if (count === 0) return 'Nenhum empreendimento encontrado'
  if (count === 1) return '1 empreendimento encontrado'
  return `${count} empreendimentos encontrados`
})

function clearFilters() {
  void router.replace({ query: {} })
}

const hasActiveFilters = computed(() => Boolean(selectedCategory.value || selectedStatus.value))
</script>

<template>
  <main>
    <section class="relative overflow-hidden border-b border-slate-200/80 bg-ink text-white">
      <div
        class="pointer-events-none absolute inset-0 opacity-40"
        style="background: radial-gradient(ellipse at 20% 0%, #c5a05955 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, #e5c48b22 0%, transparent 45%)"
        aria-hidden="true"
      />
      <div class="container-page relative py-20 sm:py-24">
        <span class="section-kicker !text-[#e5c48b]">Empreendimentos</span>
        <h1 class="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          Todos os empreendimentos
        </h1>
        <p class="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
          Curadoria comercial com autorização das incorporadoras. Filtre por categoria e
          disponibilidade para encontrar a oportunidade certa.
        </p>
      </div>
    </section>

    <section class="bg-paper py-12 sm:py-16">
      <div class="container-page">
        <div
          class="rounded-lg border border-slate-200 bg-white p-4 shadow-card sm:p-5"
          role="search"
          aria-label="Filtros de empreendimentos"
        >
          <div class="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
            <Filter class="size-4 text-brand-600" aria-hidden="true" />
            Filtros
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <label class="block">
              <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Categoria
              </span>
              <select
                v-model="selectedCategory"
                class="focus-ring w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink"
              >
                <option value="">Todas</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.slug"
                >
                  {{ category.name }}
                </option>
              </select>
            </label>

            <label class="block">
              <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Disponibilidade
              </span>
              <select
                v-model="selectedStatus"
                class="focus-ring w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink"
              >
                <option
                  v-for="option in statusOptions"
                  :key="option.value || 'all'"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>

            <button
              type="button"
              class="focus-ring rounded-md border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!hasActiveFilters"
              @click="clearFilters"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-between gap-4">
          <p class="text-sm text-slate-500" aria-live="polite">{{ resultLabel }}</p>
        </div>

        <div
          v-if="pending && !projects.length"
          class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-hidden="true"
        >
          <div
            v-for="n in 6"
            :key="n"
            class="h-[28rem] animate-pulse rounded-lg bg-slate-200/70"
          />
        </div>

        <div
          v-else-if="projects.length"
          class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          :class="pending ? 'opacity-60 transition-opacity' : ''"
        >
          <ProjectCard v-for="item in projects" :key="item.slug" :project="item" />
        </div>

        <div
          v-else
          class="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
        >
          <SearchX class="size-10 text-slate-300" aria-hidden="true" />
          <h2 class="mt-4 font-display text-xl font-semibold text-ink">
            Nenhum empreendimento encontrado
          </h2>
          <p class="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Ajuste os filtros ou limpe a seleção para ver todas as oportunidades disponíveis.
          </p>
          <button
            v-if="hasActiveFilters"
            type="button"
            class="focus-ring mt-6 rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            @click="clearFilters"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
