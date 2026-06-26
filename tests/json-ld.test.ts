import assert from "node:assert/strict";
import test from "node:test";
import { safeJsonLd } from "../lib/json-ld.ts";

test("safeJsonLd escapa < > & para no romper el <script>", () => {
  const out = safeJsonLd({ name: "</script><script>alert(1)</script>" });
  assert.ok(!out.includes("</script>"), "no debe contener </script> literal");
  assert.ok(!out.includes("<script>"), "no debe contener <script> literal");
  assert.ok(out.includes("\\u003c"), "debe escapar < como \\u003c");
});

test("safeJsonLd produce JSON que vuelve al valor original", () => {
  const value = { a: "x < y & z > w", n: 42 };
  const out = safeJsonLd(value);
  // El navegador decodifica < etc.; JSON.parse hace lo mismo.
  assert.deepEqual(JSON.parse(out), value);
});

test("safeJsonLd escapa ampersand", () => {
  const out = safeJsonLd({ q: "a & b" });
  assert.ok(out.includes("\\u0026"));
  assert.ok(!out.includes(" & "));
});
