<script setup lang="ts">
import { ArrowRight, MapPin } from 'lucide-vue-next'
import type { Project } from '~/types/project'

defineProps<{
  project: Project
}>()
</script>

<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-md border border-stroke-light bg-surface-light shadow-[0_1px_2px_rgba(20,17,13,0.04),0_12px_32px_rgba(20,17,13,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(20,17,13,0.12)]"
  >
    <!-- Top dual metallic gold line -->
    <div class="h-1 w-full bg-gradient-to-r from-primary-container via-primary to-success" />

    <!-- Image ratio 4:5 -->
    <div class="relative aspect-[4/5] w-full overflow-hidden bg-surface-light-alt">
      <img
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        :src="project.image"
        :alt="`Empreendimento ${project.title}`"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-60"
      />

      <div class="absolute left-4 top-4">
        <span
          class="rounded-full border border-stroke-dark bg-surface-dark/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary backdrop-blur-sm"
        >
          {{ project.status }}
        </span>
      </div>

      <!-- Highlights / Specs badge -->
      <div
        v-if="project.highlights?.length"
        class="absolute bottom-3 inset-x-3 flex items-center justify-between rounded-sm border border-white/10 bg-ink/75 p-2.5 text-xs text-white backdrop-blur-sm"
      >
        <span
          class="truncate font-semibold text-primary font-label uppercase tracking-wider text-[10px]"
        >
          {{ project.highlights[0] }}
        </span>
        <span class="text-[11px] text-text-on-dark-muted font-medium">
          {{ project.progress }}% concluído
        </span>
      </div>
    </div>

    <!-- Content Body -->
    <div class="flex flex-1 flex-col justify-between gap-4 p-6">
      <div>
        <div class="flex items-center gap-1.5 text-xs font-medium text-text-muted">
          <MapPin class="size-3.5 text-brand-gold-deep" aria-hidden="true" />
          <span>{{ project.location }}</span>
        </div>

        <h3 class="mt-2 font-display text-xl font-semibold text-text-strong">
          {{ project.title }}
        </h3>

        <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-text-base">
          {{ project.description }}
        </p>
      </div>

      <div class="flex items-center justify-between border-t border-stroke-light pt-4">
        <span class="text-xs text-text-muted font-medium">Condução Direta</span>
        <NuxtLink
          :to="`/empreendimentos/${project.slug}`"
          class="focus-ring inline-flex items-center gap-1 text-sm font-semibold text-brand-gold-deep transition-colors hover:text-ink"
        >
          <span>Ver empreendimento</span>
          <ArrowRight
            class="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
