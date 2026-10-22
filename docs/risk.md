# SG Consultora — Risco e segurança

## Hotspots

- `apps/web/nuxt.config.ts` (`nuxt-security`/CSP) — ver `docs/deploy.md`; não relaxar sem justificativa.
- `require-admin.ts`, `supabase-auth.ts` e rotas `/admin/*` — authz por JWT + allowlist/role.
- `POST /contacts` — input público: Zod, sem vazar erro interno; PII de leads (LGPD).
- Upload de mídia (multer → Storage): tipo/tamanho validados.
- `analytics.client.ts` / GTM — impacto em CSP e privacidade.
- `docker-compose.yml`, workflow, `deploy.sh` — push em `main` publica.
- Prisma migrations — dados de produção.

## Compliance de copy

A consultora atua em **consultoria de vendas**, **sem registro CRECI**. Nunca usar "corretora", "corretagem", "intermediação" nem prometer condições/valores não informados pela incorporadora. Prova social (cases) só com autorização do cliente.

## Regras

- Nunca `service_role`/secrets em `NUXT_PUBLIC_*` ou bundle client. Não logar PII/tokens.
- Mudança em hotspot → acionar `reviewer`.

Ver `.ai/standards/general/security.md`, `.ai/agents/security-reviewer.md`, `.ai/agents/data-leak-auditor.md`.
