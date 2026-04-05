---
name: Build Before Commit
description: SEMPRE rodar npm run build antes de git commit para pegar erros de TypeScript
type: feedback
---

SEMPRE testar o build (npm run build) antes de commitar e pushar.

**Why:** O user ficou frustrado com deploy quebrado por erro de TypeScript que teria sido pego com um build local. Deploy automático no Vercel falhou por type error.

**How to apply:** Antes de qualquer git commit, rodar `npm run build` no projeto. Só commitar se o build passar sem erros.
