# Propuestas de refuerzo — Bartez Tecnología

Catálogo de mejoras posibles para la landing, priorizadas por impacto comercial.
Marcá las que querés y las construyo.

---

## 🅰️ Cotización y herramientas comerciales (lo que más mueve la aguja)

### A1. Sección "Armá tu cotización" — Quote Builder interactivo ⭐ (recomendada)
Una sección/página dedicada donde el cliente **arma su pedido en pasos**, en vez de escribir todo en un campo de texto:

- **Paso 1 — Categorías:** elige qué necesita (Servidores, Notebooks, Redes, Workstations, CCTV, Periféricos, Servicios). Selección múltiple con íconos.
- **Paso 2 — Detalle:** por cada categoría, cantidad y gama/variante (ej. Notebooks: Essential / Pro / Elite + cantidad con stepper). Campos opcionales de specs.
- **Paso 3 — Datos de la empresa:** empresa, contacto, email, teléfono, urgencia.
- **Paso 4 — Resumen y envío:** panel lateral con el "carrito" de lo seleccionado → se envía como **lead estructurado** a Apollo + monday + mail (con el detalle del pedido, no un texto suelto).

**Por qué:** califica mejor el lead, sube la conversión (menos fricción que un textarea) y le da al equipo comercial todo listo para cotizar. Reutiliza el `/api/lead` actual extendiendo el payload.

### A2. Botón "Cotizar este producto" en el catálogo
Cada card del catálogo destacado abre el form **prellenado** con la marca/modelo. Cotización en 1 clic.

### A3. Configurador de fleet de notebooks
Mini-herramienta: slider de cantidad + selector de gama → muestra un **rango estimado** y CTA "Pedí la cotización exacta". Ideal para el caso "recambio de notebooks".

### A4. Carga de lista / BOM (Excel/CSV)
El cliente sube su lista de equipos a cotizar (un Excel) → se adjunta al lead. Muy usado en compras corporativas.

### A5. Cotización por WhatsApp con contexto
El botón de WhatsApp arma automáticamente el mensaje con lo que el cliente seleccionó/miró.

---

## 🅱️ Confianza y prueba social

- **B1. Casos de éxito reales** — reemplazar el testimonial placeholder por 2-3 casos con logo de cliente, foto y resultado concreto (ej. "recambio de 120 notebooks en 10 días").
- **B2. Logos reales de partners** — traer los brand kits oficiales (Dell, Lenovo, HP, Cisco, Intel, AMD) para la trust bar, en escala de grises.
- **B3. Sellos y certificaciones** — "Partner autorizado", "Factura A", "Garantía oficial" como badges con ícono.
- **B4. Reseñas de Google** — bloque con estrellas y reseñas reales (si tenés Google Business).
- **B5. Contador de impacto** — "+X empresas", "+Y equipos entregados" con animación al hacer scroll.

---

## 🅲️ Catálogo y producto

- **C1. Catálogo navegable real** — página `/catalogo` con categorías y filtros (no transaccional: cada producto lleva a cotizar).
- **C2. Fotos de producto reales** — reemplazar los placeholders del carousel por fotos licenciadas.
- **C3. Comparador de gamas** — tabla Essential vs Pro vs Elite (notebooks/PCs).
- **C4. Fichas técnicas descargables** — PDF por producto/línea (lead-gate como el brochure).
- **C5. Destacados / oportunidades del mes** — bloque editable de productos en oferta o con stock especial.

---

## 🅳️ Contenido, SEO y captación de tráfico

- **D1. Blog / Recursos** — guías de compra IT, comparativas, "cómo dimensionar un servidor". Atrae tráfico orgánico y nutre leads.
- **D2. Landing pages por vertical** — `/servidores`, `/notebooks-corporativas`, `/cctv` optimizadas para campañas de Google Ads (mejor Quality Score → menor costo por lead).
- **D3. Páginas por marca** — `/dell`, `/lenovo`… para SEO de marca ("Dell mayorista Argentina").
- **D4. Newsletter de stock y precios** — captura de email para novedades; integra con el mail provider.
- **D5. Calculadora de TCO / ahorro** — herramienta interactiva que estima ahorro vs comprar minorista.

