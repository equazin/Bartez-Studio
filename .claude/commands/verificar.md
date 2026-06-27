---
description: Verificación de fin de tanda — architect-review + bartez-qa + full-regression + release-check como gate
---

# Verificación de tanda (gate de integración / release)

Ejecutá un flujo de verificación profesional sobre **los cambios de esta tanda**
antes de darla por terminada. Cada etapa corre en su **propio subagente** (Task
tool, `subagent_type: general-purpose`) para aislar contexto y paralelizar lo
independiente.

## 0. Determinar el alcance (vos, en el hilo principal)

Antes de lanzar subagentes, calculá qué cambió en esta tanda y pasáselo a cada uno:

```
git status --short
git diff --stat HEAD
git log --oneline -10
```

Resumí en 2-3 líneas: archivos tocados, módulos afectados, tipo de cambio. Ese
resumen va en el prompt de cada subagente para que enfoquen la revisión.

## 1. Revisión paralela (solo lectura, sin tocar código)

Lanzá **en un mismo mensaje** (para que corran en paralelo) dos subagentes:

- **Subagente A — Arquitectura:** invocá la skill `anthropic-skills:architect-review`
  sobre el alcance de la tanda. Que devuelva hallazgos de escalabilidad,
  mantenibilidad, deuda técnica y consistencia, priorizados por severidad.
- **Subagente B — QA funcional:** invocá la skill `anthropic-skills:bartez-qa`.
  Que recorra los flujos afectados y reporte errores funcionales, inconsistencias
  visuales/UX y funcionalidades faltantes, priorizados por severidad.

Ambos son **read-only**: NO deben modificar archivos.

## 2. Regresión (solo reporte — NO aplicar correcciones)

Cuando A y B terminaron, lanzá un subagente que invoque la skill
`anthropic-skills:full-regression` con esta instrucción explícita:

> Corré la regresión en modo **solo lectura**: detectá fallos funcionales,
> visuales, de UX y regresiones, y reportalos por severidad. **NO apliques
> correcciones ni modifiques código** — el objetivo es que el gate evalúe el
> estado real. Si encontrás algo que arreglarías, describilo como recomendación.

(La skill por defecto aplica fixes seguros; acá la forzamos a solo informar para
que el veredicto refleje el estado actual, no uno ya parcheado por un subagente.)

## 3. Gate de release (final, bloqueante)

Por último, lanzá un subagente que invoque `anthropic-skills:release-check`:
build, configuración, dependencias, env vars, migraciones, consistencia y
rendimiento, con criterio de **APROBADO / RECHAZADO**.

## 4. Consolidación y veredicto (vos, en el hilo principal)

Juntá los hallazgos de las 4 etapas y presentá:

1. **Tabla por severidad** (🔴 Crítico / 🟠 Alto / 🟡 Medio / 🔵 Bajo) con el origen
   (architect / qa / regression / release) de cada ítem.
2. **Veredicto final: ✅ APROBADO** o **❌ RECHAZADO**.
   - RECHAZADO si `release-check` rechaza, o si hay cualquier hallazgo **Crítico**.
3. Si es RECHAZADO, una lista corta y accionable de qué corregir para aprobar.

> Regla dura: **no declares la tanda como completa si el veredicto es RECHAZADO.**
> Primero corregí (en el hilo principal, no en los subagentes de verificación) y
> volvé a correr `/verificar`.
