# Plan de Trabajo — Landing Bartez Tecnología

> Distribuidora B2B de hardware IT · Rosario, Santa Fe
> Documento de aprobación previa. **No se escribe código de producción hasta tu OK explícito sobre este plan y el mockup.**

---

## 0. Hallazgos del discovery (estado actual + conectores)

### Estado del repositorio
- El repo `Bartez-Studio` **hoy contiene otro proyecto**: un sitio **Vite + React 19 + react-router** de un estudio de diseño web ("Codex Studio"), no Next.js y no la distribuidora de hardware.
- El brief pide **Next.js 14 (App Router) + TypeScript**. Esto implica **scaffold nuevo**, no migración incremental. El contenido Vite actual se archivaría en una rama/carpeta `legacy/` o se reemplaza.
- **Decisión que necesito de vos:** ¿Reemplazamos el contenido actual del repo por la nueva landing Next.js, o creamos el proyecto en una subcarpeta/repo nuevo? (Recomiendo reemplazar en este mismo repo, sobre la rama `claude/bartez-landing-page-i59n0g`.)

### Conectores verificados como DISPONIBLES en esta sesión
| Conector | Estado | Uso previsto |
|---|---|---|
| **Figma** | ✅ Lectura + escritura (`use_figma`, `create_new_file`, variables) | Design system + mockup fuente de verdad |
| **Adobe for Creativity** (Firefly/Express/Photoshop API) | ✅ Generación y edición de imágenes | OG image, favicon/PWA, hero renders, cards Soluciones |
| **Canva** | ✅ `generate-design`, `export-design` | Brochure PDF + catálogo PDF descargables |
| **Apollo.io** | ✅ Crear contacto/cuenta, tags, tasks | Lead → contacto + cuenta con tags `lead-web-bartez`, `rosario-300km` |
| **monday.com** | ✅ Crear board, columnas, items | Board "Leads Web Bartez" + item por submit |
| **Gmail** | ✅ Draft/send | Notificación interna + autorespuesta HTML al prospecto |
| **Google Drive** | ✅ Crear/compartir archivos | Hosting de brochure/catálogo PDF + links de descarga |
| **Vercel** | ✅ Deploy, projects, domains, env | Deploy, dominio, analytics, env vars |
| **GitHub** | ✅ Repo en scope `equazin/bartez-studio` | Commits / PR si lo pedís |
| **WebSearch / WebFetch** | ✅ | Benchmark de landings IT + logos de partners |

### Conectores NO disponibles / con salvedad
| Conector | Situación | Plan |
|---|---|---|
| **Google Calendar** | ❌ No hay MCP de Calendar (sí Gmail y Drive) | Campo "Agendar reunión" se implementa con **adapter pattern**: por defecto manda preferencia de horario por mail/monday; queda listo un `CalendarAdapter` para enchufar Cal.com o Google Calendar API por env var. |
| **Brevo** | ⚠️ Mencionado en el brief pero sin MCP | El envío transaccional se hace vía **Gmail MCP**; queda un `MailAdapter` para cambiar a Brevo/Resend con sólo setear `MAIL_PROVIDER`. |
| **Gmail desde server de Next** | ⚠️ El MCP de Gmail es para esta sesión, no es una API key de runtime | En producción el API route usa SMTP/Resend/Brevo vía env. El MCP sirve para validar plantillas y disparar pruebas durante el build. |

**Principio rector:** toda integración externa pasa por un **adapter** (`lib/integrations/*`). Si un conector falla o no está, el form **igual persiste el lead** (fallback a log + email) y nunca pierde la conversión.

---

## 1. Fases del proyecto

### Fase 1 — Discovery & Benchmark *(≈ medio día)* — EN CURSO
- Inventario de conectores (✅ hecho arriba).
- WebSearch de referencias B2B IT (Dell Argentina, Lenovo Business, Insight, CDW) → patrones de copy y conversión.
- WebFetch de brand kits (Dell, Lenovo, HP, Cisco, Intel, AMD) para la trust bar.
- **Salida:** sección de "Referencias" comentada al inicio del repo.

