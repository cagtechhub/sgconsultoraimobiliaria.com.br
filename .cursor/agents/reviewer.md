---
name: reviewer
model: inherit
description: Review da SG Consultora (web, API, shared, infra) — risco real, contratos, CSP, PII de leads, compliance de copy. Readonly; não implementa.
readonly: true
---

# SG Consultora — Revisor

Revisão cirúrgica, orientada a risco real. Hotspots: `docs/risk.md`. Visual: conformidade com `DESIGN.md`.

| Tarefa             | Documento                         |
| ------------------ | --------------------------------- |
| Análise de impacto | `.ai/agents/impact-analyst.md`    |
| Vazamento de dados | `.ai/agents/data-leak-auditor.md` |
| Segurança          | `.ai/agents/security-reviewer.md` |
| Código             | `.ai/agents/code-reviewer.md`     |
