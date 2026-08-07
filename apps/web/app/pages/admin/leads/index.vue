<script setup lang="ts">
import type { CreateLeadInput, Lead, LeadChannel, LeadStatus, Property, UpdateLeadInput } from '@gutierres/shared'

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
const saving = ref(false)
const showForm = ref(false)
const selectedLead = ref<Lead | null>(null)
const draggingId = ref<string | null>(null)
const dropTarget = ref<LeadStatus | null>(null)
const didDrag = ref(false)

const columns: { status: LeadStatus; label: string }[] = [
  { status: 'NEW', label: 'Novo' },
  { status: 'CONTACTED', label: 'Contatado' },
  { status: 'QUALIFIED', label: 'Qualificado' },
  { status: 'CONVERTED', label: 'Convertido' },
  { status: 'LOST', label: 'Perdido' },
]

const channelLabel: Record<LeadChannel, string> = {
  WEBSITE: 'Site',
  ADSENSE: 'AdSense',
  WHATSAPP: 'WhatsApp',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  REFERRAL: 'Indicação',
  OTHER: 'Outro',
}

/** Labels por canal — tons alinhados ao tema brand */
const channelTone: Record<LeadChannel, string> = {
  WEBSITE: 'bg-brand-100 text-brand-800',
  ADSENSE: 'bg-amber-100 text-amber-900',
  WHATSAPP: 'bg-emerald-100 text-emerald-900',
  INSTAGRAM: 'bg-rose-100 text-rose-900',
  FACEBOOK: 'bg-sky-100 text-sky-900',
  REFERRAL: 'bg-brand-200 text-brand-900',
  OTHER: 'bg-stone-200 text-stone-800',
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

const detail = reactive({
  fullName: '',
  email: '',
  phone: '',
  notes: '',
  channel: 'OTHER' as LeadChannel,
  status: 'NEW' as LeadStatus,
  propertyId: '',
})

const leadsByStatus = computed(() => {
  const map = Object.fromEntries(columns.map((col) => [col.status, [] as Lead[]])) as Record<
    LeadStatus,
    Lead[]
  >
  for (const lead of leads.value) {
    map[lead.status]?.push(lead)
  }
  return map
})

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')

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

const formatDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const resetCreateForm = () => {
  form.fullName = ''
  form.email = ''
  form.phone = ''
  form.notes = ''
  form.channel = 'WHATSAPP'
  form.status = 'NEW'
  form.propertyId = ''
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
    resetCreateForm()
    await load()
  } catch {
    error.value = 'Falha ao criar lead.'
  } finally {
    creating.value = false
  }
}

const openLead = (lead: Lead) => {
  if (didDrag.value) {
    didDrag.value = false
    return
  }
  selectedLead.value = lead
  detail.fullName = lead.fullName
  detail.email = lead.email || ''
  detail.phone = lead.phone || ''
  detail.notes = lead.notes || ''
  detail.channel = lead.channel
  detail.status = lead.status
  detail.propertyId = lead.propertyId || ''
}

const closeLead = () => {
  selectedLead.value = null
}

const onSaveDetail = async () => {
  if (!selectedLead.value) return
  saving.value = true
  error.value = ''
  try {
    const payload: UpdateLeadInput = {
      fullName: detail.fullName,
      email: detail.email || null,
      phone: detail.phone || null,
      notes: detail.notes || null,
      channel: detail.channel,
      status: detail.status,
      propertyId: detail.propertyId || null,
    }
    const updated = await api.updateLead(selectedLead.value.id, payload)
    const idx = leads.value.findIndex((item) => item.id === updated.id)
    if (idx >= 0) leads.value[idx] = updated
    else await load()
    selectedLead.value = updated
  } catch {
    error.value = 'Falha ao salvar lead.'
  } finally {
    saving.value = false
  }
}

const moveLead = async (leadId: string, status: LeadStatus) => {
  const lead = leads.value.find((item) => item.id === leadId)
  if (!lead || lead.status === status) return

  const previous = lead.status
  lead.status = status
  try {
    const updated = await api.updateLead(leadId, { status })
    const idx = leads.value.findIndex((item) => item.id === updated.id)
    if (idx >= 0) leads.value[idx] = updated
  } catch {
    lead.status = previous
    error.value = 'Não foi possível mover o lead.'
  }
}

