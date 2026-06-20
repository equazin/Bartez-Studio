# Bartez Tecnología — Landing institucional

Landing one-page B2B para **Bartez Tecnología**, distribuidora mayorista de hardware IT en Rosario, Santa Fe. Vidriera comercial orientada a generar confianza institucional y **capturar leads corporativos**.

> Stack: **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lucide · Zod**
> Estética: "Apple meets editorial premium" — Inter (cuerpo) + Fraunces (display serif).

---

## 🚀 Arranque rápido

```bash
npm install
cp .env.example .env.local   # completá las integraciones que quieras activar
npm run dev                  # http://localhost:3000
npm run build && npm start   # build de producción
```

Sin ninguna variable de entorno la web funciona igual: el formulario **recibe el lead y lo loguea**, y cada integración se marca `skipped` sin romper nada (patrón adapter con fallback).

---

## 🗂️ Estructura

```
app/
  layout.tsx            # metadata, fuentes, JSON-LD (Organization + LocalBusiness)
  page.tsx              # one-page (compone todas las secciones)
  opengraph-image.tsx   # OG 1200x630 generada dinámicamente
  sitemap.ts robots.ts  # SEO
  gracias/              # página post-submit + tracking de conversión (GA4 + Meta Pixel)
  api/lead/route.ts     # form → Apollo + monday + Email (+ Calendar adapter)
  api/download/route.ts # lead-gate de descargas → link de Drive
components/
  Navbar, Footer, WhatsAppFloat, CookieBanner, Map, Analytics, motion, icons, SectionHeading
  sections/             # Hero, TrustBar, Pillars, Solutions, WhyBartez, Testimonial,
                        # CatalogPreview, Process, Contact, Downloads, Payments
lib/
  schema.ts             # validación zod (lead + descarga)
  integrations/         # apollo · monday · mail · calendar · index (orquestador)
constants.ts            # ⭐ TODO el contenido comercial editable (textos, contacto, productos, partners)
legacy/                 # proyecto Vite anterior archivado
docs/                   # plan de trabajo + setup de integraciones
mockups/                # mockup HTML de aprobación (Hero A/B)
```

**Para editar textos, productos, datos de contacto o partners → tocá únicamente `constants.ts`.**

---

## 🔌 Integraciones (patrón adapter)

Cada integración vive en `lib/integrations/` e implementa `LeadSink`. El orquestador (`lib/integrations/index.ts`) las corre **en paralelo y aisladas**: si una falla, las demás siguen y el lead nunca se pierde. Para agregar/quitar una, editás el array `sinks`.

| Integración | Archivo | Variables | Qué hace |
|---|---|---|---|
| **Apollo.io** | `apollo.ts` | `APOLLO_API_KEY` | Crea cuenta + contacto con tags `lead-web-bartez`, `rosario-300km` |
| **monday.com** | `monday.ts` | `MONDAY_API_TOKEN`, `MONDAY_BOARD_ID`, `MONDAY_COL_*` | Crea un item en el board "Leads Web Bartez" |
| **Email** | `mail.ts` | `MAIL_PROVIDER` (`resend`/`brevo`), `RESEND_API_KEY`/`BREVO_API_KEY`, `MAIL_FROM`, `MAIL_TO` | Notificación interna + autorespuesta HTML branded |
| **Agenda** | `calendar.ts` | `CALENDAR_PROVIDER`, `NEXT_PUBLIC_CALCOM_BOOKING_URL` | Reunión (fallback: preferencia registrada; sin Google Calendar MCP) |
| **Descargas** | `api/download` | `DRIVE_BROCHURE_URL`, `DRIVE_CATALOGO_URL` | Sirve los PDF de Google Drive tras capturar email |
| **Analytics** | `Analytics.tsx` | `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | GA4 + Meta Pixel + evento `generate_lead` en /gracias |

### monday.com — board ya creado ✅
Board **"Leads Web Bartez"** creado y validado (incluye un item `[EJEMPLO]` que podés borrar).

- **URL:** https://nicopbenitez84s-team-company.monday.com/boards/18418630086
- **`MONDAY_BOARD_ID`** = `18418630086`
- **`MONDAY_GROUP_ID`** = `topics`
- IDs de columnas (ya mapeados en `.env.example`):

| Variable | Columna | Column ID |
|---|---|---|
| `MONDAY_COL_EMPRESA` | Empresa | `text_mm4gmwsf` |
| `MONDAY_COL_EMAIL` | Email | `email_mm4gfs0f` |
| `MONDAY_COL_TELEFONO` | Teléfono | `phone_mm4gxh5s` |
| `MONDAY_COL_TIPO` | Tipo de consulta | `color_mm4g97d1` |
| `MONDAY_COL_MENSAJE` | Mensaje | `long_text_mm4gda50` |
| `MONDAY_COL_ESTADO` | Estado (Nuevo/Contactado/Cotizado/Cerrado) | `color_mm4gyw76` |

> Sólo falta generar el **`MONDAY_API_TOKEN`** (monday → Avatar → Developers → My access tokens) y pegarlo en `.env.local`.

### Apollo / Email / Drive
- **Apollo:** generá una API key (Settings → Integrations → API) → `APOLLO_API_KEY`. El adapter ya aplica los tags de segmentación.
- **Email:** elegí `resend` o `brevo`, cargá la API key y verificá el remitente `MAIL_FROM`.
- **Drive:** subí `brochure.pdf` y `catalogo.pdf`, compartilos como "cualquiera con el link" y pegá las URLs en `DRIVE_BROCHURE_URL` / `DRIVE_CATALOGO_URL`.

---

## ☁️ Deploy a Vercel

1. Importá el repo en Vercel (framework detectado: **Next.js**).
2. En **Settings → Environment Variables** cargá las del `.env.example` que vayas a usar.
3. Deploy. Configurá el dominio (`bartez.com.ar` o subdominio) en **Settings → Domains**.
4. Activá **Vercel Analytics** y **Speed Insights** desde el dashboard.

```bash
# o por CLI
npx vercel
npx vercel --prod
```

---

## ♿ Accesibilidad y performance
- Contraste AA, `:focus-visible`, navegación por teclado, `alt`/`aria` en imágenes e íconos.
- `next/font` con `display: swap`, imágenes lazy, `prefers-reduced-motion` respetado.
- Animaciones Framer Motion sutiles on-scroll (`components/motion.tsx`).

---

## 📍 Datos del negocio
Centralizados en `constants.ts` → `company` / `contact`. **Reemplazá los placeholders** antes de publicar: CUIT, WhatsApp real, email comercial, coordenadas exactas del mapa.

---

## 📄 Documentación adicional
- `docs/PLAN-DE-TRABAJO.md` — plan por fases, riesgos y checklist.
- `mockups/bartez-landing-mockup.html` — mockup de aprobación (Hero A/B).
</content>
