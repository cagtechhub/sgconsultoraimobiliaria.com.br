<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'header' | 'footer' | 'icon'
  }>(),
  {
    variant: 'header',
  },
)

const imgClass = computed(() => {
  if (props.variant === 'footer') {
    return 'h-auto w-full max-w-[220px] object-contain sm:max-w-[260px]'
  }
  if (props.variant === 'icon') {
    return 'size-10 object-contain'
  }
  return 'w-auto max-w-[240px] object-contain sm:h-24 sm:max-w-[240px]'
})

const imgUrl = computed(() => {
  if (props.variant === 'footer') return '/img/logo-footer.png'
  if (props.variant === 'icon') return '/img/logo-mark.png'
  return '/img/logo-mark.png'
})

const altText = computed(() =>
  props.variant === 'footer'
    ? 'Stefanny Gutierres — Consultoria de Vendas Imobiliárias'
    : 'Stefanny Gutierres',
)
</script>

<template>
  <NuxtLink
    to="/"
    class="focus-ring group inline-flex shrink-0 rounded-md transition-opacity hover:opacity-90"
    :class="props.variant === 'footer' ? 'mb-2' : 'items-center'"
    :aria-label="altText"
  >
    <img :src="imgUrl" :alt="altText" :class="imgClass" />
  </NuxtLink>
</template>
