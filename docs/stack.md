# SG Consultora — Stack e validação

| Área      | Stack                                                                                                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime   | Node `>=24` (engines em todos os package.json; `.nvmrc` = `24`); Docker `node:24-alpine` (backend) / `NODE_VERSION=24.16` (web).                                                                                    |
| Web       | Nuxt 4, Vue 3.5.39 (pinned via `resolutions`), Tailwind (`@nuxtjs/tailwindcss`), `nuxt-security`, lucide-vue-next, Supabase JS                                                                                      |
| API       | Express 4, Effect 3, Prisma 7 + `@prisma/adapter-pg`, multer, Supabase JS, tsx                                                                                                                                      |
| Shared    | Zod 4, TS compilado para `dist/` (`yarn workspace @gutierres/shared build`)                                                                                                                                         |
| Dados     | Supabase Postgres (schema `gutierres`), Auth, Storage (`properties`)                                                                                                                                                |
| Qualidade | ESLint (`@nuxt/eslint`, só web) + Prettier (`.prettierrc` na raiz: sem ponto e vírgula, aspas simples, 100 colunas; `yarn format` / `yarn format:write`). Backend ainda usa aspas duplas — codebase não reformatado |

Sem testes automatizados. Validação = `yarn lint` + `yarn build` (tsc de shared/backend) + `yarn prettier --check <arquivos tocados>` + smoke manual (`yarn dev`) — ver `.cursor/agents/qa-engineer.md`.

## Comandos

`corepack yarn install` · `yarn db:generate` · `yarn dev` · `yarn dev:web` · `yarn dev:backend` · `yarn lint` · `yarn build` · `yarn generate` · `yarn preview` · `yarn db:migrate` / `db:push` (autorização).

## Convenções

- `.ts` importa `.ts` no source do backend.
- Evitar `any`; tipos de payload vêm de `@gutierres/shared` (rebuild do shared após mudar schema).

Stacks compartilhadas: `.ai/stacks/{nuxt4,vue3,tailwind,typescript,node,express,effect3,prisma,postgresql,supabase,docker}.md`.
