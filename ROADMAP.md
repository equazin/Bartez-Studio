# Bartez Studio - Roadmap de Sprints

Estado actual: sitio React/Vite implementado en `Codex Studio`, con home, servicios, páginas individuales, portfolio, nosotros, contacto, SEO dinámico básico, navegación desktop/mobile, CTA flotante y formulario WhatsApp/email sin backend.

## Verificación actual

- `npm run build`: OK
- `npm run lint`: OK
- Responsive revisado con capturas Playwright en home, contacto, portfolio, nosotros y servicio individual.
- Dev server usado: `http://127.0.0.1:5173/`

## Sprint 1 - Preparar datos reales para publicar

Objetivo: reemplazar placeholders por información comercial real.

- Reemplazar `contactConfig.whatsappNumber` y `contactConfig.email` en `src/data/site.ts`.
- Definir dominio final y actualizar canonical/JSON-LD en `index.html`.
- Revisar nombres de empresas ficticias y decidir si quedan como placeholders o se cambian por casos reales.
- Agregar textos legales mínimos si se va a pautar: privacidad, uso de datos y condiciones de contacto.

## Sprint 2 - Assets visuales propios

Objetivo: subir el nivel visual con materiales únicos de marca.

- Crear mockups propios para hero, portfolio y servicios.
- Diseñar imagen Open Graph `public/og-image.jpg`.
- Agregar favicon y variantes de icono para navegador/móvil.
- Reemplazar logos ficticios de confianza por marcas reales o una banda de "sectores atendidos".

## Sprint 3 - Conversión y medición

Objetivo: medir consultas y optimizar pauta.

- Agregar Google Analytics, Meta Pixel o herramienta elegida.
- Medir clicks en WhatsApp, mailto, CTA principal y envío de formulario.
- Crear eventos por servicio de interés.
- Preparar UTMs para campañas.
- Definir página o estado de gracias si se agrega backend/form provider.

## Sprint 4 - Backend liviano del formulario

Objetivo: dejar de depender solo de WhatsApp/mailto.

- Elegir proveedor: Formspree, Resend, Supabase, API propia o Vercel Functions.
- Guardar consultas con fecha, servicio y origen.
- Enviar email automático al equipo comercial.
- Enviar confirmación al usuario si corresponde.
- Agregar protección antispam básica.

## Sprint 5 - Performance y SEO avanzado

Objetivo: dejar el sitio listo para indexación y campañas.

- Auditar Lighthouse en mobile y desktop.
- Optimizar fuentes, animaciones y peso de JS si hace falta.
- Crear `sitemap.xml` y `robots.txt`.
- Agregar metadatos por servicio con copy más específico.
- Revisar headings, labels, contraste y navegación por teclado.

## Sprint 6 - Contenido comercial profundo

Objetivo: aumentar confianza antes de invertir en pauta fuerte.

- Crear una página o sección de diagnóstico digital.
- Agregar más FAQs por servicio.
- Convertir casos placeholder en casos reales con resultados, capturas y contexto.
- Agregar recursos comerciales: checklist de web, guía de ecommerce, auditoría UX.

## Sprint 7 - Deploy y continuidad

Objetivo: publicar con flujo de trabajo estable.

- Definir hosting: Vercel recomendado para Vite/React.
- Configurar dominio final y variables si se agrega backend.
- Activar previews por PR si se trabaja con GitHub.
- Documentar comandos de trabajo: `npm install`, `npm run dev`, `npm run build`, `npm run lint`.
- Crear checklist de publicación antes de activar campañas.

## Notas para continuar en otra PC

1. Clonar o abrir el repositorio donde quede versionada esta carpeta.
2. Entrar a `Codex Studio`.
3. Ejecutar `npm install`.
4. Ejecutar `npm run dev -- --host 127.0.0.1 --port 5173`.
5. Validar `npm run build` y `npm run lint` antes de publicar.
