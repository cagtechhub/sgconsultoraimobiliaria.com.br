<script setup lang="ts">
useSiteSeoHead()
</script>

<template>
  <div class="min-h-screen bg-paper">
    <LayoutAppHeader />
    <slot />
    <LayoutAppFooter />
    <LayoutFloatingWhatsApp />
  </div>
</template>
