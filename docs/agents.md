# SG Consultora — Agents e skills

## Cursor (`.cursor/agents/`)

| Agente              | Uso                                                                |
| ------------------- | ------------------------------------------------------------------ |
| `frontend-engineer` | Site/admin Nuxt, componentes, redesign via `DESIGN.md`             |
| `backend-engineer`  | API Express/Effect (ports, use-cases, adapters), `packages/shared` |
| `dba-engineer`      | Prisma schema/migrations, queries, Supabase                        |
| `devops-engineer`   | Docker, Traefik, Cloudflare/CSP, GitHub Actions                    |
| `qa-engineer`       | Validação (lint, Prettier, build, smoke); propõe setup de testes   |
| `reviewer`          | Revisão readonly; aciona impact/security/data-leak/code            |

Orquestração: `.cursor/rules/tech-lead.mdc` (delega, não implementa).

## Skills

`.ai/skills/{repo-map,new-module,refactoring,build-repair,database-analysis,security-audit,pr-prep,adr,release-notes}/SKILL.md`
