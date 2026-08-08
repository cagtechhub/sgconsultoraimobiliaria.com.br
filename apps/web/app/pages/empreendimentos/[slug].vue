<script setup lang="ts">
import { ArrowLeft, ArrowRight, BadgeCheck, Calendar, Clock3, MapPin, MessageCircle, ShieldCheck, TrendingUp } from 'lucide-vue-next'
import type { Property } from '@gutierres/shared'
import { mapPropertyToProject, useApiBaseUrl } from '~/utils/mapProperty'

const route = useRoute()
const { whatsappHref, onWhatsAppClick } = useWhatsapp()
const { trackViewContent } = useAnalytics()
const baseUrl = useApiBaseUrl()
const slug = String(route.params.slug)

const { data: project, error } = await useAsyncData(`property-${slug}`, async () => {
  try {
    const property = await $fetch<Property>(`${baseUrl.value}/properties/${slug}`)
    return mapPropertyToProject(property)
  } catch {
    return null
  }
})

if (error.value || !project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Empreendimento não encontrado' })
}

onMounted(() => {
  if (project.value) {
    trackViewContent({ id: project.value.slug, name: project.value.title })
  }
})

const statusColors: Record<string, string> = {
  Lançamento: 'bg-brand-100 text-brand-800 border-brand-200',
  'Em construção': 'bg-amber-50 text-amber-800 border-amber-200',
  'Pronto para morar': 'bg-emerald-50 text-emerald-800 border-emerald-200',
}

const projectSignals = [
  {
    label: 'Disponibilidade',
    text: 'Condição atual sob consulta',
    icon: MessageCircle,
  },
  {
    label: 'Segurança',
    text: 'Apresentação autorizada',
    icon: ShieldCheck,
  },
  {
    label: 'Decisão',
    text: 'Análise por perfil',
    icon: TrendingUp,
  },
]

const formattedDeadline = computed(() =>
  new Date(project.value!.deadline).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }),
)

const whatsappProjectHref = computed(() => {
  const config = useRuntimeConfig()
  const digits = String(config.public.whatsappNumber || '').replace(/\D/g, '')
  const message = encodeURIComponent(
    `Olá! Tenho interesse no empreendimento ${project.value!.title}. Gostaria de mais informações.`,
  )
  return digits ? `https://wa.me/${digits}?text=${message}` : whatsappHref.value
})

useSiteSeoHead({
  title: project.value.title,
  description: project.value.description,
  image: project.value.image,
  path: `/empreendimentos/${project.value.slug}`,
  type: 'article',
})
</script>

