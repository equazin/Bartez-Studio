// ---------------------------------------------------------------------------
// WhatsApp Cloud API — Message Sender
// ---------------------------------------------------------------------------

import {
  GRAPH_API_BASE,
  WHATSAPP_API_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_SANDBOX_NUMBER_NORMALIZATION,
} from "./config.ts";

/** Endpoint for the configured phone-number ID. */
const messagesUrl = () =>
  `${GRAPH_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

/** Shared headers for every Graph API call. */
function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export interface SendResult {
  success: boolean;
  error?: string;
}

/**
 * Optional sandbox-only recipient normalization.
 * Keep disabled in production: real WhatsApp numbers must be sent as Meta delivers them.
 */
function normalizeRecipient(to: string): string {
  if (!WHATSAPP_SANDBOX_NUMBER_NORMALIZATION) return to;

  // Rosario mobile sandbox mapping: incoming 549341... -> allowed-list 5434115...
  if (to.startsWith("549341") && to.length === 13) {
    return "5434115" + to.slice(6);
  }
  return to;
}

/**
 * Low-level POST to the messages endpoint.
 * Returns SendResult.
 */
async function post(payload: Record<string, unknown>): Promise<SendResult> {
  if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_API_TOKEN) {
    return { success: false, error: "WhatsApp Cloud API no configurado" };
  }

  try {
    const normalizedPayload = { ...payload };
    if (normalizedPayload.to && typeof normalizedPayload.to === "string") {
      normalizedPayload.to = normalizeRecipient(normalizedPayload.to);
    }

    const res = await fetch(messagesUrl(), {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ messaging_product: "whatsapp", ...normalizedPayload }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[whatsapp/sender] ${res.status} ${res.statusText}`, text);
      let errorMsg = `${res.status} ${res.statusText}`;
      try {
        const parsed = JSON.parse(text);
        if (parsed.error?.message) {
          errorMsg = parsed.error.message;
        }
      } catch {}
      return { success: false, error: errorMsg };
    }
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(
      "[whatsapp/sender] Network error",
      error instanceof Error ? error.stack || error.message : error,
      "cause:",
      (error as any)?.cause,
    );
    return { success: false, error: `Error de red: ${errorMsg}` };
  }
}

// ---- Public API ------------------------------------------------------------

/**
 * Send a plain text message.
 */
export async function sendTextMessage(
  to: string,
  text: string,
): Promise<SendResult> {
  return post({
    recipient_type: "individual",
    to,
    type: "text",
    text: { preview_url: false, body: text },
  });
}

/**
 * Send an interactive message with up to **3** quick-reply buttons.
 */
export async function sendInteractiveButtons(
  to: string,
  body: string,
  buttons: Array<{ id: string; title: string }>,
): Promise<SendResult> {
  if (buttons.length === 0 || buttons.length > 3) {
    const err = `Interactive buttons must have 1–3 items, got ${buttons.length}`;
    console.error(`[whatsapp/sender] ${err}`);
    return { success: false, error: err };
  }

  return post({
    recipient_type: "individual",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: {
        buttons: buttons.map((btn) => ({
          type: "reply",
          reply: { id: btn.id, title: btn.title },
        })),
      },
    },
  });
}

/**
 * Send an interactive list message (menu with sections & rows).
 */
export async function sendInteractiveList(
  to: string,
  body: string,
  buttonText: string,
  sections: Array<{
    title: string;
    rows: Array<{ id: string; title: string; description?: string }>;
  }>,
): Promise<SendResult> {
  return post({
    recipient_type: "individual",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: body },
      action: {
        button: buttonText,
        sections: sections.map((section) => ({
          title: section.title,
          rows: section.rows.map((row) => ({
            id: row.id,
            title: row.title,
            ...(row.description ? { description: row.description } : {}),
          })),
        })),
      },
    },
  });
}

/**
 * Mark a received message as read (double blue ticks).
 */
export async function markAsRead(messageId: string): Promise<void> {
  await post({
    status: "read",
    message_id: messageId,
  });
}
