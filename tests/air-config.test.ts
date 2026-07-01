import assert from "node:assert/strict";
import test from "node:test";
import { getAirConfig, isAirEnabled } from "../lib/integrations/air/config.ts";

function withEnv<T>(vars: Record<string, string | undefined>, fn: () => T): T {
  const original: Record<string, string | undefined> = {};
  for (const key of Object.keys(vars)) {
    original[key] = process.env[key];
    if (vars[key] === undefined) delete process.env[key];
    else process.env[key] = vars[key];
  }
  try {
    return fn();
  } finally {
    for (const key of Object.keys(vars)) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
}

test("AIR está apagado por defecto", () => {
  withEnv({ AIR_INTEGRATION_ENABLED: undefined }, () => {
    assert.equal(isAirEnabled(), false);
  });
});

test("AIR se enciende con 'true' / '1' / 'yes'", () => {
  for (const v of ["true", "1", "yes", "TRUE"]) {
    withEnv({ AIR_INTEGRATION_ENABLED: v }, () => {
      assert.equal(isAirEnabled(), true, `esperado true para "${v}"`);
    });
  }
});

test("AIR sigue apagado con valores inválidos", () => {
  for (const v of ["false", "0", "", "no", "off"]) {
    withEnv({ AIR_INTEGRATION_ENABLED: v }, () => {
      assert.equal(isAirEnabled(), false, `esperado false para "${v}"`);
    });
  }
});

test("baseUrl e intervalo tienen defaults sensatos", () => {
  withEnv({ AIR_BASE_URL: undefined, AIR_SYNC_INTERVAL_MINUTES: undefined }, () => {
    const cfg = getAirConfig();
    assert.equal(cfg.baseUrl, "https://api.air-intra.com/v2");
    assert.equal(cfg.syncIntervalMinutes, 15);
  });
});

test("intervalo inválido cae al default", () => {
  withEnv({ AIR_SYNC_INTERVAL_MINUTES: "no-numérico" }, () => {
    assert.equal(getAirConfig().syncIntervalMinutes, 15);
  });
});
