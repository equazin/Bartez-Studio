// ---------------------------------------------------------------------------
// WhatsApp Webhook — Payload Parser
// ---------------------------------------------------------------------------

export type ParsedMessage = {
  senderPhone: string;
  senderName: string;
  messageId: string;
  messageType:
    | "text"
    | "interactive_reply"
    | "image"
    | "document"
    | "audio"
    | "unsupported";
  body: string; // Text content or button/list reply title
  replyId?: string; // For interactive replies, the button/row ID
  timestamp: number;
};

// ---- Internal shape helpers (not exported) ---------------------------------

interface WaTextMessage {
  type: "text";
  text?: { body?: string };
}

interface WaInteractiveMessage {
  type: "interactive";
  interactive?: {
    type?: "button_reply" | "list_reply";
    button_reply?: { id?: string; title?: string };
    list_reply?: { id?: string; title?: string };
  };
}

interface WaMediaMessage {
  type: "image" | "document" | "audio";
  [key: string]: unknown;
}

type WaMessage = (WaTextMessage | WaInteractiveMessage | WaMediaMessage) & {
  id?: string;
  from?: string;
  timestamp?: string;
};

interface WaContact {
  wa_id?: string;
  profile?: { name?: string };
}

interface WaValue {
  messaging_product?: string;
  contacts?: WaContact[];
  messages?: WaMessage[];
  statuses?: unknown[];
}

interface WaChange {
  field?: string;
  value?: WaValue;
}

interface WaEntry {
  changes?: WaChange[];
}

interface WaWebhookBody {
  object?: string;
  entry?: WaEntry[];
}

// ---- Public API ------------------------------------------------------------

/**
 * Parses a raw Meta webhook payload into a `ParsedMessage`, or returns `null`
 * for non-message events (status updates, delivery receipts, etc.).
 */
export function parseWebhookPayload(body: unknown): ParsedMessage | null {
  const payload = body as WaWebhookBody | undefined;
  if (!payload || payload.object !== "whatsapp_business_account") return null;

  const change = payload.entry?.[0]?.changes?.[0];
  if (!change || change.field !== "messages") return null;

  const value = change.value;
  if (!value) return null;

  // Status updates don't carry messages — ignore them.
  if (value.statuses && value.statuses.length > 0 && (!value.messages || value.messages.length === 0)) {
    return null;
  }

  const message = value.messages?.[0];
  if (!message || !message.id || !message.from) return null;

  const contact = value.contacts?.[0];

  const base = {
    senderPhone: message.from,
    senderName: contact?.profile?.name ?? message.from,
    messageId: message.id,
    timestamp: message.timestamp ? Number(message.timestamp) * 1_000 : Date.now(),
  };

  // --- Text messages ---
  if (message.type === "text") {
    return {
      ...base,
      messageType: "text",
      body: (message as WaTextMessage).text?.body ?? "",
    };
  }

  // --- Interactive replies (buttons / lists) ---
  if (message.type === "interactive") {
    const interactive = (message as WaInteractiveMessage).interactive;
    const reply = interactive?.button_reply ?? interactive?.list_reply;
    return {
      ...base,
      messageType: "interactive_reply",
      body: reply?.title ?? "",
      replyId: reply?.id,
    };
  }

  // --- Media messages (image / document / audio) ---
  if (message.type === "image" || message.type === "document" || message.type === "audio") {
    return {
      ...base,
      messageType: message.type,
      body: "",
    };
  }

  // --- Anything else we don't handle yet ---
  return {
    ...base,
    messageType: "unsupported",
    body: "",
  };
}
