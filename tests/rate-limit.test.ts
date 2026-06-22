import assert from "node:assert/strict";
import test from "node:test";
import { checkRateLimit } from "../lib/rate-limit.ts";

test("blocks requests after the configured limit", () => {
  const request = new Request("https://bartez.test/api/lead", {
    headers: { "x-forwarded-for": "203.0.113.42" },
  });

  assert.equal(checkRateLimit(request, "test", 2).allowed, true);
  assert.equal(checkRateLimit(request, "test", 2).allowed, true);
  const blocked = checkRateLimit(request, "test", 2);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfter > 0);
});