### Fase 2 — Design System en Figma *(≈ 1 día)*
- `create_new_file` "Bartez — Design System".
- Variables/tokens: paleta estricta, tipografía (Inter + Fraunces/Instrument Serif), spacing, radios, sombras.
- Componentes base: Botón (primario/ghost), Card, Navbar, Input, Badge.
- **Conector:** Figma. **Salida:** archivo Figma + tokens exportables a Tailwind.

### Fase 3 — Mockups de alta fidelidad *(≈ 1 día)* — ENTREGABLE DE ESTA ETAPA
- Mockup HTML estático (este entregable) de Hero (2 variantes), Soluciones y Contacto.
- Espejado opcional en Figma para las 3 secciones críticas.
- **Salida:** `mockups/bartez-landing-mockup.html` + capturas. **→ Punto de aprobación.**

### Fase 4 — Generación de assets *(≈ 1 día)*
- **Adobe Firefly/Express:** OG image 1200×630, favicon, íconos PWA 192/512, 1 hero render, 6 imágenes de cards Soluciones, mockups de producto para el carousel.
- **Canva:** brochure institucional PDF + catálogo PDF.
- **Google Drive:** subir ambos PDF, generar links compartibles.
- **WebFetch:** logos partners en escala de grises.
- **Salida:** `/public/assets/*` + links Drive en `constants.ts`.

### Fase 5 — Scaffold Next.js 14 + estructura *(≈ 1 día)*
- `create-next-app` (App Router, TS, Tailwind), shadcn/ui, Framer Motion, Lucide.
- `tailwind.config` con tokens Bartez; fuentes con `next/font` (`font-display: swap`).
- `constants.ts` central (textos, contacto, productos mock, partners, pasos, FAQ).
- Layout, metadata API, JSON-LD (Organization + LocalBusiness), `/gracias`, sitemap/robots.
- **Salida:** app que corre con `npm run dev`.

### Fase 6 — Componentes & secciones *(≈ 2–3 días)*
- Navbar translúcido, Hero (variante elegida), Trust bar, 3 Pilares, Soluciones, "Por qué Bartez", Testimonial, Carousel (skeletons), Proceso (timeline), Formulario, Formas de pago, Footer, WhatsApp flotante, Cookie banner, Mapa, sección Descargas con lead-gate.
- Animaciones Framer Motion sutiles on-scroll; accesibilidad WCAG AA; `next/image` + lazy.
- **Salida:** landing completa navegable.

### Fase 7 — Integraciones (captación) *(≈ 2 días)*
- API route `/api/lead`: valida (zod) → `LeadAdapter` orquesta **Apollo + monday + Gmail (+ Calendar adapter)** en paralelo con manejo de fallos individuales.
- API route `/api/download`: registra lead → devuelve link Drive del PDF.
- monday: board "Leads Web Bartez" con pipeline `Nuevo/Contactado/Cotizado/Cerrado`.
- Apollo: contacto + cuenta + tags.
- Gmail: mail interno + autorespuesta HTML branded.
- **Salida:** flujo web → form → CRM + mail, end-to-end, con fallbacks.

### Fase 8 — QA, Performance & Deploy *(≈ 1 día)*
- Lighthouse 90+ (mobile/desktop), contraste AA, navegación teclado, alt text.
- GA4 + Meta Pixel (placeholders con env) y tracking de conversión en `/gracias`.
- **Vercel:** deploy, env vars, dominio (`bartez.com.ar` o subdominio), analytics.
- **Salida:** URL productiva + README de deploy.

**Estimación total:** ~10–12 días de esfuerzo efectivo.

---

## 2. Conectores por fase (resumen)

- **Fase 1:** WebSearch, WebFetch
- **Fase 2:** Figma
- **Fase 3:** (HTML local) + Figma opcional
- **Fase 4:** Adobe, Canva, Google Drive, WebFetch
- **Fase 5–6:** —
- **Fase 7:** Apollo, monday, Gmail, (Calendar adapter)
- **Fase 8:** Vercel, GitHub

---

## 3. Dependencias y bloqueos (qué necesito de vos)

