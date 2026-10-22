<script setup lang="ts">
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  Key,
  Lock,
  MessageCircle,
  Send,
  ShieldCheck,
  Sliders,
  Sparkles,
} from 'lucide-vue-next'
import type { SoldCase } from '@gutierres/shared'
import type { Project } from '~/types/project'

const settings = useSiteSettings()
const origin = usePublicSiteOrigin()

const homeTitle = computed(() => {
  const name = settings.siteName.value
  const loc = settings.seoLocality.value.trim()
  const base = loc
    ? `Consultoria imobiliária em ${loc} | ${name}`
    : `Consultora de vendas imobiliárias | ${name}`
  return limitSeoText(base, 65)
})

const homeDescription = computed(() => {
  const name = settings.siteName.value
  const loc = settings.seoLocality.value.trim()
  const localBit = loc ? ` em ${loc}` : ''
  return limitSeoText(
    `${name}: consultoria de vendas imobiliárias${localBit}. Curadoria de empreendimentos e acompanhamento comercial — sem registro CRECI.`,
    160,
  )
})

const homeCanonical = computed(() => {
  const o = origin.value
  return o ? `${o}/` : ''
})

useSeoMeta({
  title: homeTitle,
  description: homeDescription,
  ogTitle: homeTitle,
  ogDescription: homeDescription,
  ogUrl: homeCanonical,
  twitterTitle: homeTitle,
  twitterDescription: homeDescription,
})

useHead(() => ({
  link: homeCanonical.value ? [{ rel: 'canonical', href: homeCanonical.value }] : [],
}))

useJsonLdGraph('schema-home', () => {
  const home = homeCanonical.value || '/'
  return [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: home,
        },
      ],
    },
  ]
})

const { featuredProject, allProjects } = useProjects()
const { soldCases } = useSoldCases()
const { whatsappHref, onWhatsAppClick } = useWhatsapp()
const { trackLead } = useAnalytics()
const apiBase = useApiBase()

const fallbackProjects: Project[] = [
  {
    slug: 'reserva-jardins',
    title: 'Reserva Jardins',
    location: 'Jardins, São Paulo',
    status: 'Lançamento',
    description:
      'Penthouses & Residences privativas com vista desimpedida para a copa das árvores dos Jardins. Elevadores privativos codificados.',
    longDescription: '',
    deadline: '2026-12-01',
    progress: 85,
    featured: true,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    floorPlanImage: '',
    highlights: ['320m² a 640m²', 'Vista Parque'],
    gallery: [],
  },
  {
    slug: 'horizonte-itaim',
    title: 'Horizonte Itaim',
    location: 'Itaim Bibi, São Paulo',
    status: 'Em construção',
    description:
      'Studios & Duplex de Alto Padrão concebidos para alta rentabilidade de locação e valorização patrimonial na Faria Lima.',
    longDescription: '',
    deadline: '2026-08-01',
    progress: 60,
    featured: false,
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    highlights: ['85m² a 190m²', 'Faria Lima'],
    floorPlanImage: '',
    gallery: [],
  },
  {
    slug: 'villa-fasano-vista',
    title: 'Villa Fasano Vista',
    location: 'Fazenda Boa Vista, SP',
    status: 'Pronto para morar',
    description:
      'Residências de campo assinadas com vista panorâmica perene, serviços de hotelaria Fasano e infraestrutura equestre completa.',
    longDescription: '',
    deadline: '2025-10-01',
    progress: 100,
    featured: false,
    image:
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Terrenos & 720m²', 'Acesso Restrito'],
    floorPlanImage: '',
    gallery: [],
  },
]

const displayProjects = computed(() => {
  return allProjects.value.length ? allProjects.value : fallbackProjects
})

