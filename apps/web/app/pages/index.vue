<script setup lang="ts">
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-vue-next'

useSiteSeoHead()

const config = useRuntimeConfig()
const { featuredProject, allProjects } = useProjects()
const { testimonials } = useTestimonials()
const { whatsappHref } = useWhatsapp()
const apiBase = useApiBaseUrl()

const steps = [
  {
    title: 'Diagnóstico',
    text: 'Entendimento do perfil de compra e objetivos antes de apresentar qualquer empreendimento.',
    icon: ClipboardCheck,
  },
  {
    title: 'Curadoria',
    text: 'Seleção de oportunidades alinhadas ao seu perfil, prazo e potencial de valorização.',
    icon: Sparkles,
  },
  {
    title: 'Condução comercial',
    text: 'Apresentação e encaminhamento junto à incorporadora, com transparência em cada etapa.',
    icon: BadgeCheck,
  },
]

const opportunityStats = computed(() => [
  {
    value: String(allProjects.value.length),
    label: 'empreendimentos em curadoria',
    icon: Sparkles,
  },
  {
    value: '2h',
    label: 'retorno em horário útil',
    icon: Clock3,
  },
  {
    value: '100%',
    label: 'apresentação comercial autorizada',
    icon: ShieldCheck,
  },
])

const contactReasons = [
  {
    label: 'Atendimento personalizado',
    text: 'Você recebe opções alinhadas ao objetivo antes de marcar visita.',
    icon: CheckCircle2,
  },
  {
    label: 'Sem compromisso',
    text: 'Primeiro contato para entender cenário, prazo e preferência.',
    icon: ShieldCheck,
  },
  {
    label: 'Consultora especializada',
    text: 'Condução comercial junto à incorporadora responsável.',
    icon: CalendarCheck2,
  },
]

const contactTriggers = [
  {
    title: 'Evite perder tempo',
    text: 'Filtramos localização, fase da obra e perfil de compra antes da apresentação.',
    icon: TrendingUp,
  },
  {
    title: 'Condições sob consulta',
    text: 'O contato libera disponibilidade atualizada e próximos passos comerciais.',
    icon: MessageCircle,
  },
]

const form = reactive({
  name: '',
  email: '',
  phone: '',
  propertyType: 'Apartamento',
  message: '',
})

const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

const contactEmail = computed(() => String(config.public.contactEmail || 'contato@gutierresconsultoria.com.br'))
const displayPhone = computed(() => String(config.public.businessPhone || 'Atualize o telefone no ambiente'))

const submitLabel = computed(() => {
  if (submitting.value) return 'Enviando…'
  return form.name ? `Solicitar contato, ${form.name.split(' ')[0]}` : 'Solicitar contato'
})

