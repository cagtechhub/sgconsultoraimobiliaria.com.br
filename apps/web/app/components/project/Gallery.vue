<script setup lang="ts">
import { ChevronLeft, ChevronRight, Images } from 'lucide-vue-next'
import type { ProjectGalleryImage } from '~/types/project'

const props = defineProps<{
  images: ProjectGalleryImage[]
  title: string
}>()

const activeIndex = ref(0)
const touchStartX = ref<number | null>(null)

const hasMultiple = computed(() => props.images.length > 1)

const activeImage = computed(() => props.images[activeIndex.value] ?? null)

function goTo(index: number) {
  if (!props.images.length) return
  const total = props.images.length
  activeIndex.value = ((index % total) + total) % total
}

function next() {
  goTo(activeIndex.value + 1)
}

function prev() {
  goTo(activeIndex.value - 1)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') prev()
}

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.changedTouches[0]?.clientX ?? null
}

function onTouchEnd(event: TouchEvent) {
  if (touchStartX.value == null) return
  const endX = event.changedTouches[0]?.clientX
  if (endX == null) return

  const delta = endX - touchStartX.value
  touchStartX.value = null

  if (Math.abs(delta) < 48) return
  if (delta < 0) next()
  else prev()
}

watch(
  () => props.images,
  () => {
    activeIndex.value = 0
  },
)
</script>

<template>
  <article
    v-if="images.length"
    class="rounded-lg bg-white p-8 shadow-card ring-1 ring-slate-200/60"
  >
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-700">
          <Images class="size-4" aria-hidden="true" />
          Galeria
        </p>
        <h2 class="mt-2 font-display text-2xl font-semibold">Imagens do empreendimento</h2>
        <p class="mt-2 text-sm text-slate-500">
          Explore as fotos disponíveis deste projeto.
        </p>
      </div>
      <p v-if="hasMultiple" class="text-sm font-medium text-slate-500" aria-live="polite">
        {{ activeIndex + 1 }} / {{ images.length }}
      </p>
    </div>

    <div
      class="relative mt-6 overflow-hidden rounded-md border border-slate-200 bg-slate-100"
      tabindex="0"
      role="region"
      :aria-label="`Galeria de imagens de ${title}`"
      @keydown="onKeydown"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div class="relative aspect-[16/10]">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <img
            v-if="activeImage"
            :key="activeImage.id"
            :src="activeImage.url"
            :alt="activeImage.alt"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </Transition>
      </div>

      <template v-if="hasMultiple">
        <button
          type="button"
          class="focus-ring absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink/70 text-white backdrop-blur-sm transition hover:bg-ink"
          aria-label="Imagem anterior"
          @click="prev"
        >
          <ChevronLeft class="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="focus-ring absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink/70 text-white backdrop-blur-sm transition hover:bg-ink"
          aria-label="Próxima imagem"
          @click="next"
        >
          <ChevronRight class="size-5" aria-hidden="true" />
        </button>
      </template>
    </div>

    <div v-if="hasMultiple" class="mt-4 flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="(image, index) in images"
        :key="image.id"
        type="button"
        class="focus-ring relative h-16 w-24 shrink-0 overflow-hidden rounded-md border transition"
        :class="
          index === activeIndex
            ? 'border-brand-500 ring-2 ring-brand-300/50'
            : 'border-slate-200 opacity-70 hover:opacity-100'
        "
        :aria-label="`Ver imagem ${index + 1}`"
        :aria-current="index === activeIndex ? 'true' : undefined"
        @click="goTo(index)"
      >
        <img :src="image.url" :alt="image.alt" class="h-full w-full object-cover" />
      </button>
    </div>
  </article>
</template>
