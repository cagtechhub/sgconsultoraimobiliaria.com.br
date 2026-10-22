# SG Consultora — Contratos (API, banco, shared)

## API (`apps/backend/src/presentation/http/create-app.ts`)

Públicas: `GET /health`, `GET /settings`, `GET /categories`, `GET /properties`, `GET /properties/:slug`, `GET /sold-cases`, `POST /contacts`.

Admin (Bearer JWT Supabase via `require-admin.ts`): CRUD de `/admin/properties` (+ `media` upload/ordem/capa), `/admin/categories`, `/admin/leads`, `/admin/sold-cases` (+ `cover`), `GET|PUT /admin/settings`.

Consultar o código antes de citar payload; não inventar.

## Shared (`packages/shared/src/schemas`)

`property`, `category`, `lead`, `contact`, `settings`, `sold-case`, `health`, reexportados em `index.ts`. Mudança de payload: schema em `shared` → backend valida → web consome. Breaking ajusta os dois lados na mesma entrega.

## Banco

- Prisma 7, `schemas = ["gutierres"]`, `@@schema("gutierres")` em todo model/enum. Models: Contact, PropertyCategory, Property, PropertyMedia, Lead, SiteSettings, SoldCase.
- **Schema novo só via migrations Prisma** em `apps/backend/prisma/migrations/` (`yarn db:migrate`). Não usar `db push` para mudança definitiva; não editar migrations já aplicadas.
- Migration aditiva quando possível; destrutiva exige plano e autorização. Nunca rodar contra produção sem autorização.
- Storage: bucket `properties` (`apps/backend/supabase/storage-properties.sql`).