async function submitLead() {
  submitError.value = ''
  submitSuccess.value = false
  submitting.value = true

  const composedMessage = [
    `Tipo de imóvel: ${form.propertyType}`,
    form.message ? form.message : null,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    await $fetch(`${apiBase.value}/contacts`, {
      method: 'POST',
      body: {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        message: composedMessage,
      },
    })
    submitSuccess.value = true
    form.message = ''
  } catch {
    submitError.value = 'Não foi possível enviar. Tente novamente ou fale pelo WhatsApp.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main>
    <ProjectFeaturedHero v-if="featuredProject" :project="featuredProject" />

    <section id="empreendimentos" class="bg-paper py-20 sm:py-24">
      <div class="container-page">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span class="section-kicker">Empreendimentos</span>
            <h2 class="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Oportunidades selecionadas
            </h2>
          </div>
          <p class="max-w-lg text-sm leading-7 text-slate-600">
            Empreendimentos apresentados com autorização comercial das incorporadoras. Atuo na
            consultoria de vendas — não na intermediação de corretagem.
          </p>
        </div>

        <div class="mt-10 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-card md:grid-cols-3">
          <div
            v-for="stat in opportunityStats"
            :key="stat.label"
            class="flex min-w-0 items-center gap-4 rounded-md bg-slate-50 px-4 py-4"
          >
            <span class="grid size-11 shrink-0 place-items-center rounded-md bg-white text-brand-600 shadow-sm">
              <component :is="stat.icon" class="size-5" aria-hidden="true" />
            </span>
            <span class="min-w-0">
              <strong class="block font-display text-2xl leading-none text-ink">{{ stat.value }}</strong>
              <span class="mt-1 block text-[0.68rem] font-semibold uppercase leading-4 tracking-wider text-slate-500">
                {{ stat.label }}
              </span>
            </span>
          </div>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard v-for="item in allProjects" :key="item.slug" :project="item" />
        </div>
      </div>
    </section>

    <section id="servicos" class="bg-white py-20 sm:py-24">
      <div class="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span class="section-kicker">Serviços</span>
          <h2 class="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Consultoria de vendas imobiliárias
          </h2>
          <p class="mt-5 text-sm leading-7 text-slate-600">
            Conecto compradores qualificados aos melhores empreendimentos do mercado, com
            acompanhamento comercial personalizado em cada etapa da jornada de compra.
          </p>
          <p class="mt-4 rounded-md border border-brand-200/60 bg-brand-50/50 px-4 py-3 text-xs leading-6 text-slate-600">
            <strong class="text-ink">Importante:</strong> Atuo como consultora de vendas, não como
            corretora de imóveis. Não possuímos registro CRECI.
          </p>
        </div>
        <div class="grid gap-4">
          <article
            v-for="(step, index) in steps"
            :key="step.title"
            class="grid gap-4 rounded-lg border border-slate-200/80 bg-paper p-5 sm:grid-cols-[auto_1fr]"
          >
            <span class="grid size-12 place-items-center rounded-md bg-brand-100 text-brand-700">
              <component :is="step.icon" class="size-6" aria-hidden="true" />
            </span>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-brand-600">
                Etapa {{ index + 1 }}
              </p>
              <h3 class="mt-1 font-display text-lg font-semibold">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ step.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="depoimentos" class="bg-paper py-20 sm:py-24">
      <div class="container-page">
        <span class="section-kicker">Depoimentos</span>
        <h2 class="mt-5 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
          O que dizem sobre a consultoria
        </h2>
        <div v-if="testimonials?.length" class="mt-10 grid gap-5 lg:grid-cols-3">
          <figure
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="rounded-lg bg-white p-6 shadow-card ring-1 ring-slate-200/60"
          >
            <div class="mb-4 flex gap-1 text-brand-500">
              <Star
                v-for="star in testimonial.rating || 5"
                :key="star"
                class="size-4 fill-current"
                aria-hidden="true"
              />
            </div>
            <blockquote class="text-sm leading-7 text-slate-700">
              "{{ testimonial.quote }}"
            </blockquote>
            <figcaption class="mt-5">
              <strong class="block text-sm">{{ testimonial.name }}</strong>
              <span class="text-xs text-slate-500">{{ testimonial.role }}</span>
            </figcaption>
          </figure>
        </div>
        <p v-else class="mt-10 text-sm text-slate-500">Depoimentos em breve.</p>
      </div>
    </section>

    <section id="contato" class="bg-white py-20 sm:py-24">
      <div class="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <span class="section-kicker">Contato</span>
          <h2 class="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Agende sua consultoria
          </h2>
          <p class="mt-5 text-sm leading-7 text-slate-600">
            Responderemos em até 2 horas úteis. Estou pronta para entender seu objetivo e
            apresentar as melhores oportunidades comerciais.
          </p>

          <div class="mt-8 grid gap-3">
            <div
              v-for="trigger in contactTriggers"
              :key="trigger.title"
              class="flex gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <span class="grid size-10 shrink-0 place-items-center rounded-md bg-white text-brand-600 shadow-sm">
                <component :is="trigger.icon" class="size-5" aria-hidden="true" />
              </span>
              <span>
                <strong class="block text-sm text-ink">{{ trigger.title }}</strong>
                <span class="mt-1 block text-sm leading-6 text-slate-600">{{ trigger.text }}</span>
              </span>
            </div>
          </div>

          <div class="mt-10 grid gap-4">
            <div v-for="reason in contactReasons" :key="reason.label" class="flex items-center gap-4">
              <span class="grid size-10 place-items-center rounded-full bg-brand-50 text-brand-600">
                <component :is="reason.icon" class="size-5" aria-hidden="true" />
              </span>
              <span>
                <span class="block text-sm font-semibold">{{ reason.label }}</span>
                <span class="mt-0.5 block text-xs leading-5 text-slate-500">{{ reason.text }}</span>
              </span>
            </div>
          </div>

          <div class="mt-10 grid gap-3 text-sm text-slate-600">
            <a class="focus-ring inline-flex items-center gap-3 rounded-md font-medium" :href="`mailto:${contactEmail}`">
              <Mail class="size-4 text-brand-600" aria-hidden="true" />
              {{ contactEmail }}
            </a>
            <a class="focus-ring inline-flex items-center gap-3 rounded-md font-medium" href="#contato">
              <Phone class="size-4 text-brand-600" aria-hidden="true" />
              {{ displayPhone }}
            </a>
          </div>
        </div>

        <form class="rounded-lg bg-white p-6 shadow-card ring-1 ring-slate-200 sm:p-8" @submit.prevent="submitLead">
          <div class="mb-6 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3">
            <p class="text-xs font-semibold uppercase tracking-widest text-brand-700">
              Prioridade de atendimento
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              Preencha os dados essenciais. Cadastramos seu contato e retornamos em horário útil.
            </p>
          </div>

          <div class="grid gap-5">
            <label class="grid gap-1.5">
              <span class="text-sm font-medium">Nome completo</span>
              <input
                v-model="form.name"
                class="focus-ring h-12 rounded-md border border-slate-200 px-4 text-sm"
                name="name"
                autocomplete="name"
                placeholder="Seu nome completo"
                required
              />
            </label>

            <div class="grid gap-5 sm:grid-cols-2">
              <label class="grid gap-1.5">
                <span class="text-sm font-medium">E-mail</span>
                <input
                  v-model="form.email"
                  class="focus-ring h-12 rounded-md border border-slate-200 px-4 text-sm"
                  name="email"
                  type="email"
                  autocomplete="email"
                  placeholder="seu@email.com"
                  required
                />
              </label>
              <label class="grid gap-1.5">
                <span class="text-sm font-medium">Telefone</span>
                <input
                  v-model="form.phone"
                  class="focus-ring h-12 rounded-md border border-slate-200 px-4 text-sm"
                  name="phone"
                  autocomplete="tel"
                  placeholder="(00) 00000-0000"
                  required
                />
              </label>
            </div>

            <label class="grid gap-1.5">
              <span class="text-sm font-medium">Tipo de imóvel</span>
              <select
                v-model="form.propertyType"
                class="focus-ring h-12 rounded-md border border-slate-200 px-4 text-sm"
                name="propertyType"
              >
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Terreno</option>
                <option>Comercial</option>
                <option>Investimento</option>
              </select>
            </label>

            <label class="grid gap-1.5">
              <span class="text-sm font-medium">Mensagem</span>
              <textarea
                v-model="form.message"
                class="focus-ring min-h-32 rounded-md border border-slate-200 px-4 py-3 text-sm"
                name="message"
                maxlength="500"
                placeholder="Conte-nos o que você procura..."
              />
              <span class="text-right text-xs text-slate-400">{{ form.message.length }}/500</span>
            </label>

            <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>
            <p v-if="submitSuccess" class="text-sm text-emerald-700">
              Contato enviado! Em breve retornaremos.
              <a
                v-if="whatsappHref !== '#contato'"
                :href="whatsappHref"
                class="ml-1 font-semibold text-brand-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Preferir WhatsApp?
              </a>
            </p>

            <button
              class="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-500 px-6 text-sm font-semibold text-ink transition hover:bg-brand-400 disabled:opacity-60"
              type="submit"
              :disabled="submitting"
            >
              {{ submitLabel }}
              <Send class="size-4" aria-hidden="true" />
            </button>
          </div>
          <p class="mt-6 text-center text-xs text-slate-400">
            Seus dados são usados apenas para retorno comercial. Sem compromisso de compra.
          </p>
        </form>
      </div>
    </section>

    <section class="bg-ink py-14 text-white">
      <div class="container-page flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-brand-400">Stefanny Gutierres</p>
          <h2 class="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Receba a curadoria antes de visitar o empreendimento.
          </h2>
          <p class="mt-3 max-w-xl text-sm leading-6 text-white/60">
            Uma conversa rápida evita propostas fora do perfil e acelera a escolha certa.
          </p>
        </div>
        <a
          :href="whatsappHref"
          class="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-brand-500 px-8 py-4 text-sm font-semibold text-ink transition hover:bg-brand-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          Falar agora
          <ArrowRight class="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  </main>
</template>
