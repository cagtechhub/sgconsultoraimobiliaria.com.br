<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import type { SoldCase } from '@gutierres/shared'

const props = defineProps<{
  item: SoldCase
}>()

const soldLabel = computed(() => {
  if (!props.item.soldAt) return 'Aquisição Residencial'
  const date = props.item.soldAt instanceof Date ? props.item.soldAt : new Date(props.item.soldAt)
  if (Number.isNaN(date.getTime())) return 'Aquisição Residencial'
  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
})
</script>

<template>
  <article
    class="group relative flex flex-col justify-between overflow-hidden rounded-md border border-stroke-dark bg-surface-dark transition-all duration-300 hover:border-primary/40"
  >
    <div class="relative h-64 w-full overflow-hidden sm:h-72 bg-surface-dark-raised">
      <img
        v-if="item.coverUrl"
        :src="item.coverUrl"
        :alt="item.propertyTitle"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        v-else
        class="h-full w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style="
          background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
        "
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent"
      />

      <div class="absolute left-4 top-4">
        <span
          class="rounded-full border border-stroke-dark bg-surface-dark-raised/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary"
        >
          {{ soldLabel }}
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
      <div>
        <h3 class="font-display text-xl font-semibold text-text-on-dark">
          {{ item.propertyTitle }}
        </h3>
        <p v-if="item.location" class="mt-1 text-xs text-text-on-dark-muted">
          {{ item.location }}
        </p>

        <blockquote
          class="mt-4 font-display text-base font-normal italic leading-relaxed text-text-on-dark sm:text-lg"
        >
          “{{ item.quote }}”
        </blockquote>
      </div>

      <div class="flex items-center justify-between border-t border-stroke-dark pt-4">
        <div>
          <span class="block text-sm font-semibold text-text-on-dark">
            {{ item.clientName }}
          </span>
          <span
            v-if="item.clientRole"
            class="block text-xs uppercase tracking-wider text-text-on-dark-muted"
          >
            {{ item.clientRole }}
          </span>
        </div>

        <div class="flex items-center gap-1 text-primary" aria-label="Avaliação 5 estrelas">
          <Star
            v-for="i in 5"
            :key="i"
            class="size-4 fill-current text-primary"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </article>
</template>
