import assert from "node:assert/strict";
import test from "node:test";
import { middleware } from "../middleware.ts";
import { NextRequest } from "next/server";

test("middleware redirects unauthorized /admin requests to /admin/login", async () => {
  const req = new NextRequest("http://localhost/admin/posts");
  const res = await middleware(req);
  assert.ok(res);
  assert.equal(res?.status, 307); // Redirect status
  assert.ok(res?.headers.get("location")?.endsWith("/admin/login"));
});

test("middleware blocks unauthorized /api/admin requests with 401", async () => {
  const req = new NextRequest("http://localhost/api/admin/posts");
  const res = await middleware(req);
  assert.ok(res);
  assert.equal(res?.status, 401);
  const body = await res?.json();
  assert.equal(body.ok, false);
  assert.equal(body.error, "No autorizado");
});

test("middleware allows /admin/login request", async () => {
  const req = new NextRequest("http://localhost/admin/login");
  const res = await middleware(req);
  // Unprotected route should pass through (return undefined or a 200 response)
  assert.ok(res === undefined || res === null || res.status === 200);
});
