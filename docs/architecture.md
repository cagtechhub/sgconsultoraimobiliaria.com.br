# SG Consultora — Arquitetura

Monorepo Yarn 1 (`workspaces: apps/*, packages/*`, escopo `@gutierres/*`).

```text
apps/web/                 Nuxt 4 (srcDir app/) — site + /admin (SSR)
  app/pages/              index.vue (home), empreendimentos/{index,[slug]}.vue,
                          admin/{login,index,imoveis,categorias,leads,cases,configuracoes}
  app/components/layout/  AppHeader, AppFooter, AppLogo, FloatingWhatsApp
  app/components/project/ FeaturedHero, ProjectCard, SoldCaseCard, Gallery, CountdownTimer
  app/composables/        useApiBase, useAdminApi, useProjects, useSoldCases, useSiteSettings,
                          useSiteSeoHead/useSiteSeoUrls, useJsonLdGraph, useWhatsapp, useAnalytics,
                          useSupabaseClient
  app/layouts/            default.vue, admin.vue (sidebar 16rem + header sticky + drawer)
  app/plugins/            01.site-settings, analytics.client
  server/                 Nitro: robots.txt, sitemap.xml, csp-report, api/health
  tailwind.config.ts      tokens (alinhar com DESIGN.md)
apps/backend/             Express + Effect 3 + Prisma 7 (porta 3001) — clean architecture
  src/domain/             erros e tipos de domínio
  src/application/        ports/*.port.ts, *-repository.context.ts (Effect Context), use-cases/
  src/infrastructure/     prisma/ (adapters + layers), supabase/ (auth, object storage), runtime.ts
  src/presentation/http/  create-app.ts (rotas), require-admin.ts
  prisma/                 schema.prisma (schema `gutierres`) + migrations/
  supabase/               storage-properties.sql (bucket)
packages/shared/src/      Zod: property, category, lead, contact, settings, sold-case, health
```

## Fluxos

- **Home SSR**: `useProjects`/`useSoldCases`/`useSiteSettings` → API via `NUXT_API_BASE` (rede interna) no SSR, `NUXT_PUBLIC_API_BASE` no browser.
- **Lead**: formulário/WhatsApp → `POST /contacts` → Contact + Lead `WEBSITE` → `/admin/leads`.
- **Admin**: Supabase Auth no browser → Bearer JWT → `/admin/*` (`require-admin`, `ADMIN_ALLOWED_EMAILS`, `ADMIN_REQUIRE_ROLE`).
- **Mídia**: upload via API → Supabase Storage (bucket `properties`).

Nova funcionalidade no backend: port → use-case → adapter Prisma/Supabase + layer → rota. Simplicidade antes de abstração (`.ai/architecture/karpathy.md`).