const fallbackSoldCases: SoldCase[] = [
  {
    id: 'case-1',
    propertyTitle: 'Cobertura Exclusiva no Itaim Bibi',
    location: 'Itaim Bibi, São Paulo',
    coverUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    coverStoragePath: null,
    clientName: 'M. Silveira',
    clientRole: 'Investidor Patrimonial • São Paulo',
    quote:
      'Encontrei a cobertura perfeita no Itaim sem precisar visitar dezenas de estandes. A curadoria da Stefanny filtrou exatamente o que buscávamos em termos de insolação e privacidade, conduzindo as negociações direto com a mesa diretora.',
    soldAt: new Date('2024-08-15'),
    sortOrder: 1,
    active: true,
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-15'),
  },
  {
    id: 'case-2',
    propertyTitle: 'Apartamento de Alto Padrão nos Jardins',
    location: 'Jardins, São Paulo',
    coverUrl:
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    coverStoragePath: null,
    clientName: 'Dra. Camila F.',
    clientRole: 'Médica Especialista • Jardins',
    quote:
      'Comprei meu primeiro apartamento de alto padrão com total segurança nas cláusulas e negociação direta com a construtora. Stefanny me deu o respaldo analítico que faltava.',
    soldAt: new Date('2024-05-20'),
    sortOrder: 2,
    active: true,
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-05-20'),
  },
]

const displaySoldCases = computed(() => {
  return soldCases.value?.length ? soldCases.value : fallbackSoldCases
})

const form = reactive({
  name: '',
  email: '',
  phone: '',
  propertyType: 'Residencial de Alto Padrão (Apartamento)',
  message: '',
})

