# Bartez TecnologÃ­a â€” sitio institucional B2B

Sitio comercial de Bartez TecnologÃ­a para orientar empresas, explicar soluciones IT y convertir consultas en oportunidades comerciales. La experiencia es institucional: no incluye catÃ¡logo, carrito, checkout ni portal de clientes.

## Stack

- Next.js 16, React 19 y TypeScript.
- Tailwind CSS y Lucide.
- Vercel AI SDK 6 + AI Elements para el asistente.
- Zod para validaciÃ³n.
- Vercel como plataforma de despliegue y AI Gateway.

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

La API de leads sÃ³lo confirma Ã©xito cuando al menos un destino durable conserva el dato: archivo HTTP, monday o Apollo.

## Recorrido principal

1. Hero y seÃ±ales de confianza.
2. Selector de necesidades empresariales.
3. Capacidades tÃ©cnicas y proceso de trabajo.
4. Casos reales Ãºnicamente cuando exista autorizaciÃ³n.
5. Consulta guiada en tres pasos: necesidad, contexto y contacto.
6. Asistente IA con derivaciÃ³n explÃ­citamente consentida al equipo comercial.

## Asistente IA

El endpoint `POST /api/chat` usa AI SDK y Vercel AI Gateway. La base de conocimiento estÃ¡ en `lib/ai/knowledge.ts`.

Variables:

```env
AI_GATEWAY_MODEL=anthropic/claude-haiku-4.5
# SÃ³lo para entornos fuera de Vercel. En Vercel se usa OIDC.
AI_GATEWAY_API_KEY=
```

El asistente:

- Responde Ãºnicamente sobre capacidades verificadas de Bartez.
- No confirma precios, stock, plazos, garantÃ­as ni financiaciÃ³n.
- Limita longitud, cantidad de mensajes y frecuencia por direcciÃ³n.
- No envÃ­a datos al CRM automÃ¡ticamente.
- Presenta un formulario separado que requiere confirmaciÃ³n del visitante.
- Ofrece WhatsApp como salida humana permanente.


## Bot WhatsApp

El endpoint `POST /api/whatsapp/webhook` recibe eventos de WhatsApp Cloud API, valida la firma `X-Hub-Signature-256`, persiste conversaciones en Prisma y usa AI Gateway para clasificar/derivar consultas.

Variables principales:

```env
AI_GATEWAY_MODEL=anthropic/claude-haiku-4.5
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_API_TOKEN=
WHATSAPP_APP_SECRET=
WEBHOOK_VERIFY_TOKEN=
WHATSAPP_REQUIRE_LEAD_CONFIRMATION=true
WHATSAPP_SANDBOX_NUMBER_NORMALIZATION=false
WHATSAPP_AUDIO_TRANSCRIPTION_ENABLED=false
```

Para producción con número real, `WHATSAPP_SANDBOX_NUMBER_NORMALIZATION` debe quedar en `false`. El bot solicita confirmación explícita (`SI`/`NO`) antes de crear un lead comercial desde WhatsApp.

Webhook público para Meta:

```text
https://bartez.com.ar/api/whatsapp/webhook
```

Evento requerido: `messages`.

## Captura de leads

`POST /api/lead` valida la consulta y ejecuta los destinos configurados en paralelo:

- `LEAD_STORE_URL` / `LEAD_STORE_TOKEN`
- Apollo
- monday.com
- Resend o Brevo
- Agenda opcional

Los leads de la consulta guiada pueden incluir necesidad, escala, urgencia, canal preferido y resumen de la conversaciÃ³n.

## Contenido y marca

- Datos del negocio y pÃ¡ginas verticales: `constants.ts`.
- Logos: `public/brand/`.
- Concepto visual aprobado: `docs/design/bartez-institutional-concept.png`.
- Recursos editoriales: `/recursos`.
- El antiguo PDF de catÃ¡logo queda bloqueado mediante redirect y no se incluye en despliegues.

## ValidaciÃ³n antes de producciÃ³n

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

AdemÃ¡s, verificar en desktop y mÃ³vil:

- Formulario guiado completo.
- Apertura y cierre del asistente.
- Fallback a WhatsApp.
- Consentimiento antes de crear el lead.
- Ausencia de textos o controles con apariencia de e-commerce.

## GestiÃ³n del Repositorio y CI/CD

### ConvenciÃ³n de Ramas
Para mantener el historial ordenado, se utiliza la siguiente nomenclatura de ramas:
- `feat/nombre-feature`: Para nuevas funcionalidades o componentes.
- `fix/nombre-bug`: Para correcciones de errores.
- `refactor/nombre-cambio`: Para mejoras en el cÃ³digo sin cambios funcionales.
- `claude/descripcion`: Para ramas generadas por la IA.

### IntegraciÃ³n Continua (CI)
El repositorio cuenta con un workflow de GitHub Actions (`.github/workflows/ci.yml`) que se ejecuta automÃ¡ticamente en cada push a `main` o ramas `claude/**`, y en cada Pull Request.
El workflow valida:
1. `npm ci` (instalaciÃ³n limpia de dependencias).
2. `npm run lint` (estilo y calidad del cÃ³digo).
3. `npm run typecheck` (verificaciÃ³n de tipos de TypeScript).
4. `npm test` (suite de pruebas unitarias y de integraciÃ³n).
5. `npm run build` (compilaciÃ³n del proyecto Next.js).

### Reglas de Branch Protection en GitHub
Para garantizar la estabilidad de la rama principal, se recomienda configurar las siguientes reglas de protecciÃ³n para la rama `main` en GitHub (**Settings > Branches > Add rule**):
- **Branch name pattern**: `main`
- **Require a pull request before merging**: Activar (requerir al menos 1 aprobaciÃ³n).
- **Require status checks to pass before merging**: Activar y buscar el check `verify` de GitHub Actions. Esto impide mergear cÃ³digo que rompa builds o tests.
- **Require conversation resolution before merging**: Activar para asegurar que todos los comentarios en el PR estÃ©n resueltos.
- **Restrict who can push to matching branches**: Evitar pushes directos de desarrolladores individuales (todo debe pasar por PR).

