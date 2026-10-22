<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'

const { whatsappHref, onWhatsAppClick } = useWhatsapp()
</script>

<template>
  <aside class="fixed bottom-6 right-6 z-40">
    <a
      :href="whatsappHref"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultoria Direta via WhatsApp"
      class="group relative flex size-14 items-center justify-center rounded-full bg-whatsapp text-ink shadow-[0_4px_24px_rgba(37,211,102,0.35)] transition-transform duration-300 hover:scale-105 active:scale-95"
      @click="onWhatsAppClick('floating')"
    >
      <MessageCircle class="size-7 text-ink stroke-[2.2]" aria-hidden="true" />
    </a>
  </aside>
</template>
