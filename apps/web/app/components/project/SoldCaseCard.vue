<script setup lang="ts">
import { BadgeCheck, MapPin, Quote } from 'lucide-vue-next'
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
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white text-ink shadow-soft ring-1 ring-[#e5c48b]/25 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(0,0,0,0.35)] hover:ring-[#e5c48b]/55"
  >
    <div class="absolute inset-x-0 top-0 h-1 bg-gold-shine" aria-hidden="true" />

    <div class="relative aspect-[16/10] overflow-hidden bg-slate-200">
      <img
        v-if="item.coverUrl"
        :src="item.coverUrl"
        :alt="item.propertyTitle"
        class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div
        v-else
        class="grid h-full place-items-center bg-gradient-to-br from-brand-100 via-brand-50 to-slate-100"
        aria-hidden="true"
      >
        <Quote class="size-12 text-brand-500/60" />
      </div>
      <div
        class="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
        aria-hidden="true"
      />
      <span
        class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink shadow-card"
      >
        <BadgeCheck class="size-3.5" aria-hidden="true" />
        Vendido
      </span>
      <p
        v-if="soldLabel"
        class="absolute bottom-4 left-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/85"
      >
        {{ soldLabel }}
      </p>
    </div>

    <div class="flex flex-1 flex-col p-6 sm:p-7">
      <h3 class="font-display text-2xl font-semibold leading-snug">{{ item.propertyTitle }}</h3>
      <p v-if="item.location" class="mt-2.5 flex items-center gap-1.5 text-sm text-slate-600">
        <MapPin class="size-4 shrink-0 text-brand-600" aria-hidden="true" />
        {{ item.location }}
      </p>

      <div class="relative mt-6 flex-1">
        <Quote
          class="absolute -left-1 -top-1 size-7 text-brand-200"
          aria-hidden="true"
        />
        <blockquote class="relative pl-7 text-[0.95rem] font-medium leading-7 text-slate-700">
          "{{ item.quote }}"
        </blockquote>
      </div>

      <div class="mt-6 border-t border-brand-100 pt-4">
        <p class="text-sm font-bold text-ink">{{ item.clientName }}</p>
        <p v-if="item.clientRole" class="mt-0.5 text-xs font-medium uppercase tracking-wider text-brand-700">
          {{ item.clientRole }}
        </p>
      </div>
    </div>
  </article>
</template>