const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

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
    trackLead('contact_form')
  } catch {
    submitError.value = 'Não foi possível enviar. Tente novamente ou fale pelo WhatsApp.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="w-full bg-surface-dark text-on-surface">
    <!-- 1. FEATURED HERO -->
    <ProjectFeaturedHero :project="featuredProject" />

    <!-- 2. OPORTUNIDADES SELECIONADAS (Ivory Canvas #FAF8F3) -->
    <section
      id="empreendimentos"
      class="w-full bg-canvas-light text-text-strong py-20 sm:py-28 scroll-mt-20 sm:scroll-mt-24"
    >
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-16">
        <!-- Header with Authorization Stamp -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="flex flex-col gap-3 max-w-2xl">
            <div class="flex items-center gap-2">
              <span class="h-[1px] w-8 bg-brand-gold-deep" />
              <span
                class="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep font-label"
              >
                PORTFÓLIO AUTORIZADO
              </span>
            </div>
            <h2
              class="font-display text-3xl font-semibold sm:text-4xl lg:text-5xl text-text-strong tracking-tight"
            >
              Empreendimentos com Curadoria Exclusiva
            </h2>
            <p class="text-base text-text-base leading-relaxed">
              Projetos residenciais de assinatura arquitetônica que passam por rigorosa auditoria de
              valor m², reputação de entrega e liquidez secundária.
            </p>
          </div>

          <!-- Commercial Authorization Stamp -->
          <div
            class="flex items-center gap-2.5 rounded-sm border border-stroke-light bg-surface-light px-4 py-3 shadow-sm"
          >
            <ShieldCheck class="size-5 text-success shrink-0" aria-hidden="true" />
            <span class="text-xs text-text-muted">
              Atuação com autorização comercial direta das incorporadoras mais renomadas.
            </span>
          </div>
        </div>

        <!-- 3-Column Curated Cards Matrix -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard v-for="item in displayProjects" :key="item.slug" :project="item" />
        </div>

        <!-- Discovery Action -->
        <div class="flex justify-center pt-4">
          <NuxtLink
            to="/empreendimentos"
            class="focus-ring inline-flex items-center gap-2 rounded-sm border border-stroke-light bg-surface-light px-8 py-3.5 text-sm font-semibold text-text-strong shadow-sm transition-all duration-150 hover:border-primary hover:bg-surface-light-alt"
          >
            <span>Ver todos os empreendimentos selecionados</span>
            <ArrowRight class="size-4 text-primary" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 3. METODOLOGIA SG / SERVIÇOS (Warm Ivory #F3EEE3) -->
    <section
      id="servicos"
      class="w-full bg-surface-light-alt text-text-strong py-20 sm:py-28 scroll-mt-20 sm:scroll-mt-24"
    >
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-16">
        <!-- Section Intro -->
        <div class="flex flex-col gap-3 max-w-2xl">
          <div class="flex items-center gap-2">
            <span class="h-[1px] w-8 bg-brand-gold-deep" />
            <span
              class="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep font-label"
            >
              METODOLOGIA SG
            </span>
          </div>
          <h2
            class="font-display text-3xl font-semibold sm:text-4xl lg:text-5xl text-text-strong tracking-tight"
          >
            Como funciona a sua consultoria privada
          </h2>
          <p class="text-base text-text-base leading-relaxed">
            Um modelo estruturado em 3 etapas decisórias para que você decida com total clareza
            matemática, segurança jurídica e discrição.
          </p>
        </div>

        <!-- 3 Distinct Step Columns -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 01 -->
          <div
            class="group flex flex-col justify-between rounded-md border border-stroke-light bg-surface-light p-8 shadow-sm transition-colors duration-150 hover:border-primary"
          >
            <div class="flex flex-col gap-4">
              <span class="font-display text-5xl font-medium leading-none text-primary">01</span>
              <h3 class="font-display text-xl font-semibold text-text-strong">
                Diagnóstico Estratégico
              </h3>
              <p class="text-sm leading-relaxed text-text-base">
                Entendimento minucioso das expectativas, orçamento, estilo de vida e objetivos
                patrimoniais. Mapeio suas necessidades reais sem direcionar para estoques
                desnecessários.
              </p>
            </div>
            <div
              class="mt-8 flex items-center gap-2 border-t border-stroke-light pt-4 text-xs font-semibold uppercase tracking-wider text-text-muted font-label"
            >
              <Sparkles class="size-4 text-brand-gold-deep" aria-hidden="true" />
              <span>Mapeamento Sem Viés Comercial</span>
            </div>
          </div>

          <!-- Step 02 -->
          <div
            class="group flex flex-col justify-between rounded-md border border-stroke-light bg-surface-light p-8 shadow-sm transition-colors duration-150 hover:border-primary"
          >
            <div class="flex flex-col gap-4">
              <span class="font-display text-5xl font-medium leading-none text-primary">02</span>
              <h3 class="font-display text-xl font-semibold text-text-strong">
                Curadoria &amp; Análise
              </h3>
              <p class="text-sm leading-relaxed text-text-base">
                Seleção criteriosa dos projetos mais adequados, analisando liquidez futura,
                potencial de valorização, padrão de acabamento e histórico de entrega da
                incorporadora.
              </p>
            </div>
            <div
              class="mt-8 flex items-center gap-2 border-t border-stroke-light pt-4 text-xs font-semibold uppercase tracking-wider text-text-muted font-label"
            >
              <Clock3 class="size-4 text-brand-gold-deep" aria-hidden="true" />
              <span>Dossiê Comparativo Completo</span>
            </div>
          </div>

          <!-- Step 03 -->
          <div
            class="group flex flex-col justify-between rounded-md border border-stroke-light bg-surface-light p-8 shadow-sm transition-colors duration-150 hover:border-primary"
          >
            <div class="flex flex-col gap-4">
              <span class="font-display text-5xl font-medium leading-none text-primary">03</span>
              <h3 class="font-display text-xl font-semibold text-text-strong">
                Condução Comercial
              </h3>
              <p class="text-sm leading-relaxed text-text-base">
                Acompanhamento personalizado direto com a diretoria comercial da incorporadora,
                garantindo transparência contratual, as melhores condições e total agilidade no
                processo.
              </p>
            </div>
            <div
              class="mt-8 flex items-center gap-2 border-t border-stroke-light pt-4 text-xs font-semibold uppercase tracking-wider text-text-muted font-label"
            >
              <BadgeCheck class="size-4 text-brand-gold-deep" aria-hidden="true" />
              <span>Acesso a Mesas de Diretoria</span>
            </div>
          </div>
        </div>

        <!-- Discreet Regulatory Transparency Card -->
        <div
          class="mx-auto flex max-w-4xl items-start gap-4 rounded-md border border-stroke-light bg-canvas-light p-4"
        >
          <ShieldCheck class="size-5 shrink-0 text-text-muted mt-0.5" aria-hidden="true" />
          <div class="flex flex-col">
            <span
              class="text-xs font-semibold uppercase tracking-widest text-text-muted font-label"
            >
              Conformidade e Transparência
            </span>
            <p class="mt-0.5 text-xs leading-relaxed text-text-muted">
              <strong>Nota Legal:</strong> Não sou corretora de imóveis e não possuo registro CRECI.
              Atuo exclusivamente como consultora de vendas e curadora comercial autorizada
              diretamente pelas incorporadoras parceiras.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. HISTÓRIAS DE SUCESSO / CASES (Dark #0A0A0A) -->
    <section
      id="cases"
      class="relative w-full overflow-hidden bg-ink py-20 text-text-on-dark sm:py-28 scroll-mt-20 sm:scroll-mt-24"
    >
      <!-- Atmospheric gold radial blur -->
      <div
        class="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 bg-primary/5 blur-[140px]"
        aria-hidden="true"
      />

      <div
        class="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-16"
      >
        <!-- Section Header -->
        <div class="mx-auto flex max-w-2xl flex-col items-center text-center gap-3">
          <div class="flex items-center gap-2">
            <span class="h-[1px] w-6 bg-primary" />
            <span class="text-xs font-semibold uppercase tracking-widest text-primary font-label">
              CASES REAIS
            </span>
            <span class="h-[1px] w-6 bg-primary" />
          </div>
          <h2
            class="font-display text-3xl font-semibold sm:text-4xl lg:text-5xl text-text-on-dark tracking-tight"
          >
            Histórias de quem comprou com a consultoria
          </h2>
          <p class="text-base text-text-on-dark-muted">
            Decisões patrimoniais conduzidas com método, confidencialidade e alinhamento total de
            interesses.
          </p>
        </div>

        <!-- Luxury Case Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <ProjectSoldCaseCard v-for="item in displaySoldCases" :key="item.id" :item="item" />
        </div>

        <!-- Bottom Action -->
        <div class="flex justify-center pt-2">
          <a
            :href="whatsappHref"
            class="focus-ring inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-4 text-sm font-semibold text-ink shadow-[0_4px_24px_rgba(197,160,89,0.25)] transition-all duration-150 hover:bg-primary-hover"
            target="_blank"
            rel="noopener noreferrer"
            @click="onWhatsAppClick('sold_cases_cta')"
          >
            <span>Quero minha história de compra</span>
            <ArrowRight class="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <!-- 5. CONTATO / CONSULTORIA (Clean Ivory #FAF8F3) -->
    <section
      id="contato"
      class="w-full bg-canvas-light text-text-strong py-20 sm:py-28 scroll-mt-20 sm:scroll-mt-24"
    >
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <!-- Left Column: Stefanny Portrait & Personal Voice (6 Cols) -->
          <div class="flex flex-col gap-6 lg:col-span-6">
            <div class="flex items-center gap-2">
              <span class="h-[1px] w-8 bg-brand-gold-deep" />
              <span
                class="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep font-label"
              >
                AGENDAMENTO EXCLUSIVO
              </span>
            </div>

            <h2
              class="font-display text-3xl font-semibold sm:text-4xl lg:text-5xl text-text-strong tracking-tight"
            >
              Estou pronta para guiar seu próximo investimento.
            </h2>

            <div class="flex flex-col items-center gap-6 pt-2 sm:flex-row sm:items-start">
              <!-- Portrait Image Framed with 1px gold border -->
              <div class="relative shrink-0">
                <img
                  src="/img/consultora.webp"
                  alt="Stefanny Gutierres - Consultoria de Vendas Imobiliárias"
                  class="size-32 rounded-md object-cover border border-primary shadow-md sm:size-40"
                />
                <span
                  class="absolute -bottom-2 -right-2 grid size-7 place-items-center rounded-full bg-success text-white shadow-sm"
                >
                  <Check class="size-4 stroke-[2.5]" aria-hidden="true" />
                </span>
              </div>

              <div class="flex flex-col gap-1 text-center sm:text-left">
                <span class="text-lg font-semibold text-text-strong">Stefanny Gutierres</span>
                <span
                  class="text-xs font-semibold uppercase tracking-wider text-brand-gold-deep font-label"
                >
                  Consultora de Vendas &amp; Estrategista
                </span>
                <p class="mt-2 text-sm leading-relaxed text-text-base">
                  Sou Stefanny Gutierres, dedicada a transformar a jornada de aquisição imobiliária
                  em uma experiência tranquila, assertiva e discreta. Minha curadoria seleciona
                  apenas os ativos que atendem aos mais altos padrões de solidez e conforto.
                </p>
              </div>
            </div>

            <!-- 3 Key Advisory Pillars -->
            <div class="flex flex-col gap-4 border-t border-stroke-light pt-6">
              <div class="flex items-center gap-4">
                <div
                  class="grid size-10 shrink-0 place-items-center rounded-sm border border-stroke-light bg-surface-light text-primary"
                >
                  <Lock class="size-4" aria-hidden="true" />
                </div>
                <div>
                  <span class="block text-sm font-semibold text-text-strong">
                    Confidencialidade Absoluta
                  </span>
                  <span class="text-xs text-text-muted">
                    Seus dados e intenções patrimoniais protegidos sob estrito sigilo.
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div
                  class="grid size-10 shrink-0 place-items-center rounded-sm border border-stroke-light bg-surface-light text-primary"
                >
                  <Sliders class="size-4" aria-hidden="true" />
                </div>
                <div>
                  <span class="block text-sm font-semibold text-text-strong"
                    >Curadoria Sem Viés</span
                  >
                  <span class="text-xs text-text-muted">
                    Apresento apenas o que converge com o seu perfil, sem empurrar estoques.
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div
                  class="grid size-10 shrink-0 place-items-center rounded-sm border border-stroke-light bg-surface-light text-primary"
                >
                  <Key class="size-4" aria-hidden="true" />
                </div>
                <div>
                  <span class="block text-sm font-semibold text-text-strong">
                    Acesso a Condições Exclusivas
                  </span>
                  <span class="text-xs text-text-muted">
                    Canal direto com as incorporadoras para reservas prioritárias.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Advisory Booking Form Card (6 Cols) -->
          <div class="lg:col-span-6">
            <div
              class="flex flex-col gap-6 rounded-lg border border-stroke-light bg-surface-light p-6 shadow-[0_4px_30px_rgba(20,17,13,0.06)] sm:p-8"
            >
              <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <span
                    class="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep font-label"
                  >
                    FORMULÁRIO DE ATENDIMENTO
                  </span>
                  <span
                    class="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success"
                  >
                    Fila Prioritária
                  </span>
                </div>
                <h3 class="mt-2 font-display text-2xl font-semibold text-text-strong">
                  Solicite seu Diagnóstico Consultivo
                </h3>
                <p class="text-xs text-text-muted">
                  Preencha as informações para receber contato direto em até 2 horas úteis.
                </p>
              </div>

              <form class="flex flex-col gap-4" @submit.prevent="submitLead">
                <!-- Nome Completo -->
                <div class="flex flex-col gap-1.5">
                  <label
                    class="text-xs font-semibold uppercase tracking-wider text-text-strong font-label"
                    for="name"
                  >
                    Nome Completo
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Ex: Dr. Roberto Guimarães"
                    class="focus-ring h-12 rounded-sm border border-stroke-light bg-surface-light px-4 text-sm text-text-strong placeholder:text-text-muted/60 transition-colors duration-150"
                  />
                </div>

                <!-- E-mail & WhatsApp Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label
                      class="text-xs font-semibold uppercase tracking-wider text-text-strong font-label"
                      for="email"
                    >
                      E-mail Profissional
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="roberto@empresa.com.br"
                      class="focus-ring h-12 rounded-sm border border-stroke-light bg-surface-light px-4 text-sm text-text-strong placeholder:text-text-muted/60 transition-colors duration-150"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label
                      class="text-xs font-semibold uppercase tracking-wider text-text-strong font-label"
                      for="phone"
                    >
                      WhatsApp
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      class="focus-ring h-12 rounded-sm border border-stroke-light bg-surface-light px-4 text-sm text-text-strong placeholder:text-text-muted/60 transition-colors duration-150"
                    />
                  </div>
                </div>

                <!-- Tipo de Imóvel -->
                <div class="flex flex-col gap-1.5">
                  <label
                    class="text-xs font-semibold uppercase tracking-wider text-text-strong font-label"
                    for="propertyType"
                  >
                    Tipo de Interesse
                  </label>
                  <select
                    id="propertyType"
                    v-model="form.propertyType"
                    class="focus-ring h-12 rounded-sm border border-stroke-light bg-surface-light px-4 text-sm text-text-strong transition-colors duration-150 cursor-pointer"
                  >
                    <option value="Residencial de Alto Padrão (Apartamento)">
                      Residencial de Alto Padrão (Apartamento)
                    </option>
                    <option value="Penthouse / Cobertura Exclusiva">
                      Penthouse / Cobertura Exclusiva
                    </option>
                    <option value="Residência de Campo ou Fazenda">
                      Residência de Campo ou Fazenda
                    </option>
                    <option value="Ativo para Rentabilidade e Valorização">
                      Ativo para Rentabilidade e Valorização
                    </option>
                  </select>
                </div>

                <!-- Mensagem -->
                <div class="flex flex-col gap-1.5">
                  <label
                    class="text-xs font-semibold uppercase tracking-wider text-text-strong font-label"
                    for="message"
                  >
                    Observações ou Preferências de Região
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="3"
                    maxlength="500"
                    placeholder="Ex: Procuro 4 suítes nos Jardins ou Itaim com varanda ampla e vista livre."
                    class="focus-ring rounded-sm border border-stroke-light bg-surface-light p-4 text-sm text-text-strong placeholder:text-text-muted/60 transition-colors duration-150 resize-none"
                  />
                  <span class="text-right text-[11px] text-text-muted">
                    {{ form.message.length }}/500
                  </span>
                </div>

                <p v-if="submitError" class="text-xs text-danger font-medium">{{ submitError }}</p>
                <div
                  v-if="submitSuccess"
                  class="rounded-sm bg-success/15 p-3 text-center text-xs text-success font-medium"
                >
                  Solicitação recebida com sucesso. Stefanny entrará em contato em breve.
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="submitting"
                  class="focus-ring mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-primary text-sm font-semibold text-ink shadow-[0_4px_20px_rgba(233,193,118,0.3)] transition-all duration-150 hover:bg-primary-hover disabled:opacity-60"
                >
                  <span>{{ submitting ? 'Enviando…' : 'Solicitar Curadoria Privada' }}</span>
                  <Send class="size-4" aria-hidden="true" />
                </button>

                <span class="text-center text-[11px] text-text-muted">
                  Seus dados serão tratados com estrita discrição. Sem envio de spam.
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. CLOSING CTA BANNER (Dark #16130F with Radial Gold Glow) -->
    <section class="relative w-full overflow-hidden bg-surface-dark py-20 sm:py-24">
      <!-- Ambient Radial Gold Halo -->
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.12)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div
        class="relative z-10 mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8 flex flex-col items-center gap-4"
      >
        <span class="text-xs font-semibold uppercase tracking-widest text-primary font-label">
          DECISÃO ASSERTIVA
        </span>

        <h2
          class="max-w-3xl font-display text-3xl font-semibold sm:text-4xl lg:text-5xl text-text-on-dark tracking-tight"
        >
          Receba a curadoria antes de visitar o empreendimento.
        </h2>

        <p class="max-w-2xl text-base text-text-on-dark-muted leading-relaxed">
          Economize tempo e garanta as melhores unidades com orientação consultiva personalizada
          direto com a diretoria comercial.
        </p>

        <div class="pt-4">
          <a
            :href="whatsappHref"
            class="focus-ring inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-4 text-sm sm:text-base font-semibold text-ink shadow-[0_6px_32px_rgba(197,160,89,0.35)] transition-all duration-150 transform-gpu hover:bg-primary-hover hover:scale-[1.02]"
            target="_blank"
            rel="noopener noreferrer"
            @click="onWhatsAppClick('home_cta')"
          >
            <MessageCircle class="size-5" aria-hidden="true" />
            <span>Iniciar Atendimento via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  </main>
</template>
