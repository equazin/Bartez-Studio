/**
 * constants.ts — Barrel de re-export de la fuente de verdad de contenido
 * comercial de Bartez Tecnología. Los archivos reales viven bajo `constants/`
 * agrupados por dominio para no acumular deuda en un solo archivo largo.
 *
 * Preservado como export barrel para que todos los `import from "@/constants"`
 * existentes en el proyecto sigan funcionando sin cambios.
 *
 * Estructura:
 *  - constants/company.ts   — company, contact, faq, cookie, seo
 *  - constants/partners.ts  — partners (marcas)
 *  - constants/verticals.ts — Vertical type + verticals (12 landings /soluciones/[slug])
 *  - constants/articles.ts  — Article type + articles (blog /recursos)
 *  - constants/legal.ts     — LegalPage type + legalPages (/legales/[slug])
 *
 * Editá el archivo específico por dominio, no este barrel.
 */

export { company, contact, faq, cookie, seo } from "./constants/company.ts";
export { partners } from "./constants/partners.ts";
export { type Vertical, verticals } from "./constants/verticals.ts";
export { type Article, articles } from "./constants/articles.ts";
export { type LegalPage, legalPages } from "./constants/legal.ts";
