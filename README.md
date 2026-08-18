# Gutierres Consultoria

Monorepo com landing Nuxt 4 + painel admin e API Express + Effect (clean architecture).

## Estrutura

```
.
├── apps/
│   ├── web/          # @gutierres/web — site + /admin
│   └── backend/      # @gutierres/backend — Express + Effect + Prisma + Supabase Storage
├── packages/
│   └── shared/       # @gutierres/shared — schemas Zod
├── docker-compose.yml
├── deploy.sh
├── .github/workflows/deploy.yml
└── README.md
```

## Painel administrativo (`/admin`)

- Login via **Supabase Auth** (e-mail + senha)
- **Imóveis**: título, descrição, datas de obra, status, unidades disponíveis, imagens (Supabase Storage)
- **Leads**: originados do `POST /contacts` (canal `WEBSITE`) ou criados manualmente (`ADSENSE`, `WHATSAPP`, etc.)

## Desenvolvimento

```bash
corepack yarn install
cp .env.example .env   # preencha SUPABASE_URL, ANON_KEY e SERVICE_ROLE_KEY
# Crie um usuário em Authentication → Users no Supabase (Studio local ou cloud)
corepack yarn db:generate
corepack yarn db:migrate
# SQL do bucket: apps/backend/supabase/storage-properties.sql
corepack yarn dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  
- API: http://localhost:3001  

Opcional no backend:

- `ADMIN_ALLOWED_EMAILS` — CSV de e-mails autorizados
- `ADMIN_REQUIRE_ROLE=true` — exige `app_metadata.role = "admin"` no usuário

## Docker + Traefik + Cloudflare

O Compose sobe **backend** e **web** na rede externa do Traefik (sem publicar portas no host). O banco é o Postgres do Supabase. O Cloudflare fica **na frente** (CDN/WAF); o Traefik continua na origem.

Pré-requisitos:
- Docker + Compose; Traefik na OS (rede `web`, entrypoint `websecure`, **não** `network_mode: host`)
- No Traefik da OS: certificado **Cloudflare Origin CA** como default (apex, `www` e `API_DOMAIN`)
- DNS no Cloudflare: A/AAAA de `DOMAIN`, `www` e `API_DOMAIN` para o IP da VPS, **Proxied**
- SSL/TLS no Cloudflare: **Full (strict)** — não Flexible
- Sem Let’s Encrypt HTTP-01 nestes routers (o proxy intercepta o desafio)
- `.env` de produção **só na VPS** (copie de `.env.example`)
- Uma vez contra o Supabase: `yarn db:push` (ou `yarn db:migrate`) — **não** rodar em todo deploy

`TRAEFIK_NETWORK` deve ser `web`. **Nunca** `host`.

Roteamento:
- `https://DOMAIN` (e `www` → apex) → `web:3000`
- `https://API_DOMAIN` → `backend:3001`

Não hospedar o mesmo `DOMAIN` no Cloudflare Pages e no Traefik.

### Variáveis Nuxt

| Variável                        | Onde                       | Valor                                        |
| ------------------------------- | -------------------------- | -------------------------------------------- |
| `NUXT_API_BASE`                 | runtime SSR (Compose)      | `http://gutierresconsultoria-backend:3001`   |
| `NUXT_PUBLIC_API_BASE`          | browser + CSP no **build** | `https://api.gutierresconsultoria.com.br`    |
| `NUXT_PUBLIC_SITE_URL`          | SEO / runtime              | `https://gutierresconsultoria.com.br`        |
| `NUXT_PUBLIC_SUPABASE_URL`      | Auth no browser            | `https://xxxx.supabase.co`                   |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Auth no browser            | anon/publishable key                         |

Em produção, `NUXT_PUBLIC_*` devem ser `https://` dos domínios reais — **não** `localhost`.

SSR usa o **`container_name`** `gutierresconsultoria-backend` (não o service name `backend`) para não colidir com outros apps na rede Traefik `web`.

### Subir

```bash
./deploy.sh
# equivalente: docker compose build && docker compose up -d
```

Se a imagem antiga persistir: `docker compose build --no-cache web` (ou `backend`) e `up -d`.

A web segue o razconms / Gutierres Recomenda: o container roda `apps/web/.output/server/index.mjs` **com o `node_modules` da raiz** (o Node resolve `entities`/`hookable`/etc. sozinho). Só `vue`/`@vue` incompletos do trace do Nitro são substituídos.

### GitHub Actions

Workflow: `.github/workflows/deploy.yml` (SSH + `git pull` + `./deploy.sh`).

Secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`.  
Vars opcionais: `APP_DIR` (default `/opt/gutierresconsultoria.com.br`), `DOMAIN`.

O usuário `deploy` deve estar no grupo `docker`. Build acontece na VPS (a web precisa dos build args do `.env`).

## API (resumo)

| Método | Rota | Auth |
|--------|------|------|
| GET | `/health` | — |
| GET | `/properties` | — |
| GET | `/properties/:slug` | — |
| POST | `/contacts` | — (cria Contact + Lead WEBSITE) |
| * | `/admin/*` | Bearer JWT Supabase Auth |
