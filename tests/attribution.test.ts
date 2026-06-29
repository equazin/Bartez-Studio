import assert from "node:assert/strict";
import test from "node:test";

/**
 * La utilidad de atribución depende de `window` y `document`. Los mockeamos
 * a nivel global antes de importar el módulo, simulando un navegador.
 */
interface FakeWindow {
  location: { search: string; href: string };
}

function setupBrowser(search: string, cookie = ""): { cookieJar: { value: string } } {
  const cookieJar = { value: cookie };
  (globalThis as unknown as { window: FakeWindow }).window = {
    location: { search, href: `https://bartez.com.ar/${search}` },
  };
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    get() {
      return {
        get cookie() {
          return cookieJar.value;
        },
        set cookie(v: string) {
          // Guardamos sólo el par nombre=valor (ignoramos atributos).
          const pair = v.split(";")[0];
          cookieJar.value = pair;
        },
      };
    },
  });
  return { cookieJar };
}

test("captureFirstTouch persiste UTMs y gclid de la URL", async () => {
  setupBrowser("?utm_source=google&utm_campaign=verano&gclid=abc123");
  const mod = await import(`../lib/attribution.ts?case=1`);
  mod.captureFirstTouch();
  const attr = mod.getAttribution();
  assert.equal(attr.utmSource, "google");
  assert.equal(attr.utmCampaign, "verano");
  assert.equal(attr.gclid, "abc123");
  assert.ok(attr.landingUrl);
});

test("getAttribution sin señales devuelve undefined", async () => {
  setupBrowser("?foo=bar");
  const mod = await import(`../lib/attribution.ts?case=2`);
  const attr = mod.getAttribution();
  assert.equal(attr, undefined);
});

test("first-touch no se pisa si ya hay cookie", async () => {
  // Cookie previa con campaña "invierno"; la URL trae "verano".
  const stored = encodeURIComponent(JSON.stringify({ utmCampaign: "invierno", gclid: "old" }));
  setupBrowser("?utm_campaign=verano&gclid=new", `bz_attr=${stored}`);
  const mod = await import(`../lib/attribution.ts?case=3`);
  mod.captureFirstTouch(); // no debe sobreescribir
  const attr = mod.getAttribution();
  assert.equal(attr.utmCampaign, "invierno");
  assert.equal(attr.gclid, "old");
});

test("getAttribution lee fbclid de la URL como fallback", async () => {
  setupBrowser("?fbclid=fb_xyz");
  const mod = await import(`../lib/attribution.ts?case=4`);
  const attr = mod.getAttribution();
  assert.equal(attr.fbclid, "fb_xyz");
});
