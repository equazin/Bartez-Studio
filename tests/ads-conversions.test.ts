import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { formatGoogleDateTime, sendGoogleAdsConversion } from "../lib/integrations/google-ads.ts";
import { hashPii, buildFbc, sendMetaConversion } from "../lib/integrations/meta-ads.ts";

test("formatGoogleDateTime usa el formato que exige Google (UTC)", () => {
  const date = new Date("2026-01-15T12:30:45.000Z");
  assert.equal(formatGoogleDateTime(date), "2026-01-15 12:30:45+00:00");
});

test("hashPii normaliza (trim + lowercase) antes de hashear", () => {
  const expected = createHash("sha256").update("test@example.com").digest("hex");
  assert.equal(hashPii("  TEST@Example.com  "), expected);
  assert.equal(hashPii("test@example.com").length, 64);
});

test("buildFbc arma el formato fb.1.<ts>.<fbclid>", () => {
  assert.equal(buildFbc("abc123", 1700000000000), "fb.1.1700000000000.abc123");
});

test("Google Ads: sin gclid se omite (skipped) sin tocar red", async () => {
  const result = await sendGoogleAdsConversion({
    organizationId: "org_test",
    gclid: "",
    value: 1000,
    currencyCode: "ARS",
  });
  assert.equal(result.platform, "google_ads");
  assert.equal(result.skipped, true);
});

test("Meta Ads: sin fbclid se omite (skipped) sin tocar red", async () => {
  const result = await sendMetaConversion({
    organizationId: "org_test",
    fbclid: "",
    value: 1000,
    currency: "ARS",
  });
  assert.equal(result.platform, "meta_ads");
  assert.equal(result.skipped, true);
});
