<script setup lang="ts">
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-vue-next'
import type { Project } from '~/types/project'

const props = defineProps<{
  project?: Project
}>()

const { whatsappHref, onWhatsAppClick } = useWhatsapp()

const defaultProject: Project = {
  slug: 'reserva-jardins',
  title: 'Sky Villa Fasano',
  location: 'São Paulo & Litoral Exclusivo',
  status: 'Lançamento',
  description:
    'Penthouses e residências privativas com assinatura arquitetônica de prestígio e serviços exclusivos.',
  longDescription: '',
  deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  progress: 75,
  featured: true,
  image:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  floorPlanImage: '',
  highlights: ['Vista Panorâmica', 'Concierge Privado', 'Elevador Codificado'],
  gallery: [],
}

const currentProject = computed(() => props.project || defaultProject)

const formattedDeadline = computed(() => {
  const d = currentProject.value.deadline
  if (!d) return '2º Semestre 2026'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '2º Semestre 2026'
  const semester = date.getMonth() < 6 ? '1º Semestre' : '2º Semestre'
  return `${semester} ${date.getFullYear()}`
})
</script>

<template>
  <section class="relative w-full overflow-hidden bg-ink pt-20">
    <!-- Atmospheric Visual Canvas with Dual Vignettes -->
    <div class="absolute inset-0 z-0">
      <img
        :src="currentProject.image"
        :alt="currentProject.title"
        class="h-full w-full object-cover opacity-35 scale-105 transition-transform duration-1000 ease-out"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      <div
        class="pointer-events-none absolute -top-32 right-10 h-96 w-96 rounded-full bg-primary/10 blur-[130px]"
        aria-hidden="true"
      />
    </div>

    <div class="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="grid min-h-[calc(100vh-10rem)] items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <!-- Left Editorial Narrative (7 Columns) -->
        <div class="flex flex-col gap-6 lg:col-span-7">
          <!-- Kicker Line & Location Pill -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="h-[1px] w-8 bg-primary" />
              <span class="text-xs font-semibold uppercase tracking-widest text-primary font-label">
                PROJETO EM DESTAQUE
              </span>
            </div>
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-stroke-dark bg-surface-dark-raised/80 px-3 py-1 text-xs text-text-on-dark-muted backdrop-blur-md"
            >
              <MapPin class="size-3.5 text-primary" aria-hidden="true" />
              {{ currentProject.location }}
            </span>
          </div>

          <!-- Main Typographic Headline -->
          <h1
            class="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-text-on-dark sm:text-5xl lg:text-6xl"
          >
            Curadoria pessoal antes da visita — a escolha
            <em class="font-normal italic text-primary">certa</em>, sem perder tempo.
          </h1>

          <!-- 1st Person Voice Advisory Description -->
          <p class="max-w-2xl text-base leading-relaxed text-text-on-dark-muted sm:text-lg">
            Atuo com curadoria exclusiva e consultoria privada para compradores e investidores
            qualificados. Analiso liquidez, plantas nobres e diretrizes de valorização antes mesmo
            de você pisar no estande, poupando seu tempo com condução direta e sem atrito.
          </p>

          <!-- Technical Signal Glass Cards (Frosted) -->
          <div class="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
            <div
              class="flex flex-col justify-between rounded-md border border-stroke-dark bg-surface-dark-raised/70 p-4 backdrop-blur-md"
            >
              <span
                class="text-[11px] font-semibold uppercase tracking-wider text-text-on-dark-muted"
              >
                Status do Projeto
              </span>
              <span class="mt-2 flex items-center gap-2 text-sm font-semibold text-text-on-dark">
                <span class="size-2 rounded-full bg-primary animate-pulse" />
                {{ currentProject.status }}
              </span>
            </div>

            <div
              class="flex flex-col justify-between rounded-md border border-stroke-dark bg-surface-dark-raised/70 p-4 backdrop-blur-md"
            >
              <span
                class="text-[11px] font-semibold uppercase tracking-wider text-text-on-dark-muted"
              >
                Evolução da Obra
              </span>
              <div class="mt-2 flex items-baseline gap-2">
                <span class="font-display text-3xl font-medium text-primary">
                  {{ currentProject.progress }}%
                </span>
                <span class="text-xs text-text-on-dark-muted">concluída</span>
              </div>
            </div>

            <div
              class="flex flex-col justify-between rounded-md border border-stroke-dark bg-surface-dark-raised/70 p-4 backdrop-blur-md"
            >
              <span
                class="text-[11px] font-semibold uppercase tracking-wider text-text-on-dark-muted"
              >
                Entrega Prevista
              </span>
              <span class="mt-2 text-sm font-semibold text-text-on-dark">
                {{ formattedDeadline }}
              </span>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
            <NuxtLink
              :to="`/empreendimentos/${currentProject.slug}`"
              class="focus-ring inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 text-sm font-semibold text-ink shadow-[0_4px_24px_rgba(197,160,89,0.25)] transition-all duration-300 hover:bg-primary-hover"
            >
              <span>Ver detalhes do empreendimento</span>
              <ArrowRight class="size-4" aria-hidden="true" />
            </NuxtLink>

            <a
              :href="whatsappHref"
              class="focus-ring inline-flex items-center justify-center gap-2 rounded-sm border border-primary/40 bg-transparent px-6 py-4 text-sm font-medium text-text-on-dark transition-all duration-300 hover:border-primary hover:bg-surface-dark-raised"
              target="_blank"
              rel="noopener noreferrer"
              @click="onWhatsAppClick('hero')"
            >
              <MessageCircle class="size-4 text-primary" aria-hidden="true" />
              <span>Conversar no WhatsApp</span>
            </a>
          </div>
        </div>

        <!-- Right Architectural Visual Spec (5 Columns) -->
        <div class="relative lg:col-span-5">
          <div
            class="group relative aspect-[4/5] w-full overflow-hidden rounded-md border border-stroke-dark/80 shadow-2xl"
          >
            <img
              class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              :src="currentProject.image"
              :alt="currentProject.title"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-85"
            />

            <!-- Embedded Floating Badge -->
            <div
              class="absolute bottom-5 inset-x-5 flex items-center justify-between rounded-md border border-primary/30 bg-surface-dark/90 p-4 backdrop-blur-md"
            >
              <div>
                <span
                  class="block text-[11px] font-semibold uppercase tracking-widest text-primary font-label"
                >
                  Residência Selecionada
                </span>
                <span class="text-sm font-semibold text-text-on-dark">
                  {{ currentProject.title }} • {{ currentProject.location }}
                </span>
              </div>
              <ShieldCheck class="size-6 shrink-0 text-primary" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <!-- Trust & Protocol Metrics Strip -->
      <div class="mt-12 grid grid-cols-1 gap-6 border-t border-stroke-dark/60 pt-10 md:grid-cols-3">
        <div class="flex items-center gap-4">
          <div
            class="grid size-12 shrink-0 place-items-center rounded-sm border border-stroke-dark bg-surface-dark-raised text-primary"
          >
            <Sparkles class="size-5" aria-hidden="true" />
          </div>
          <div>
            <span class="block font-display text-2xl font-semibold leading-none text-primary"
              >24+</span
            >
            <span class="mt-1 block text-sm text-text-on-dark-muted"
              >Empreendimentos em Curadoria Ativa</span
            >
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="grid size-12 shrink-0 place-items-center rounded-sm border border-stroke-dark bg-surface-dark-raised text-primary"
          >
            <Clock3 class="size-5" aria-hidden="true" />
          </div>
          <div>
            <span class="block font-display text-2xl font-semibold leading-none text-primary"
              >2h</span
            >
            <span class="mt-1 block text-sm text-text-on-dark-muted"
              >Tempo Médio de Resposta Executiva</span
            >
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="grid size-12 shrink-0 place-items-center rounded-sm border border-stroke-dark bg-surface-dark-raised text-primary"
          >
            <CheckCircle2 class="size-5" aria-hidden="true" />
          </div>
          <div>
            <span class="block font-display text-2xl font-semibold leading-none text-primary"
              >100%</span
            >
            <span class="mt-1 block text-sm text-text-on-dark-muted"
              >Condução Direta com Incorporadoras</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
