import assert from "node:assert/strict";
import test from "node:test";
import { getAirConfig, isAirEnabled } from "../lib/integrations/air/config.ts";

async function withEnvAsync<T>(vars: Record<string, string | undefined>, fn: () => Promise<T>): Promise<T> {
  const original: Record<string, string | undefined> = {};
  for (const key of Object.keys(vars)) {
    original[key] = process.env[key];
    if (vars[key] === undefined) delete process.env[key];
    else process.env[key] = vars[key];
  }
  try {
    return await fn();
  } finally {
    for (const key of Object.keys(vars)) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
}

test("AIR está apagado por defecto", async () => {
  await withEnvAsync({ AIR_INTEGRATION_ENABLED: undefined }, async () => {
    assert.equal(await isAirEnabled(), false);
  });
});

test("AIR se enciende con 'true' / '1' / 'yes'", async () => {
  for (const v of ["true", "1", "yes", "TRUE"]) {
    await withEnvAsync({ AIR_INTEGRATION_ENABLED: v }, async () => {
      assert.equal(await isAirEnabled(), true, `esperado true para "${v}"`);
    });
  }
});

test("AIR sigue apagado con valores inválidos", async () => {
  for (const v of ["false", "0", "", "no", "off"]) {
    await withEnvAsync({ AIR_INTEGRATION_ENABLED: v }, async () => {
      assert.equal(await isAirEnabled(), false, `esperado false para "${v}"`);
    });
  }
});

test("baseUrl e intervalo tienen defaults sensatos", async () => {
  await withEnvAsync({ AIR_BASE_URL: undefined, AIR_SYNC_INTERVAL_MINUTES: undefined }, async () => {
    const cfg = await getAirConfig();
    assert.equal(cfg.baseUrl, "https://api.air-intra.com/v2");
    assert.equal(cfg.syncIntervalMinutes, 15);
  });
});

test("intervalo inválido cae al default", async () => {
  await withEnvAsync({ AIR_SYNC_INTERVAL_MINUTES: "no-numérico" }, async () => {
    const cfg = await getAirConfig();
    assert.equal(cfg.syncIntervalMinutes, 15);
  });
});
