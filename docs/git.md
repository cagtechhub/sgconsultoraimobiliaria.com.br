# SG Consultora — Git

- **Não** criar commit, push ou PR sem autorização explícita. Push em `main` dispara deploy de produção.
- Conventional Commits em pt-BR: `feat: ...`, `fix: ...`, `chore: ...`, `refactor: ...`, `docs: ...`. O histórico tem muitos `wip`/mensagens soltas — **não repetir `wip` em `main`**.
- Branch (quando usada): `<tipo>/descricao-curta`.
- Antes de propor commit: `git status`, diff revisado, `yarn lint`, Prettier nos arquivos tocados.
- Nunca versionar `.env*` (exceto `.env.example`), `gha_deploy*` nem `.ai`.

Skill: `.ai/skills/pr-prep/SKILL.md`. Padrão: `.ai/standards/general/git.md`.
