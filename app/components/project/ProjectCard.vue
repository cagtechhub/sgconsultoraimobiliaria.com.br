<script setup lang="ts">
import { ArrowRight, Building2, Clock3, MapPin, ShieldCheck, Sparkles, TrendingUp } from 'lucide-vue-next'
import type { Project } from '~/types/project'

const props = defineProps<{
  project: Project
}>()

const statusColors: Record<Project['status'], string> = {
  Lançamento: 'bg-brand-100 text-brand-800',
  'Em construção': 'bg-amber-50 text-amber-800',
  'Pronto para morar': 'bg-emerald-50 text-emerald-800',
}

const opportunityLabel = computed(() => {
  if (props.project.status === 'Lançamento') return 'Condições de lançamento'
  if (props.project.status === 'Pronto para morar') return 'Visita imediata'
  return 'Acompanhamento da obra'
})

const decisionSignals = computed(() => [
  {
    label: 'Potencial',
    value: opportunityLabel.value,
    icon: TrendingUp,
  },
  {
    label: 'Atendimento',
    value: 'Curadoria individual',
    icon: ShieldCheck,
  },
])
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-1 hover:shadow-soft"
  >
    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-emerald-500 to-brand-300" aria-hidden="true" />

    <div class="relative overflow-hidden">
      <img
        class="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        :src="project.image"
        :alt="`Empreendimento ${project.title}`"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" aria-hidden="true" />
      <span
        class="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase"
        :class="statusColors[project.status]"
      >
        {{ project.status }}
      </span>
      <span
        class="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-card backdrop-blur"
      >
        <Sparkles class="size-3.5 text-brand-600" aria-hidden="true" />
        Destaque
      </span>
      <div class="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2 text-white">
        <div class="rounded-md border border-white/15 bg-ink/55 px-3 py-2 backdrop-blur-sm">
          <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-white/55">Obra</p>
          <p class="mt-0.5 text-sm font-semibold">{{ project.progress }}% concluída</p>
        </div>
        <div class="rounded-md border border-white/15 bg-ink/55 px-3 py-2 backdrop-blur-sm">
          <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-white/55">Consulta</p>
          <p class="mt-0.5 text-sm font-semibold">Condição atual</p>
        </div>
      </div>
    </div>

    <div class="p-6">
      <div class="mb-3 flex items-center gap-2 text-sm text-slate-500">
        <MapPin class="size-4 text-brand-500" aria-hidden="true" />
        {{ project.location }}
      </div>

      <h3 class="font-display text-xl font-semibold">{{ project.title }}</h3>
      <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{{ project.description }}</p>

      <div class="mt-5 grid gap-3">
        <div
          v-for="signal in decisionSignals"
          :key="signal.label"
          class="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3"
        >
          <span class="grid size-8 shrink-0 place-items-center rounded-md bg-white text-brand-600 shadow-sm">
            <component :is="signal.icon" class="size-4" aria-hidden="true" />
          </span>
          <span>
            <span class="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-400">
              {{ signal.label }}
            </span>
            <span class="mt-0.5 block text-xs font-semibold text-slate-700">{{ signal.value }}</span>
          </span>
        </div>
      </div>

      <div class="mt-5">
        <div class="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span class="inline-flex items-center gap-1.5">
            <Building2 class="size-3.5" aria-hidden="true" />
            Evolução
          </span>
          <span class="text-brand-600">{{ project.progress }}%</span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div class="h-full rounded-full bg-brand-500" :style="{ width: `${project.progress}%` }" />
        </div>
      </div>

      <NuxtLink
        :to="`/empreendimentos/${project.slug}`"
        class="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Ver disponibilidade
        <ArrowRight class="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
      </NuxtLink>

      <p class="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
        <Clock3 class="size-3.5" aria-hidden="true" />
        Atendimento consultivo antes da proposta
      </p>
    </div>
  </article>
</template>
