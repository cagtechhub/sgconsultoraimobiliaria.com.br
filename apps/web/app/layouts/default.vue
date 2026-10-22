<script setup lang="ts">
useSiteSeoHead()
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface">
    <LayoutAppHeader />
    <slot />
    <LayoutAppFooter />
    <LayoutFloatingWhatsApp />
  </div>
</template>