---

## 🅴️ Conversión y experiencia

- **E1. Chat / chatbot con IA** — responde dudas frecuentes 24/7 y captura el lead (se puede armar con Claude).
- **E2. Callback "te llamamos en 5 minutos"** — mini-form de teléfono con alta intención.
- **E3. Exit-intent** — al intentar salir, ofrece el brochure o una cotización exprés.
- **E4. Banner de urgencia / promo** — barra superior editable ("Semana de servidores Dell").
- **E5. Formulario multipaso con barra de progreso** — reduce fricción vs el form largo.
- **E6. Pruebas A/B** del hero y CTAs para optimizar conversión con datos.

---

## 🅵️ Operación y cuenta B2B (etapa 2)

- **F1. Portal "Mi cuenta"** — login simple para que el cliente vea sus cotizaciones y pedidos.
- **F2. Seguimiento de pedido** — estado y tracking del envío.
- **F3. Simulador de financiación / leasing** — cuotas estimadas según monto.
- **F4. Cuenta corriente online** — solicitud y estado de la cuenta corporativa.

---

## 🅶️ Técnico, performance y analítica

- **G1. Activar GA4 + Meta Pixel** (ya cableado) + eventos por cada CTA y dashboard de conversión.
- **G2. Heatmaps** (Microsoft Clarity, gratis) para ver dónde clickean y dónde abandonan.
- **G3. Schema Product/Offer** en el catálogo para rich results.
- **G4. PWA instalable** — la web se "instala" como app en el celular del comprador.
- **G5. Sitemap por secciones + robots afinado** (ya hay base).

---

## 📦 Paquetes sugeridos para arrancar

- **Paquete "Conversión"** (impacto inmediato): A1 Quote Builder + A2 cotizar producto + E4 banner promo + G1 analytics.
- **Paquete "Confianza"**: B1 casos reales + B2 logos reales + B5 contador animado + C2 fotos de producto.
- **Paquete "Tráfico/SEO"**: D1 blog + D2 landings por vertical + D3 páginas por marca.

> Recomendación: arrancar por el **Paquete Conversión** con el **Quote Builder (A1)** como estrella.

---

## 🛠️ PENDIENTE: Panel de administración (CMS) para editar el sitio

**Objetivo:** que puedan editar desde un panel —sin tocar código— imágenes, textos, productos del catálogo, las landings por vertical y el blog.

Hoy todo el contenido vive en `constants.ts` (rápido y versionado, pero requiere un dev para editar). Para un panel propio, las opciones recomendadas:

| Opción | Qué es | Pros | Contras |
|---|---|---|---|
| **Sanity** (recomendado) | CMS headless hosteado, con editor visual. Studio embebido en `/studio`. | Editor muy amigable, free tier generoso, rápido de montar. | Contenido fuera del repo (en Sanity). |
| **Payload CMS** | CMS self-hosted (Node + DB) en el mismo Vercel. | Control total, datos propios, free. | Necesita base de datos y más setup. |
| **TinaCMS / Decap** | CMS sobre Git (los cambios se commitean al repo). | Gratis, contenido en el repo. | Editores necesitan cuenta de GitHub; menos amigable. |
| **Supabase + admin propio** | Reusar el Supabase del portal nexus + UI de admin. | Aprovecha infra existente. | Más desarrollo a medida. |

**Alcance del trabajo (cualquier opción):**
1. Modelar el contenido (productos, verticales, artículos, textos, imágenes) como esquemas del CMS.
2. Migrar el contenido actual de `constants.ts` al CMS.
3. Refactorizar los componentes para leer del CMS (en build o runtime).
4. Auth del panel + gestión de imágenes (upload).

> Es un proyecto en sí (varios días). Cuando lo quieras encarar, mi recomendación es **Sanity** por la relación esfuerzo/usabilidad. Avisá y lo planificamos.
