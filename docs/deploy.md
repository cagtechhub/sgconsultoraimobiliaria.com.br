# SG Consultora — Deploy e infra

- Cadeia: **Cloudflare** (proxy laranja, SSL Full strict) → IP da VPS → **Traefik** da OS → containers. Certificado da origem = **Cloudflare Origin CA** no Traefik (SAN: apex, `www`, `API_DOMAIN`). Routers **sem** `tls.certresolver` (HTTP-01 quebra com proxy). Não apontar o mesmo `DOMAIN` para Pages e VPS.
- `docker-compose.yml`: `gutierresconsultoria-web` (3000, apex + www, redirect www→apex via middleware `gutierresconsultoria-www`) e `gutierresconsultoria-backend` (3001, `API_DOMAIN`). Rede `web` (`TRAEFIK_NETWORK=web`, nunca `host`). Sem `ports:`, sem Postgres local.
- SSR: `NUXT_API_BASE=http://gutierresconsultoria-backend:3001` (container_name, não service name). Browser: `NUXT_PUBLIC_API_BASE` (https real, entra no build e na CSP).
- **CSP**: `script-src`/`connect-src` incluem `https://static.cloudflareinsights.com` e `https://*.cloudflareinsights.com`; `connect-src` com `'self' * https: http: blob: data: ws: wss:` (não omitir — no WebKit `*` não cobre `https:`); `frame-src` com `about:` + GTM; `upgrade-insecure-requests` só em produção; `referrerPolicy: strict-origin-when-cross-origin`.
- Prisma 7 no Docker: `prisma generate` depois do `COPY .`; sem `postinstall: prisma generate`.
- Web no container roda `.output/server/index.mjs` com o `node_modules` da raiz; só `vue`/`@vue` do trace Nitro são substituídos.
- `deploy.sh`: `docker compose up -d --remove-orphans --build`.
- GitHub Actions (`.github/workflows/deploy.yml`): push em `main` → SSH (`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`) → `git pull --ff-only` → `deploy.sh`. `APP_DIR` default `/opt/sgconsultoraimobiliaria.com.br`.
- Env: modelo em `.env.example` (nunca ler `.env*` reais). `gha_deploy*` é chave: não ler, não commitar.

Push em `main` = produção. Mudança aqui → atualizar este doc na mesma entrega. Ver `.ai/agents/devops-engineer.md`, `.ai/stacks/docker.md`.
