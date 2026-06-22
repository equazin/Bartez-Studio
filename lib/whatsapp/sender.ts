// ---------------------------------------------------------------------------
// WhatsApp Cloud API — Message Sender
// ---------------------------------------------------------------------------

import {
  GRAPH_API_BASE,
  WHATSAPP_API_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
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

/**
 * Low-level POST to the messages endpoint.
 * Returns `true` on a 2xx response; logs and returns `false` otherwise.
 */
async function post(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(messagesUrl(), {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[whatsapp/sender] ${res.status} ${res.statusText}`, text);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[whatsapp/sender] Network error", error instanceof Error ? error.message : error);
    return false;
  }
}

// ---- Public API ------------------------------------------------------------

/**
 * Send a plain text message.
 */
export async function sendTextMessage(
  to: string,
  text: string,
): Promise<boolean> {
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
): Promise<boolean> {
  if (buttons.length === 0 || buttons.length > 3) {
    console.error(
      `[whatsapp/sender] Interactive buttons must have 1–3 items, got ${buttons.length}`,
    );
    return false;
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
): Promise<boolean> {
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
