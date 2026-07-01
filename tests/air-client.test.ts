import assert from "node:assert/strict";
import test from "node:test";
import { extractToken } from "../lib/integrations/air/client.ts";

test("extractToken: string directo", () => {
  assert.equal(extractToken("abc.def.ghi"), "abc.def.ghi");
  assert.equal(extractToken("  spaced  "), "spaced");
});

test("extractToken: variantes de clave", () => {
  assert.equal(extractToken({ token: "t1" }), "t1");
  assert.equal(extractToken({ access_token: "t2" }), "t2");
  assert.equal(extractToken({ accessToken: "t3" }), "t3");
  assert.equal(extractToken({ jwt: "t4" }), "t4");
});

test("extractToken: anidado en data", () => {
  assert.equal(extractToken({ data: { token: "nested" } }), "nested");
});

test("extractToken: sin token devuelve null", () => {
  assert.equal(extractToken({ foo: "bar" }), null);
  assert.equal(extractToken(null), null);
  assert.equal(extractToken(42), null);
  assert.equal(extractToken(""), null);
});
