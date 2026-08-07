<script setup lang="ts">
import type { CreateLeadInput, Lead, LeadChannel, LeadStatus, Property } from '@gutierres/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const leads = ref<Lead[]>([])
const properties = ref<Property[]>([])
const error = ref('')
const loading = ref(true)
const creating = ref(false)
const showForm = ref(false)

const channelLabel: Record<LeadChannel, string> = {
  WEBSITE: 'Site',
  ADSENSE: 'AdSense',
  WHATSAPP: 'WhatsApp',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  REFERRAL: 'Indicação',
  OTHER: 'Outro',
}

const statusLabel: Record<LeadStatus, string> = {
  NEW: 'Novo',
  CONTACTED: 'Contatado',
  QUALIFIED: 'Qualificado',
  CONVERTED: 'Convertido',
  LOST: 'Perdido',
}

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  notes: '',
  channel: 'WHATSAPP' as LeadChannel,
  status: 'NEW' as LeadStatus,
  propertyId: '',
})

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    ;[leads.value, properties.value] = await Promise.all([api.listLeads(), api.listProperties()])
  } catch {
    error.value = 'Não foi possível carregar os leads.'
  } finally {
    loading.value = false
  }
}

const propertyTitle = (propertyId?: string | null) => {
  if (!propertyId) return '—'
  return properties.value.find((p) => p.id === propertyId)?.title ?? propertyId
}

const onCreate = async () => {
  creating.value = true
  error.value = ''
  try {
    const payload: CreateLeadInput = {
      fullName: form.fullName,
      email: form.email || null,
      phone: form.phone || null,
      notes: form.notes || null,
      channel: form.channel,
      status: form.status,
      propertyId: form.propertyId || null,
      contactId: null,
    }
    await api.createLead(payload)
    showForm.value = false
    form.fullName = ''
    form.email = ''
    form.phone = ''
    form.notes = ''
    form.channel = 'WHATSAPP'
    form.status = 'NEW'
    form.propertyId = ''
    await load()
  } catch {
    error.value = 'Falha ao criar lead.'
  } finally {
    creating.value = false
  }
}

const onStatusChange = async (lead: Lead, event: Event) => {
  const status = (event.target as HTMLSelectElement).value as LeadStatus
  await api.updateLead(lead.id, { status })
  await load()
}

const onDelete = async (lead: Lead) => {
  if (!confirm(`Excluir lead de ${lead.fullName}?`)) return
  await api.removeLead(lead.id)
  await load()
}

await load()
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="font-display text-3xl">Leads</h2>
        <p class="mt-1 text-sm text-ink/60">
          Contatos do site e capturas manuais (AdSense, WhatsApp e outros canais).
        </p>
      </div>
      <button
        type="button"
        class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
        @click="showForm = !showForm"
      >
        {{ showForm ? 'Cancelar' : 'Novo lead' }}
      </button>
    </div>

    <form
      v-if="showForm"
      class="grid gap-4 rounded-2xl border border-brand-200 bg-white p-6 sm:grid-cols-2"
      @submit.prevent="onCreate"
    >
      <label class="block text-sm sm:col-span-2">
        Nome
        <input v-model="form.fullName" required class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
      </label>
      <label class="block text-sm">
        E-mail
        <input v-model="form.email" type="email" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
      </label>
      <label class="block text-sm">
        Telefone
        <input v-model="form.phone" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
      </label>
      <label class="block text-sm">
        Canal
        <select v-model="form.channel" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2">
          <option v-for="(label, value) in channelLabel" :key="value" :value="value">{{ label }}</option>
        </select>
      </label>
      <label class="block text-sm">
        Empreendimento (opcional)
        <select v-model="form.propertyId" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2">
          <option value="">Nenhum</option>
          <option v-for="item in properties" :key="item.id" :value="item.id">{{ item.title }}</option>
        </select>
      </label>
      <label class="block text-sm sm:col-span-2">
        Observações
        <textarea v-model="form.notes" rows="3" class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2" />
      </label>
      <div class="sm:col-span-2">
        <button
          type="submit"
          class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
          :disabled="creating"
        >
          {{ creating ? 'Salvando…' : 'Criar lead' }}
        </button>
      </div>
    </form>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-ink/50">Carregando…</p>

    <div v-else class="overflow-x-auto rounded-2xl border border-brand-200 bg-white">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="border-b border-brand-100 bg-brand-50/60 text-xs uppercase tracking-wider text-ink/50">
          <tr>
            <th class="px-4 py-3">Nome</th>
            <th class="px-4 py-3">Canal</th>
            <th class="px-4 py-3">Contato</th>
            <th class="px-4 py-3">Imóvel</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in leads" :key="lead.id" class="border-b border-brand-50 last:border-0">
            <td class="px-4 py-3">
              <p class="font-medium">{{ lead.fullName }}</p>
              <p v-if="lead.contactId" class="text-xs text-brand-700">Via site (contato {{ lead.contactId.slice(0, 8) }}…)</p>
            </td>
            <td class="px-4 py-3">{{ channelLabel[lead.channel] }}</td>
            <td class="px-4 py-3">
              <p>{{ lead.email || '—' }}</p>
              <p class="text-xs text-ink/50">{{ lead.phone || '' }}</p>
            </td>
            <td class="px-4 py-3">{{ propertyTitle(lead.propertyId) }}</td>
            <td class="px-4 py-3">
              <select
                class="rounded-lg border border-brand-200 px-2 py-1"
                :value="lead.status"
                @change="onStatusChange(lead, $event)"
              >
                <option v-for="(label, value) in statusLabel" :key="value" :value="value">{{ label }}</option>
              </select>
            </td>
            <td class="px-4 py-3 text-right">
              <button type="button" class="text-red-600 hover:underline" @click="onDelete(lead)">Excluir</button>
            </td>
          </tr>
          <tr v-if="leads.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-ink/50">Nenhum lead ainda.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