const onDragStart = (lead: Lead, event: DragEvent) => {
  didDrag.value = true
  draggingId.value = lead.id
  event.dataTransfer?.setData('text/plain', lead.id)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

const onDragEnd = () => {
  draggingId.value = null
  dropTarget.value = null
  requestAnimationFrame(() => {
    didDrag.value = false
  })
}

const onDragOver = (status: LeadStatus, event: DragEvent) => {
  event.preventDefault()
  dropTarget.value = status
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
}

const onDrop = async (status: LeadStatus, event: DragEvent) => {
  event.preventDefault()
  const leadId = event.dataTransfer?.getData('text/plain') || draggingId.value
  dropTarget.value = null
  draggingId.value = null
  if (!leadId) return
  await moveLead(leadId, status)
}

const onDelete = async (lead: Lead) => {
  if (!confirm(`Excluir lead de ${lead.fullName}?`)) return
  await api.removeLead(lead.id)
  if (selectedLead.value?.id === lead.id) closeLead()
  await load()
}

const closeCreate = () => {
  showForm.value = false
}

const openCreate = (status: LeadStatus = 'NEW') => {
  form.status = status
  showForm.value = true
}

const onBackdropClick = (event: MouseEvent) => {
  if (event.target !== event.currentTarget) return
  if (selectedLead.value) closeLead()
  else if (showForm.value) closeCreate()
}

const onEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  if (selectedLead.value) closeLead()
  else if (showForm.value) closeCreate()
}

const quickAdd = (status: LeadStatus) => {
  openCreate(status)
}

onMounted(() => window.addEventListener('keydown', onEscape))
onUnmounted(() => window.removeEventListener('keydown', onEscape))

