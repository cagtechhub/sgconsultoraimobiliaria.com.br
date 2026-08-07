<script setup lang="ts">
import type { SiteSettings } from '@gutierres/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const error = ref('')
const success = ref('')
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  siteUrl: '',
  siteName: '',
  seoLocality: '',
  noIndex: false,
  businessAddress: '',
  businessPhone: '',
  contactEmail: '',
  whatsappNumber: '',
  whatsappMessage: '',
  instagramUrl: '',
  facebookUrl: '',
  linkedinUrl: '',
  defaultOgImageUrl: '',
  ga4MeasurementId: '',
  metaPixelId: '',
})

const applySettings = (item: SiteSettings) => {
  form.siteUrl = item.siteUrl
  form.siteName = item.siteName
  form.seoLocality = item.seoLocality
  form.noIndex = item.noIndex
  form.businessAddress = item.businessAddress
  form.businessPhone = item.businessPhone
  form.contactEmail = item.contactEmail
  form.whatsappNumber = item.whatsappNumber
  form.whatsappMessage = item.whatsappMessage
  form.instagramUrl = item.instagramUrl
  form.facebookUrl = item.facebookUrl
  form.linkedinUrl = item.linkedinUrl
  form.defaultOgImageUrl = item.defaultOgImageUrl
  form.ga4MeasurementId = item.ga4MeasurementId
  form.metaPixelId = item.metaPixelId
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    applySettings(await api.getSettings())
  } catch {
    error.value = 'Não foi possível carregar as configurações.'
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    applySettings(await api.updateSettings({ ...form }))
    success.value = 'Configurações salvas.'
  } catch {
    error.value = 'Falha ao salvar configurações.'
  } finally {
    saving.value = false
  }
}

await load()
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h2 class="font-display text-3xl">Configurações do site</h2>
      <p class="mt-1 text-sm text-ink/60">SEO, contato e redes — usados no site público.</p>
    </div>

    <p v-if="loading" class="text-sm text-ink/50">Carregando…</p>

    <form
      v-else
      class="space-y-4 rounded-2xl border border-brand-200 bg-white p-6"
      @submit.prevent="onSubmit"
    >
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block text-sm sm:col-span-2">
          Nome do site
          <input v-model="form.siteName" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm sm:col-span-2">
          URL do site
          <input v-model="form.siteUrl" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          Localidade SEO
          <input v-model="form.seoLocality" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="inline-flex items-center gap-2 self-end pb-2 text-sm">
          <input v-model="form.noIndex" type="checkbox" />
          No-index (bloquear busca)
        </label>
        <label class="block text-sm sm:col-span-2">
          Endereço comercial
          <input v-model="form.businessAddress" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          Telefone
          <input v-model="form.businessPhone" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          E-mail de contato
          <input
            v-model="form.contactEmail"
            type="email"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
          />
        </label>
        <label class="block text-sm">
          WhatsApp (DDI + número)
          <input v-model="form.whatsappNumber" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          Mensagem padrão WhatsApp
          <input v-model="form.whatsappMessage" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          Instagram
          <input v-model="form.instagramUrl" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          Facebook
          <input v-model="form.facebookUrl" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          LinkedIn
          <input v-model="form.linkedinUrl" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm sm:col-span-2">
          Imagem OG padrão (URL)
          <input v-model="form.defaultOgImageUrl" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
        </label>
        <label class="block text-sm">
          GA4 Measurement ID
          <input
            v-model="form.ga4MeasurementId"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
            placeholder="G-XXXXXXXXXX"
          />
        </label>
        <label class="block text-sm">
          Meta Pixel ID
          <input
            v-model="form.metaPixelId"
            class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2"
            placeholder="123456789012345"
          />
        </label>
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-if="success" class="text-sm text-emerald-700">{{ success }}</p>

      <button
        type="submit"
        class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
        :disabled="saving"
      >
        {{ saving ? 'Salvando…' : 'Salvar configurações' }}
      </button>
    </form>
  </div>
</template>
