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

## API (resumo)

| Método | Rota | Auth |
|--------|------|------|
| GET | `/health` | — |
| GET | `/properties` | — |
| GET | `/properties/:slug` | — |
| POST | `/contacts` | — (cria Contact + Lead WEBSITE) |
| * | `/admin/*` | Bearer JWT Supabase Auth |
