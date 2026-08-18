# Agente — Gutierres Consultoria

- **Yarn Classic 1.22** + `.nvmrc` (`26`). Node **>= 26** em local, CI e Docker (`node:26-alpine`).
- **Cloudflare + Traefik**: o site/API **não** vão para Pages. Fluxo: Cloudflare (proxy, Full strict) → IP da VPS → Traefik → containers. Routers **sem** `tls.certresolver` (Let’s Encrypt HTTP-01 quebra com nuvem laranja). Certificado da origem = **Origin CA** no Traefik da OS (SAN: apex, `www`, `API_DOMAIN`). SSR: `NUXT_API_BASE=http://gutierresconsultoria-backend:3001`. Redirect `www` → apex no Traefik (`gutierresconsultoria-www`). Não apontar o mesmo `DOMAIN` para Pages e para a VPS.
- **CSP (Cloudflare)**: `script-src` e `connect-src` incluem `https://static.cloudflareinsights.com` e `https://*.cloudflareinsights.com` (beacon do proxy). `connect-src` com `'self' * https: http: blob: data: ws: wss:` — não omitir a diretiva; no WebKit `*` não substitui `https:`. `frame-src` com `about:` + GTM. `upgrade-insecure-requests` só em produção. `referrerPolicy`: `strict-origin-when-cross-origin` (não `no-referrer`).
- **SEO**: `useHead` / `useSeoMeta` / JSON-LD (`useJsonLdGraph`) no `setup()` dos layouts e **antes** de qualquer `await`. Não usar `@unhead/schema-org` (injectHead sem contexto no SSR Docker).
- **Painel admin**: sidebar 16rem + header sticky + drawer (padrão Razcon/GMB), não top-nav.
- **Prisma 7**: generate depois do `COPY .`; sem `postinstall: prisma generate`. Source `.ts` importa `.ts`.
