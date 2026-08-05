import assert from "node:assert/strict";
import test from "node:test";
import { isAirConfiguredSync, invalidateAirToken } from "../lib/integrations/air/client.ts";

test("isAirConfiguredSync: false sin AIR_TOKEN", () => {
  const prev = process.env.AIR_TOKEN;
  delete process.env.AIR_TOKEN;
  assert.equal(isAirConfiguredSync(), false);
  if (prev !== undefined) process.env.AIR_TOKEN = prev;
});

test("isAirConfiguredSync: false con AIR_TOKEN vacío o en blanco", () => {
  const prev = process.env.AIR_TOKEN;
  process.env.AIR_TOKEN = "   ";
  assert.equal(isAirConfiguredSync(), false);
  if (prev !== undefined) process.env.AIR_TOKEN = prev;
  else delete process.env.AIR_TOKEN;
});

test("isAirConfiguredSync: true con AIR_TOKEN presente", () => {
  const prev = process.env.AIR_TOKEN;
  process.env.AIR_TOKEN = "token-fijo";
  assert.equal(isAirConfiguredSync(), true);
  if (prev !== undefined) process.env.AIR_TOKEN = prev;
  else delete process.env.AIR_TOKEN;
});

test("invalidateAirToken: no lanza", () => {
  assert.doesNotThrow(() => invalidateAirToken());
});
