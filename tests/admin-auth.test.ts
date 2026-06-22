import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server.js";
import { middleware } from "../middleware.ts";
import { authorizeAdminRequest } from "../lib/admin-api.ts";
import { ADMIN_COOKIE_NAME, signToken, verifyToken } from "../lib/auth-token.ts";
import { postCreateSchema } from "../lib/admin-schema.ts";
import { POST as upload } from "../app/api/admin/upload/route.ts";

const originalSecret = process.env.ADMIN_JWT_SECRET;
process.env.ADMIN_JWT_SECRET = "test-secret-with-at-least-thirty-two-characters";

test.after(() => {
  process.env.ADMIN_JWT_SECRET = originalSecret;
});

test("middleware redirects unauthorized admin pages", async () => {
  const response = await middleware(new NextRequest("http://localhost/admin/posts"));
  assert.equal(response.status, 307);
  assert.ok(response.headers.get("location")?.includes("/admin/login"));
});

test("middleware blocks unauthorized admin APIs", async () => {
  const response = await middleware(new NextRequest("http://localhost/api/admin/posts"));
  assert.equal(response.status, 401);
});

test("signed admin token validates issuer, audience and subject", async () => {
  const token = await signToken("admin");
  const session = await verifyToken(token);
  assert.equal(session?.username, "admin");
  assert.equal(session?.sub, "admin");
});

test("route-level authorization accepts a valid cookie and rejects missing cookie", async () => {
  const unauthorized = await authorizeAdminRequest(new Request("http://localhost/api/admin/posts"));
  assert.equal(unauthorized.response?.status, 401);

  const token = await signToken("admin");
  const authorized = await authorizeAdminRequest(new Request("http://localhost/api/admin/posts", {
    headers: { cookie: `${ADMIN_COOKIE_NAME}=${token}` },
  }));
  assert.equal(authorized.response, null);
  assert.equal(authorized.session?.username, "admin");
});

test("cross-site mutations are rejected", async () => {
  const token = await signToken("admin");
  const result = await authorizeAdminRequest(new Request("https://bartez.com.ar/api/admin/posts", {
    method: "POST",
    headers: {
      cookie: `${ADMIN_COOKIE_NAME}=${token}`,
      origin: "https://attacker.example",
      host: "bartez.com.ar",
      "sec-fetch-site": "cross-site",
    },
  }), { mutation: true });
  assert.equal(result.response?.status, 403);
});

test("admin schemas reject malformed article bodies", () => {
  const result = postCreateSchema.safeParse({
    title: "Título válido",
    excerpt: "Un resumen suficientemente extenso.",
    date: "2026-06-22",
    cover: "/image.png",
    metaDescription: "Una descripción suficientemente extensa para validar.",
    readingTime: "5 min",
    bodyContent: [{ html: "<script>alert(1)</script>" }],
    published: true,
  });
  assert.equal(result.success, false);
});

test("upload endpoint requires auth and rejects non-image content", async () => {
  const noAuth = await upload(new Request("http://localhost/api/admin/upload", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "hello",
  }));
  assert.equal(noAuth.status, 401);

  const token = await signToken("admin");
  const badMime = await upload(new Request("http://localhost/api/admin/upload", {
    method: "POST",
    headers: {
      cookie: `${ADMIN_COOKIE_NAME}=${token}`,
      origin: "http://localhost",
      host: "localhost",
      "content-type": "text/plain",
    },
    body: "hello",
  }));
  assert.equal(badMime.status, 415);
});
