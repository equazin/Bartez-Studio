import assert from "node:assert/strict";
import test from "node:test";
import { getDynamicPartners, getDynamicArticles, getDynamicArticleBySlug } from "../lib/db-content.ts";
import { partners, articles } from "../constants.ts";

test("db content helpers fallback to static values when database is unconfigured or empty", async () => {
  // Sin variables de entorno de base de datos activas en el entorno del test runner,
  // las llamadas a Prisma deben fallar silenciosamente y caer al fallback estático de constants.ts.
  const dynamicPartners = await getDynamicPartners();
  assert.equal(dynamicPartners.length, partners.brands.length);
  assert.equal(dynamicPartners[0].name, partners.brands[0].name);

  const dynamicArticles = await getDynamicArticles();
  assert.equal(dynamicArticles.length, articles.length);
  assert.equal(dynamicArticles[0].slug, articles[0].slug);

  const slug = "como-elegir-servidor-para-tu-empresa";
  const article = await getDynamicArticleBySlug(slug);
  assert.ok(article);
  assert.equal(article?.title, "Cómo elegir el servidor correcto para tu empresa");
});
