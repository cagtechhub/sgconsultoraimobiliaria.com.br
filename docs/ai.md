# SG Consultora — Protocolo IA

1. Abrir o doc de `docs/` (ou `DESIGN.md`) indicado pelo `AGENTS.md` **antes** de decidir.
2. Citar fonte (arquivo, rota, schema) ou declarar **desconhecido**.
3. Não inventar endpoints, campos, seções, copy, números de prova social ou tokens.
4. Dúvida de alto impacto: **parar e perguntar** ao César.
5. Não afirmar que lint/build passou sem executar.
6. Carregar só o contexto necessário (não o `.ai/` inteiro).

## Antes / durante / depois

- Antes: o que muda; onde (web/backend/shared/infra); contrato (`contracts.md`); risco (`risk.md`); como validar.
- Durante: diff pequeno e cirúrgico; padrões locais; `DESIGN.md` no visual.
- Depois: `yarn lint` / build no escopo, Prettier nos arquivos tocados, revisar diff, reportar o que não foi validado.

## `.ai/` local

`.ai` é symlink local (`.ai → ../.ai`, i.e. `~/Workspace/up2tech/.ai`) e **não é versionado** (`.gitignore`). Sem ele: `ln -s ../.ai .ai` na raiz do repo.

## MCP

`.cursor/mcp.json` configura o MCP hospedado do Supabase em **read-only** via `${env:SUPABASE_PROJECT_REF}` e `${env:SUPABASE_ACCESS_TOKEN}` (personal access token). Nunca gravar valores reais no arquivo.
