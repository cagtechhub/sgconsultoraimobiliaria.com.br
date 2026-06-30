<script setup lang="ts">
import { ArrowRight, Clock3, MapPin, MessageCircle, ShieldCheck, TrendingUp } from 'lucide-vue-next'
import type { Project } from '~/types/project'

defineProps<{
  project: Project
}>()

const { whatsappHref } = useWhatsapp()

const heroSignals = [
  {
    label: 'Resposta comercial',
    value: 'Até 2h úteis',
    icon: Clock3,
  },
  {
    label: 'Curadoria',
    value: 'Autorizada',
    icon: ShieldCheck,
  },
  {
    label: 'Análise',
    value: 'Perfil e objetivo',
    icon: TrendingUp,
  },
]
</script>

<template>
  <section class="relative min-h-[92svh] overflow-hidden bg-ink text-white">
    <img
      class="absolute inset-0 h-full w-full object-cover opacity-50"
      :src="project.image"
      :alt="`Empreendimento ${project.title}`"
    />
    <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/35" />
    <div class="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />

    <div class="container-page relative flex min-h-[92svh] items-center pb-24 pt-28">
      <div class="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div class="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-400">
            <span class="h-px w-12 bg-brand-500/60" />
            Projeto em destaque
          </div>

          <h1 class="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {{ project.title }}
          </h1>

          <p class="mt-4 flex items-center gap-2 text-base text-white/70">
            <MapPin class="size-4 text-brand-400" aria-hidden="true" />
            {{ project.location }}
          </p>

          <p class="mt-6 max-w-xl text-lg leading-8 text-white/75">
            {{ project.description }}
          </p>

          <div class="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div
              v-for="signal in heroSignals"
              :key="signal.label"
              class="rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm"
            >
              <span class="grid size-9 place-items-center rounded-md bg-brand-500/15 text-brand-300">
                <component :is="signal.icon" class="size-4" aria-hidden="true" />
              </span>
              <p class="mt-3 text-[0.68rem] font-semibold uppercase tracking-wider text-white/45">
                {{ signal.label }}
              </p>
              <p class="mt-1 text-sm font-semibold text-white">{{ signal.value }}</p>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap gap-2">
            <span
              v-for="tag in project.highlights"
              :key="tag"
              class="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300"
            >
              {{ tag }}
            </span>
          </div>

          <div class="mt-10 flex flex-col gap-4 sm:flex-row">
            <NuxtLink
              :to="`/empreendimentos/${project.slug}`"
              class="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-brand-500 px-8 py-4 text-sm font-semibold text-ink transition hover:bg-brand-400"
            >
              Ver detalhes do empreendimento
              <ArrowRight class="size-4" aria-hidden="true" />
            </NuxtLink>
            <a
              :href="whatsappHref"
              class="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-8 py-4 text-sm font-semibold text-white transition hover:border-brand-500/50 hover:text-brand-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle class="size-4" aria-hidden="true" />
              Falar com a consultoria
            </a>
          </div>
        </div>

        <div class="space-y-5">
          <div class="relative overflow-hidden rounded-lg border border-white/10 shadow-soft">
            <img
              :src="project.image"
              :alt="project.title"
              class="aspect-[4/3] w-full object-cover"
            />
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
                Empreendimento em curadoria
              </p>
              <p class="mt-1 text-sm text-white/75">
                Receba condições, disponibilidade e próximos passos antes da visita.
              </p>
            </div>
          </div>

          <div class="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <span class="text-sm text-white/60">Progresso da obra</span>
                <p class="mt-1 text-xs text-white/45">Acompanhamento comercial atualizado.</p>
              </div>
              <span class="rounded-md bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-200">
                {{ project.progress }}%
              </span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                class="h-full rounded-full bg-brand-500 transition-all"
                :style="{ width: `${project.progress}%` }"
              />
            </div>
            <p class="mt-3 text-xs text-white/50">
              Consultora de vendas — apresentação comercial autorizada pela incorporadora.
            </p>
          </div>

          <div class="rounded-lg border border-brand-400/25 bg-brand-500/10 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
              Janela de atendimento
            </p>
            <p class="mt-2 text-sm leading-6 text-white/75">
              Informe seu perfil e receba uma recomendação objetiva para decidir com mais segurança.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