await load()
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="font-display text-3xl">Leads</h2>
        <p class="mt-1 text-sm text-ink/60">
          Quadro estilo pipeline — arraste os cartões entre as listas.
        </p>
      </div>
      <button
        type="button"
        class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
        @click="openCreate('NEW')"
      >
        Novo lead
      </button>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-ink/50">Carregando…</p>

    <div v-else class="overflow-x-auto pb-2">
      <div class="flex w-max items-start gap-3">
        <section
          v-for="column in columns"
          :key="column.status"
          class="flex max-h-[70vh] w-[272px] shrink-0 flex-col rounded-2xl border border-brand-200/70 bg-brand-50/70 transition"
          :class="dropTarget === column.status ? 'outline outline-2 outline-brand-500' : ''"
          @dragover="onDragOver(column.status, $event)"
          @drop="onDrop(column.status, $event)"
        >
          <header class="flex items-center justify-between gap-2 px-3 pb-1 pt-3">
            <h3 class="truncate text-sm font-semibold tracking-tight text-ink">
              {{ column.label }}
            </h3>
            <span
              class="grid min-w-6 place-items-center rounded-full bg-white px-1.5 py-0.5 text-[11px] font-semibold text-ink/50 ring-1 ring-brand-200"
            >
              {{ leadsByStatus[column.status].length }}
            </span>
          </header>

          <div class="flex-1 space-y-2 overflow-y-auto px-2 pb-1 pt-1">
            <article
              v-for="lead in leadsByStatus[column.status]"
              :key="lead.id"
              draggable="true"
              class="group cursor-pointer rounded-xl border border-brand-100 bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft active:cursor-grabbing"
              :class="draggingId === lead.id ? 'rotate-1 opacity-60' : ''"
              @dragstart="onDragStart(lead, $event)"
              @dragend="onDragEnd"
              @click="openLead(lead)"
            >
              <div class="mb-2 flex flex-wrap gap-1">
                <span
                  class="inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  :class="channelTone[lead.channel]"
                >
                  {{ channelLabel[lead.channel] }}
                </span>
              </div>

              <p class="text-sm font-semibold leading-snug text-ink">
                {{ lead.fullName }}
              </p>

              <p
                v-if="lead.notes"
                class="mt-1 line-clamp-2 text-xs leading-4 text-ink/55"
              >
                {{ lead.notes }}
              </p>

              <div class="mt-2.5 flex items-center justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <p
                    v-if="lead.propertyId"
                    class="truncate text-[11px] text-brand-700"
                    :title="propertyTitle(lead.propertyId)"
                  >
                    {{ propertyTitle(lead.propertyId) }}
                  </p>
                  <p
                    v-else-if="lead.phone || lead.email"
                    class="truncate text-[11px] text-ink/50"
                  >
                    {{ lead.phone || lead.email }}
                  </p>
                </div>
                <span
                  class="grid size-7 shrink-0 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-white"
                  :title="lead.fullName"
                >
                  {{ initials(lead.fullName) }}
                </span>
              </div>
            </article>
          </div>

          <button
            type="button"
            class="mx-2 mb-2 mt-1 flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-left text-sm text-ink/55 transition hover:bg-brand-100 hover:text-ink"
            @click="quickAdd(column.status)"
          >
            <span class="text-lg leading-none">+</span>
            Adicionar um cartão
          </button>
        </section>
      </div>
    </div>

    <!-- Modal: novo lead -->
    <Teleport to="body">
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 sm:pt-16"
        @click="onBackdropClick"
      >
        <div
          class="mb-10 w-full max-w-lg overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-soft"
          role="dialog"
          aria-modal="true"
          aria-label="Novo lead"
        >
          <div class="flex items-center justify-between border-b border-brand-100 px-5 py-4">
            <h3 class="font-display text-xl text-ink">Novo lead</h3>
            <button
              type="button"
              class="grid size-8 place-items-center rounded-full text-xl text-ink/50 hover:bg-brand-50"
              aria-label="Fechar"
              @click="closeCreate"
            >
              ×
            </button>
          </div>

          <form class="grid gap-4 p-5 sm:grid-cols-2" @submit.prevent="onCreate">
            <label class="block text-sm text-ink/70 sm:col-span-2">
              Nome
              <input
                v-model="form.fullName"
                required
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
              />
            </label>
            <label class="block text-sm text-ink/70">
              E-mail
              <input
                v-model="form.email"
                type="email"
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
              />
            </label>
            <label class="block text-sm text-ink/70">
              Telefone
              <input
                v-model="form.phone"
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
              />
            </label>
            <label class="block text-sm text-ink/70">
              Canal
              <select
                v-model="form.channel"
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
              >
                <option v-for="(label, value) in channelLabel" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
            </label>
            <label class="block text-sm text-ink/70">
              Lista inicial
              <select
                v-model="form.status"
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
              >
                <option v-for="(label, value) in statusLabel" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
            </label>
            <label class="block text-sm text-ink/70 sm:col-span-2">
              Empreendimento (opcional)
              <select
                v-model="form.propertyId"
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
              >
                <option value="">Nenhum</option>
                <option v-for="item in properties" :key="item.id" :value="item.id">
                  {{ item.title }}
                </option>
              </select>
            </label>
            <label class="block text-sm text-ink/70 sm:col-span-2">
              Observações
              <textarea
                v-model="form.notes"
                rows="3"
                class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
              />
            </label>
            <div class="flex justify-end gap-2 sm:col-span-2">
              <button
                type="button"
                class="rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-ink hover:bg-brand-50"
                @click="closeCreate"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
                :disabled="creating"
              >
                {{ creating ? 'Salvando…' : 'Criar lead' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="selectedLead"
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-10 sm:pt-16"
        @click="onBackdropClick"
      >
        <div
          class="mb-10 w-full max-w-[768px] overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 shadow-soft"
          role="dialog"
          aria-modal="true"
          :aria-label="`Lead ${selectedLead.fullName}`"
        >
          <div class="border-b border-brand-100 bg-white px-5 py-4">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="mb-2 flex flex-wrap gap-1">
                  <span
                    class="inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase"
                    :class="channelTone[selectedLead.channel]"
                  >
                    {{ channelLabel[selectedLead.channel] }}
                  </span>
                  <span class="inline-block rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-800">
                    {{ statusLabel[selectedLead.status] }}
                  </span>
                </div>
                <h3 class="font-display text-2xl leading-tight text-ink">
                  {{ selectedLead.fullName }}
                </h3>
                <p class="mt-1 text-xs text-ink/50">
                  na lista <strong class="text-ink/70">{{ statusLabel[selectedLead.status] }}</strong>
                  · criado {{ formatDate(selectedLead.createdAt) }}
                </p>
              </div>
              <button
                type="button"
                class="grid size-8 shrink-0 place-items-center rounded-full text-xl text-ink/50 hover:bg-brand-50"
                aria-label="Fechar"
                @click="closeLead"
              >
                ×
              </button>
            </div>
          </div>

          <form class="grid gap-4 p-5 sm:grid-cols-[1fr_200px]" @submit.prevent="onSaveDetail">
            <div class="space-y-4">
              <section class="rounded-xl border border-brand-100 bg-white p-4 shadow-card">
                <h4 class="mb-3 text-xs font-bold uppercase tracking-wide text-ink/50">
                  Descrição / observações
                </h4>
                <textarea
                  v-model="detail.notes"
                  rows="5"
                  placeholder="Adicione uma descrição mais detalhada…"
                  class="w-full rounded-xl border-0 bg-brand-50 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:outline focus:outline-2 focus:outline-brand-400"
                />
              </section>

              <section class="rounded-xl border border-brand-100 bg-white p-4 shadow-card">
                <h4 class="mb-3 text-xs font-bold uppercase tracking-wide text-ink/50">
                  Informações do contato
                </h4>
                <div class="grid gap-3 sm:grid-cols-2">
                  <label class="block text-sm text-ink/70">
                    Nome
                    <input
                      v-model="detail.fullName"
                      required
                      class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
                    />
                  </label>
                  <label class="block text-sm text-ink/70">
                    Telefone
                    <input
                      v-model="detail.phone"
                      class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
                    />
                  </label>
                  <label class="block text-sm text-ink/70 sm:col-span-2">
                    E-mail
                    <input
                      v-model="detail.email"
                      type="email"
                      class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
                    />
                  </label>
                  <label class="block text-sm text-ink/70 sm:col-span-2">
                    Empreendimento
                    <select
                      v-model="detail.propertyId"
                      class="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 text-ink"
                    >
                      <option value="">Nenhum</option>
                      <option v-for="item in properties" :key="item.id" :value="item.id">
                        {{ item.title }}
                      </option>
                    </select>
                  </label>
                </div>
                <p
                  v-if="selectedLead.contactId"
                  class="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-xs text-brand-800"
                >
                  Originado pelo formulário do site.
                </p>
              </section>
            </div>

            <aside class="space-y-3">
              <div>
                <p class="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink/50">
                  Ações
                </p>
                <label class="mb-2 block text-xs text-ink/60">
                  Mover para
                  <select
                    v-model="detail.status"
                    class="mt-1 w-full rounded-xl border border-brand-200 bg-white px-2 py-2 text-sm"
                  >
                    <option v-for="(label, value) in statusLabel" :key="value" :value="value">
                      {{ label }}
                    </option>
                  </select>
                </label>
                <label class="mb-2 block text-xs text-ink/60">
                  Canal
                  <select
                    v-model="detail.channel"
                    class="mt-1 w-full rounded-xl border border-brand-200 bg-white px-2 py-2 text-sm"
                  >
                    <option v-for="(label, value) in channelLabel" :key="value" :value="value">
                      {{ label }}
                    </option>
                  </select>
                </label>
                <button
                  type="submit"
                  class="mt-2 w-full rounded-full bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
                  :disabled="saving"
                >
                  {{ saving ? 'Salvando…' : 'Salvar' }}
                </button>
                <button
                  type="button"
                  class="mt-2 w-full rounded-full border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  @click="onDelete(selectedLead)"
                >
                  Excluir
                </button>
              </div>
              <p class="text-[11px] leading-4 text-ink/45">
                Atualizado {{ formatDate(selectedLead.updatedAt) }}
              </p>
            </aside>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
