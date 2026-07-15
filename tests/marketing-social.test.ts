import { test } from "node:test";
import assert from "node:assert/strict";
import { META_OAUTH_URL, META_REQUIRED_SCOPES } from "../lib/integrations/meta-graph.ts";

test("META_OAUTH_URL apunta al dialog de Facebook", () => {
  assert.ok(META_OAUTH_URL.startsWith("https://www.facebook.com/"));
  assert.ok(META_OAUTH_URL.endsWith("/dialog/oauth"));
});

test("Los scopes incluyen los mínimos para publicar en FB e IG", () => {
  const required = ["pages_manage_posts", "instagram_content_publish", "pages_show_list"];
  for (const scope of required) {
    assert.ok(
      (META_REQUIRED_SCOPES as readonly string[]).includes(scope),
      `Falta el scope ${scope}`,
    );
  }
});
