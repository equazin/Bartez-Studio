# Bartez Tecnología — sitio institucional B2B

Sitio comercial de Bartez Tecnología para orientar empresas, explicar soluciones IT y convertir consultas en oportunidades comerciales. La experiencia es institucional: no incluye catálogo, carrito, checkout ni portal de clientes.

## Stack

- Next.js 16, React 19 y TypeScript.
- Tailwind CSS y Lucide.
- Vercel AI SDK 6 + AI Elements para el asistente.
- Zod para validación.
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

La API de leads sólo confirma éxito cuando al menos un destino durable conserva el dato: archivo HTTP, monday o Apollo.

## Recorrido principal

1. Hero y señales de confianza.
2. Selector de necesidades empresariales.
3. Capacidades técnicas y proceso de trabajo.
4. Casos reales únicamente cuando exista autorización.
5. Consulta guiada en tres pasos: necesidad, contexto y contacto.
6. Asistente IA con derivación explícitamente consentida al equipo comercial.

## Asistente IA

El endpoint `POST /api/chat` usa AI SDK y Vercel AI Gateway. La base de conocimiento está en `lib/ai/knowledge.ts`.

Variables:

```env
AI_GATEWAY_MODEL=openai/gpt-5.4
# Sólo para entornos fuera de Vercel. En Vercel se usa OIDC.
AI_GATEWAY_API_KEY=
```

El asistente:

- Responde únicamente sobre capacidades verificadas de Bartez.
- No confirma precios, stock, plazos, garantías ni financiación.
- Limita longitud, cantidad de mensajes y frecuencia por dirección.
- No envía datos al CRM automáticamente.
- Presenta un formulario separado que requiere confirmación del visitante.
- Ofrece WhatsApp como salida humana permanente.

## Captura de leads

`POST /api/lead` valida la consulta y ejecuta los destinos configurados en paralelo:

- `LEAD_STORE_URL` / `LEAD_STORE_TOKEN`
- Apollo
- monday.com
- Resend o Brevo
- Agenda opcional

Los leads de la consulta guiada pueden incluir necesidad, escala, urgencia, canal preferido y resumen de la conversación.

## Contenido y marca

- Datos del negocio y páginas verticales: `constants.ts`.
- Logos: `public/brand/`.
- Concepto visual aprobado: `docs/design/bartez-institutional-concept.png`.
- Recursos editoriales: `/recursos`.
- El antiguo PDF de catálogo queda bloqueado mediante redirect y no se incluye en despliegues.

## Validación antes de producción

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Además, verificar en desktop y móvil:

- Formulario guiado completo.
- Apertura y cierre del asistente.
- Fallback a WhatsApp.
- Consentimiento antes de crear el lead.
- Ausencia de textos o controles con apariencia de e-commerce.

## Gestión del Repositorio y CI/CD

### Convención de Ramas
Para mantener el historial ordenado, se utiliza la siguiente nomenclatura de ramas:
- `feat/nombre-feature`: Para nuevas funcionalidades o componentes.
- `fix/nombre-bug`: Para correcciones de errores.
- `refactor/nombre-cambio`: Para mejoras en el código sin cambios funcionales.
- `claude/descripcion`: Para ramas generadas por la IA.

### Integración Continua (CI)
El repositorio cuenta con un workflow de GitHub Actions (`.github/workflows/ci.yml`) que se ejecuta automáticamente en cada push a `main` o ramas `claude/**`, y en cada Pull Request.
El workflow valida:
1. `npm ci` (instalación limpia de dependencias).
2. `npm run lint` (estilo y calidad del código).
3. `npm run typecheck` (verificación de tipos de TypeScript).
4. `npm test` (suite de pruebas unitarias y de integración).
5. `npm run build` (compilación del proyecto Next.js).

### Reglas de Branch Protection en GitHub
Para garantizar la estabilidad de la rama principal, se recomienda configurar las siguientes reglas de protección para la rama `main` en GitHub (**Settings > Branches > Add rule**):
- **Branch name pattern**: `main`
- **Require a pull request before merging**: Activar (requerir al menos 1 aprobación).
- **Require status checks to pass before merging**: Activar y buscar el check `verify` de GitHub Actions. Esto impide mergear código que rompa builds o tests.
- **Require conversation resolution before merging**: Activar para asegurar que todos los comentarios en el PR estén resueltos.
- **Restrict who can push to matching branches**: Evitar pushes directos de desarrolladores individuales (todo debe pasar por PR).