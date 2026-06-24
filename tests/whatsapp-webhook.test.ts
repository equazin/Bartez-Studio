import assert from "node:assert/strict";
import test from "node:test";
import { parseWebhookPayload } from "../lib/whatsapp/parser.ts";
import { validateSignature } from "../lib/whatsapp/signature.ts";

// ── Parser Tests ─────────────────────────────────────────────

test("parseWebhookPayload returns null for non-whatsapp payloads", () => {
  assert.equal(parseWebhookPayload({}), null);
  assert.equal(parseWebhookPayload({ object: "instagram" }), null);
  assert.equal(parseWebhookPayload(null), null);
  assert.equal(parseWebhookPayload(undefined), null);
});

test("parseWebhookPayload returns null for status-only events", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [{
      changes: [{
        field: "messages",
        value: {
          messaging_product: "whatsapp",
          statuses: [{ id: "wamid.xxx", status: "delivered" }],
        },
      }],
    }],
  };
  assert.equal(parseWebhookPayload(payload), null);
});

test("parseWebhookPayload parses text message correctly", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [{
      changes: [{
        field: "messages",
        value: {
          messaging_product: "whatsapp",
          metadata: {
            display_phone_number: "15550783881",
            phone_number_id: "106540352242922",
          },
          contacts: [{
            profile: { name: "Juan Pérez" },
            wa_id: "5493415104902",
          }],
          messages: [{
            from: "5493415104902",
            id: "wamid.HBgLMTY1MDM4Nzk0MzkVAgA=",
            timestamp: "1749416383",
            type: "text",
            text: { body: "Hola, necesito cotizar 10 notebooks" },
          }],
        },
      }],
    }],
  };

  const result = parseWebhookPayload(payload);
  assert.ok(result, "Should return a parsed message");
  assert.equal(result.senderPhone, "5493415104902");
  assert.equal(result.senderName, "Juan Pérez");
  assert.equal(result.messageId, "wamid.HBgLMTY1MDM4Nzk0MzkVAgA=");
  assert.equal(result.messageType, "text");
  assert.equal(result.body, "Hola, necesito cotizar 10 notebooks");
  assert.equal(result.timestamp, 1749416383000); // Converted to ms
});

test("parseWebhookPayload parses interactive button reply", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [{
      changes: [{
        field: "messages",
        value: {
          messaging_product: "whatsapp",
          contacts: [{ profile: { name: "Test User" }, wa_id: "123456" }],
          messages: [{
            from: "123456",
            id: "wamid.test-interactive",
            timestamp: "1700000000",
            type: "interactive",
            interactive: {
              type: "button_reply",
              button_reply: { id: "btn_cotizar", title: "Cotizar equipamiento" },
            },
          }],
        },
      }],
    }],
  };

  const result = parseWebhookPayload(payload);
  assert.ok(result);
  assert.equal(result.messageType, "interactive_reply");
  assert.equal(result.body, "Cotizar equipamiento");
  assert.equal(result.replyId, "btn_cotizar");
});

test("parseWebhookPayload handles missing contact name", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [{
      changes: [{
        field: "messages",
        value: {
          messaging_product: "whatsapp",
          contacts: [{ wa_id: "999888" }],
          messages: [{
            from: "999888",
            id: "wamid.no-name",
            timestamp: "1700000000",
            type: "text",
            text: { body: "Hola" },
          }],
        },
      }],
    }],
  };

  const result = parseWebhookPayload(payload);
  assert.ok(result);
  assert.equal(result.senderName, "999888"); // Falls back to phone number
});

test("parseWebhookPayload handles image message as media type", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [{
      changes: [{
        field: "messages",
        value: {
          messaging_product: "whatsapp",
          contacts: [{ profile: { name: "Photo Sender" }, wa_id: "111222" }],
          messages: [{
            from: "111222",
            id: "wamid.image-msg",
            timestamp: "1700000000",
            type: "image",
            image: { id: "img_123", mime_type: "image/jpeg" },
          }],
        },
      }],
    }],
  };

  const result = parseWebhookPayload(payload);
  assert.ok(result);
  assert.equal(result.messageType, "image");
  assert.equal(result.body, "");
});

test("parseWebhookPayload handles audio message as media type with mediaId", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [{
      changes: [{
        field: "messages",
        value: {
          messaging_product: "whatsapp",
          contacts: [{ profile: { name: "Voice Note Sender" }, wa_id: "111222" }],
          messages: [{
            from: "111222",
            id: "wamid.audio-msg",
            timestamp: "1700000000",
            type: "audio",
            audio: { id: "audio_abc_123", mime_type: "audio/ogg" },
          }],
        },
      }],
    }],
  };

  const result = parseWebhookPayload(payload);
  assert.ok(result);
  assert.equal(result.messageType, "audio");
  assert.equal(result.mediaId, "audio_abc_123");
  assert.equal(result.body, "");
});

// ── Signature Tests ──────────────────────────────────────────

test("validateSignature returns false when secret is not configured", async () => {
  // WHATSAPP_APP_SECRET is empty in test env
  const result = await validateSignature("test body", "sha256=abc123");
  assert.equal(result, false);
});

test("validateSignature returns false for empty signature", async () => {
  const result = await validateSignature("test body", "");
  assert.equal(result, false);
});
