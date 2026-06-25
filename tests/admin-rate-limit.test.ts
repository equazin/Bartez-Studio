import assert from "node:assert/strict";
import test from "node:test";
import { checkRateLimit } from "../lib/rate-limit.ts";

test("admin mutation rate limit allows 30 requests per minute", () => {
  const request = new Request("https://bartez.test/api/admin/posts", {
    headers: { "x-forwarded-for": "10.0.0.99" },
  });

  for (let i = 0; i < 30; i++) {
    assert.equal(checkRateLimit(request, "admin:mutations:test", 30, 60_000).allowed, true);
  }

  const blocked = checkRateLimit(request, "admin:mutations:test", 30, 60_000);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfter > 0);
});

test("different IPs have independent rate limit buckets", () => {
  const ip1 = new Request("https://bartez.test/api/admin/posts", {
    headers: { "x-forwarded-for": "10.0.1.1" },
  });
  const ip2 = new Request("https://bartez.test/api/admin/posts", {
    headers: { "x-forwarded-for": "10.0.1.2" },
  });

  for (let i = 0; i < 3; i++) {
    checkRateLimit(ip1, "admin:isolation:test", 3, 60_000);
  }
  assert.equal(checkRateLimit(ip1, "admin:isolation:test", 3, 60_000).allowed, false);
  assert.equal(checkRateLimit(ip2, "admin:isolation:test", 3, 60_000).allowed, true);
});
