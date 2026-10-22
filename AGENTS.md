# SG Consultora Imobiliária (Stefanny Gutierres) — Instruções do Agente

Site da consultora de vendas imobiliárias Stefanny Gutierres: **monorepo Yarn 1** com landing Nuxt 4 + painel `/admin` (`apps/web`), API Express + Effect + Prisma em clean architecture (`apps/backend`) e schemas Zod compartilhados (`packages/shared`). Banco, Auth e Storage no **Supabase**. Deploy Docker + Traefik atrás da Cloudflare via GitHub Actions.

Este arquivo **roteia**. Detalhe técnico está em `docs/`. Padrões compartilhados: `.ai/` (symlink local `.ai → ../.ai`, não versionado; não duplicar aqui).

## Fonte de verdade

1. `AGENTS.md` — roteamento e regras duras
2. `docs/` e `DESIGN.md` — conhecimento do projeto (abrir o doc da tarefa)
3. código existente — comportamento implementado
4. `.ai/` — standards/stacks/agents/skills compartilhados (sob demanda)
5. inferência — só se não houver doc/código; declarar premissa

## Roteamento

| Tarefa                                       | Documento              |
| -------------------------------------------- | ---------------------- |
| Protocolo IA / anti-alucinação               | `docs/ai.md`           |
| Arquitetura e pastas (clean arch backend)    | `docs/architecture.md` |
| Stack, comandos e validação                  | `docs/stack.md`        |
| Visual, tokens, componentes, redesign        | `DESIGN.md`            |
| API, banco (Prisma/Supabase), `shared`       | `docs/contracts.md`    |
| Docker, Traefik, Cloudflare, CSP, CI/CD, env | `docs/deploy.md`       |
| Risco, segurança, SEO/compliance de copy     | `docs/risk.md`         |
| Agents e skills                              | `docs/agents.md`       |
| Git / commits                                | `docs/git.md`          |
| Índice                                       | `docs/README.md`       |

Carregar **somente** o documento relevante.

## Comandos essenciais

Node `>=24` (`.nvmrc`). Prettier: `yarn format` (check) / `yarn format:write` — não reformatar o repo em massa.

```bash
corepack yarn install
yarn db:generate          # Prisma client (apps/backend)
yarn dev                  # web :3000 + API :3001
yarn dev:web | yarn dev:backend
yarn lint                 # ESLint do web (backend/shared: tsc via build)
yarn build                # shared → backend → web
yarn prettier --check <arquivos>   # config na raiz; não rodar format:write no repo todo
yarn db:migrate           # prisma migrate dev — só com autorização
./deploy.sh               # produção — só com autorização
```

## Regras duras

- Não inventar requisitos, campos, endpoints, seções, copy ou tokens visuais.
- Visual segue `DESIGN.md`; token novo → `DESIGN.md` + `apps/web/tailwind.config.ts` juntos.
- Contrato web↔API em `packages/shared` (Zod); não duplicar tipos.
- **Schema só via migrations Prisma** (`apps/backend/prisma/migrations`, schema Postgres `gutierres`). Sem `db push` em produção.
- Copy: a consultora **não é corretora e não tem CRECI** — nunca escrever "corretora", "corretagem" ou prometer intermediação.
- Não enfraquecer CSP/`nuxt-security`; nunca `service_role`/secrets em `NUXT_PUBLIC_*`.
- SEO (`useHead`/`useSeoMeta`/`useJsonLdGraph`) no `setup()` **antes** de qualquer `await`; não usar `@unhead/schema-org`.
- Cloudflare → Traefik: routers sem `tls.certresolver`; `TRAEFIK_NETWORK=web` (nunca `host`); compose sem `ports:`.
- Prisma 7: generate depois do `COPY .`; sem `postinstall: prisma generate`; não editar `src/infrastructure/prisma/output/`.
- Painel admin: sidebar 16rem + header sticky + drawer (não top-nav).
- Nunca ler/imprimir `.env*` nem `gha_deploy*`.
- Sem commit/push/PR, migrate ou deploy sem autorização explícita (push em `main` = produção).
- Não afirmar validação sem executar. Dúvida de produto → perguntar ao César.
- Mudança de infra atualiza `docs/deploy.md`/`docs/stack.md` na mesma entrega.

## Fluxo

```text
Entender → doc roteado → web, backend, shared ou infra? → contrato? → menor mudança → lint/build → revisar diff
```
