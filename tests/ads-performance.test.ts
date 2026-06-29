import test from "node:test";
import assert from "node:assert/strict";
import { attributeCampaign } from "../lib/modules/ads/performance-service.ts";

test("attributeCampaign detects Google Ads from gclid", () => {
  const attr = attributeCampaign({ gclid: "abc123", utmCampaign: "Mayoristas Junio" });
  assert.equal(attr?.platform, "google_ads");
  assert.equal(attr?.campaignName, "Mayoristas Junio");
  assert.equal(attr?.campaignKey, "google_ads:mayoristas junio");
});

test("attributeCampaign detects Meta Ads from fbclid or utm source", () => {
  assert.equal(attributeCampaign({ fbclid: "fb123" })?.platform, "meta_ads");
  assert.equal(attributeCampaign({ utmSource: "instagram", utmCampaign: "Retail" })?.platform, "meta_ads");
});

test("attributeCampaign ignores organic traffic without paid identifiers", () => {
  assert.equal(attributeCampaign({ utmSource: "newsletter", utmCampaign: "Clientes" }), null);
});
