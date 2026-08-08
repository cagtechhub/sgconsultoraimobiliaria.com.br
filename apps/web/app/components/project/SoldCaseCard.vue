<script setup lang="ts">
import { MapPin, Quote } from 'lucide-vue-next'
import type { SoldCase } from '@gutierres/shared'

const props = defineProps<{
  item: SoldCase
}>()

const soldLabel = computed(() => {
  if (!props.item.soldAt) return null
  const date = props.item.soldAt instanceof Date ? props.item.soldAt : new Date(props.item.soldAt)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
})
</script>

<template>
  <article class="overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-slate-200/60">
    <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <img
        v-if="item.coverUrl"
        :src="item.coverUrl"
        :alt="item.propertyTitle"
        class="h-full w-full object-cover"
      />
      <div
        v-else
        class="grid h-full place-items-center bg-gradient-to-br from-brand-100 via-paper to-slate-100"
        aria-hidden="true"
      >
        <Quote class="size-10 text-brand-400/70" />
      </div>
      <span
        class="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
      >
        Vendido
      </span>
    </div>

    <div class="p-6">
      <h3 class="font-display text-xl font-semibold">{{ item.propertyTitle }}</h3>
      <p v-if="item.location" class="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
        <MapPin class="size-4 text-brand-500" aria-hidden="true" />
        {{ item.location }}
      </p>
      <p v-if="soldLabel" class="mt-1 text-xs uppercase tracking-wider text-slate-400">
        {{ soldLabel }}
      </p>

      <blockquote class="mt-5 text-sm leading-7 text-slate-700">
        "{{ item.quote }}"
      </blockquote>

      <div class="mt-5 border-t border-slate-100 pt-4">
        <p class="text-sm font-semibold text-ink">{{ item.clientName }}</p>
        <p v-if="item.clientRole" class="mt-0.5 text-xs text-slate-500">{{ item.clientRole }}</p>
      </div>
    </div>
  </article>
</template>