<template>
  <div v-if="project">
    <section class="relative bg-ink pt-24 text-white">
      <img
        class="absolute inset-0 h-full w-full object-cover opacity-40"
        :src="project.image"
        :alt="project.title"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/90" />

      <div class="container-page relative pb-12 pt-8">
        <NuxtLink
          to="/empreendimentos"
          class="focus-ring mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-brand-300"
        >
          <ArrowLeft class="size-4" aria-hidden="true" />
          Voltar aos empreendimentos
        </NuxtLink>

        <div class="flex flex-wrap items-center gap-3">
          <span
            class="rounded-full border px-3 py-1 text-xs font-semibold uppercase"
            :class="statusColors[project.status]"
          >
            {{ project.status }}
          </span>
          <span class="flex items-center gap-2 text-sm text-white/60">
            <MapPin class="size-4 text-brand-400" aria-hidden="true" />
            {{ project.location }}
          </span>
        </div>

        <h1 class="mt-4 font-display text-4xl font-bold sm:text-5xl">{{ project.title }}</h1>
        <p class="mt-4 max-w-2xl text-lg text-white/70">{{ project.description }}</p>

        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          <div
            v-for="signal in projectSignals"
            :key="signal.label"
            class="rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm"
          >
            <span class="grid size-9 place-items-center rounded-md bg-brand-500/15 text-brand-300">
              <component :is="signal.icon" class="size-4" aria-hidden="true" />
            </span>
            <p class="mt-3 text-[0.68rem] font-semibold uppercase tracking-wider text-white/45">
              {{ signal.label }}
            </p>
            <p class="mt-1 text-sm font-semibold text-white">{{ signal.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-paper py-16">
      <div class="container-page">
        <div class="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div class="space-y-10">
            <article class="rounded-lg bg-white p-8 shadow-card ring-1 ring-slate-200/60">
              <h2 class="font-display text-2xl font-semibold">Sobre o empreendimento</h2>
              <p class="mt-4 leading-8 text-slate-600">{{ project.longDescription }}</p>

              <div class="mt-6 flex flex-wrap gap-2">
                <span
                  v-for="tag in project.highlights"
                  :key="tag"
                  class="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                >
                  {{ tag }}
                </span>
              </div>
            </article>

            <ProjectGallery
              v-if="project.gallery.length"
              :images="project.gallery"
              :title="project.title"
            />

            <article class="rounded-lg bg-white p-8 shadow-card ring-1 ring-slate-200/60">
              <h2 class="font-display text-2xl font-semibold">Planta do projeto</h2>
              <p class="mt-2 text-sm text-slate-500">
                Planta ilustrativa para referência comercial. Consulte a documentação oficial da
                incorporadora para detalhes técnicos.
              </p>
              <div class="mt-6 overflow-hidden rounded-md border border-slate-200">
                <img
                  :src="project.floorPlanImage"
                  :alt="`Planta do empreendimento ${project.title}`"
                  class="w-full object-cover"
                />
              </div>
            </article>

            <div class="rounded-lg border border-brand-200/60 bg-brand-50/50 p-6">
              <p class="text-sm leading-7 text-slate-600">
                <strong class="text-ink">Aviso legal:</strong> Stefanny Gutierres atua como
                consultora de vendas imobiliárias, realizando apresentação comercial e condução de
                interessados junto à incorporadora. Este site não realiza intermediação de
                corretagem e não possui registro CRECI.
              </p>
            </div>
          </div>

          <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div class="rounded-lg border border-brand-200 bg-brand-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-widest text-brand-700">
                Antes de decidir
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Solicite disponibilidade, condições comerciais e encaixe com seu objetivo de compra.
              </p>
            </div>

            <div class="rounded-lg bg-white p-6 shadow-card ring-1 ring-slate-200/60">
              <h3 class="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Informações
              </h3>

              <dl class="mt-5 space-y-4">
                <div>
                  <dt class="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                    <BadgeCheck class="size-4" aria-hidden="true" />
                    Status
                  </dt>
                  <dd class="mt-1 font-semibold">{{ project.status }}</dd>
                </div>
                <div>
                  <dt class="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                    <Calendar class="size-4" aria-hidden="true" />
                    Prazo de entrega
                  </dt>
                  <dd class="mt-1 font-semibold">{{ formattedDeadline }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wider text-slate-400">
                    <span class="flex items-center gap-2">
                      <Clock3 class="size-4" aria-hidden="true" />
                      Progresso da obra
                    </span>
                  </dt>
                  <dd class="mt-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="font-semibold text-brand-600">{{ project.progress }}%</span>
                    </div>
                    <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        class="h-full rounded-full bg-brand-500"
                        :style="{ width: `${project.progress}%` }"
                      />
                    </div>
                  </dd>
                </div>
              </dl>
            </div>

            <CountdownTimer :deadline="project.deadline" />

            <a
              :href="whatsappProjectHref"
              class="focus-ring flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 px-6 py-4 text-sm font-semibold text-ink transition hover:bg-brand-400"
              target="_blank"
              rel="noopener noreferrer"
              @click="onWhatsAppClick('property_detail')"
            >
              <MessageCircle class="size-4" aria-hidden="true" />
              Solicitar consultoria de vendas
              <ArrowRight class="size-4" aria-hidden="true" />
            </a>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>
