import assert from "node:assert/strict";
import test from "node:test";
import { captureFirstTouch, getAttribution } from "../lib/attribution.ts";

/**
 * La utilidad de atribución lee `window`/`document` en cada llamada (sin estado
 * de módulo), así que un único import alcanza: cada test prepara un navegador
 * falso y luego invoca las funciones.
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

test("captureFirstTouch persiste UTMs y gclid de la URL", () => {
  setupBrowser("?utm_source=google&utm_campaign=verano&gclid=abc123");
  captureFirstTouch();
  const attr = getAttribution();
  assert.equal(attr?.utmSource, "google");
  assert.equal(attr?.utmCampaign, "verano");
  assert.equal(attr?.gclid, "abc123");
  assert.ok(attr?.landingUrl);
});

test("getAttribution sin señales devuelve undefined", () => {
  setupBrowser("?foo=bar");
  assert.equal(getAttribution(), undefined);
});

test("first-touch no se pisa si ya hay cookie", () => {
  // Cookie previa con campaña "invierno"; la URL trae "verano".
  const stored = encodeURIComponent(JSON.stringify({ utmCampaign: "invierno", gclid: "old" }));
  setupBrowser("?utm_campaign=verano&gclid=new", `bz_attr=${stored}`);
  captureFirstTouch(); // no debe sobreescribir
  const attr = getAttribution();
  assert.equal(attr?.utmCampaign, "invierno");
  assert.equal(attr?.gclid, "old");
});

test("getAttribution lee fbclid de la URL como fallback", () => {
  setupBrowser("?fbclid=fb_xyz");
  assert.equal(getAttribution()?.fbclid, "fb_xyz");
});
