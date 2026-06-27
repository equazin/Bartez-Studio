# BARTEZ — Instrucciones del proyecto

ERP/CRM de Bartez Tecnología. Next.js 16 (App Router) + React 19 + Prisma + PostgreSQL (Neon), deploy en Vercel.

## Flujo de verificación obligatorio (fin de tanda)

Al terminar **cualquier tanda de cambios**, antes de declararla completa, corré la
verificación de integración. Es el mismo gate que usan los equipos antes de
integrar y publicar.

Forma rápida: ejecutá el comando **`/verificar`** (orquesta todo).

Si lo hacés a mano, lanzá las skills como **subagentes** (Task tool,
`subagent_type: general-purpose`) en este orden:

1. **En paralelo (solo lectura, sin tocar código):**
   - `anthropic-skills:architect-review` — arquitectura, deuda técnica, consistencia.
   - `anthropic-skills:bartez-qa` — QA funcional de los flujos afectados.
2. **`anthropic-skills:full-regression`** — en modo **solo reporte**: detectar fallos
   y regresiones, **sin aplicar correcciones** (el gate debe evaluar el estado real,
   no uno ya parcheado por un subagente).
3. **`anthropic-skills:release-check`** — gate final: build, config, env vars,
   migraciones, dependencias → **APROBADO / RECHAZADO**.

Consolidá los hallazgos por severidad y dá un veredicto.

**Regla dura:** no marques la tanda como completa si el veredicto es **RECHAZADO**.
Corregí en el hilo principal (no en los subagentes de verificación) y volvé a correr
`/verificar`.

> Pragmatismo: para cambios triviales (typo, comentario, un test) alcanza con
> `release-check`. El flujo completo es para tandas con cambios funcionales o de
> arquitectura.

## Convenciones del repo

- **Tras cada cambio:** commit + push (deploy automático a Vercel). Usar paths
  explícitos en `git add` (nunca `git add -A`) para no arrastrar archivos basura.
- **Antes de commitear:** `npm run lint`, `npm run typecheck`, `npm test` y
  `npm run build` deben pasar (es lo que valida el CI con `--max-warnings=0`).
- **Migraciones Prisma:** crear la migración SQL + actualizar `schema.prisma`,
  `npx prisma generate`, `npx prisma migrate deploy`.
- **Auth/RBAC:** todos los endpoints admin pasan por `authorizeModule`. El modelo
  `Account` es la cuenta CRM (cliente); el plan de cuentas contable es `LedgerAccount`.