**Credenciales / cuentas de producción (para Fase 7–8, no para empezar):**
- API key de Apollo para runtime (el MCP es de esta sesión).
- Token de monday + ID de workspace destino.
- Proveedor de mail transaccional para runtime: ¿Gmail SMTP, Resend o Brevo? + remitente verificado.
- Casilla comercial destino de notificaciones (¿`comercial@bartez...`?).
- WhatsApp comercial real (número `wa.me/...`).
- Dominio final y acceso a DNS (o lo compramos vía Vercel).
- GA4 Measurement ID y Meta Pixel ID (si se usan).

**Contenido / decisiones:**
- Confirmar reemplazar el proyecto Vite actual por la landing Next.js.
- Logo Bartez en vector (SVG) — si no, lo generamos con Adobe.
- Datos fiscales confirmados (CUIT, razón social, "9 de Julio 3418, Rosario").
- Aprobar variante de Hero (A o B).
- Categorías/productos reales para Soluciones y carousel (o usamos mock).

---

## 4. Riesgos y alternativas

| Riesgo | Mitigación |
|---|---|
| Conector de CRM (Apollo/monday) falla en runtime | Adapter + cola de reintento; el lead siempre se guarda y se mailea. Form nunca falla para el usuario. |
| No hay Google Calendar MCP | `CalendarAdapter` con fallback a "preferencia de horario" en mail/monday; enchufable a Cal.com/Google API. |
| Logos de partners con restricciones de marca | Usar en escala de grises (uso editorial/partner) o reemplazar por "sectores atendidos" si hay objeción legal. |
| Gmail MCP ≠ envío de producción | Plantillas validadas con MCP; runtime vía SMTP/Resend/Brevo por env. |
| Render de hardware de Adobe no convence | Fallback a composición geométrica verde + líneas doradas (Hero variante A, sin foto). |
| Lighthouse <90 por imágenes pesadas | `next/image`, AVIF/WebP, lazy, preconnect de fuentes. |

---

## 5. Estructura de archivos propuesta (Next.js)

```
app/
  layout.tsx            # metadata, fonts, JSON-LD
  page.tsx              # one-page (compone las secciones)
  gracias/page.tsx      # post-submit + tracking
  api/lead/route.ts     # Apollo + monday + Gmail (+Calendar)
  api/download/route.ts # lead-gate → link Drive
components/
  sections/             # Hero, Soluciones, Contacto, etc.
  ui/                   # shadcn + componentes base
  WhatsAppFloat.tsx CookieBanner.tsx Map.tsx
lib/
  integrations/         # apolloAdapter, mondayAdapter, mailAdapter, calendarAdapter
  schema.ts             # zod
constants.ts            # TODOS los textos, contacto, productos, partners
public/assets/          # imágenes generadas + logos
```

---

## 6. Checklist de entregables finales

- [ ] Código Next.js 14 listo para `npm install && npm run dev`
- [ ] `constants.ts` con todo el contenido comercial editable
- [ ] Design system en Figma + tokens
- [ ] Assets: OG 1200×630, favicon, PWA 192/512, hero, 6 cards, productos carousel
- [ ] Brochure PDF + catálogo PDF (Canva) en Drive con links
- [ ] Form → Apollo + monday + Gmail funcionando (con adapters/fallbacks)
- [ ] Board monday "Leads Web Bartez" creado
- [ ] `/gracias` con GA4 + Meta Pixel placeholder
- [ ] JSON-LD Organization + LocalBusiness, sitemap, robots
- [ ] WhatsApp flotante, cookie banner, mapa, formas de pago, descargas
- [ ] Accesibilidad AA + Lighthouse 90+
- [ ] Deploy en Vercel + dominio + analytics
- [ ] README con deploy, env vars y cómo reconfigurar cada integración

---

## 7. Lo que entrego AHORA para tu aprobación
1. Este **Plan de Trabajo**.
2. **Mockup HTML** (`mockups/bartez-landing-mockup.html`) con **2 variantes de Hero** + Soluciones + Contacto, paleta y tipografía propuestas.

🛑 Espero tu **OK** (y elección de Hero A/B) antes de pasar a Fase 4 en adelante.
</content>
</invoke>
