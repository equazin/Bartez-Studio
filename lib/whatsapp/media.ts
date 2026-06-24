// ---------------------------------------------------------------------------
// WhatsApp Cloud API — Media Downloader & Whisper Transcriber
// ---------------------------------------------------------------------------

import { GRAPH_API_BASE, WHATSAPP_API_TOKEN } from "./config.ts";

/**
 * Downloads a media file from WhatsApp Cloud API using its media ID.
 * Returns the file contents as a Buffer.
 */
export async function downloadMedia(mediaId: string): Promise<Buffer> {
  const url = `${GRAPH_API_BASE}/${mediaId}`;
  
  // 1. Fetch media metadata (to get the direct download URL)
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Error al obtener metadatos de multimedia ${mediaId}: ${res.statusText} - ${errorText}`);
  }

  const details = await res.json();
  const mediaUrl = details.url;
  if (!mediaUrl) {
    throw new Error(`No se encontró URL de descarga directa para la multimedia ${mediaId}`);
  }

  // 2. Fetch actual binary payload
  const mediaRes = await fetch(mediaUrl, {
    headers: {
      Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
    },
  });

  if (!mediaRes.ok) {
    const errorText = await mediaRes.text().catch(() => "");
    throw new Error(`Error al descargar archivo multimedia desde ${mediaUrl}: ${mediaRes.statusText} - ${errorText}`);
  }

  const arrayBuffer = await mediaRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Sends an audio buffer to OpenAI Whisper API to transcribe it to text.
 */
export async function transcribeAudio(buffer: Buffer): Promise<string> {
  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey) {
    throw new Error("La variable de entorno OPENAI_API_KEY no está configurada");
  }

  const formData = new FormData();
  
  // Whisper expects a file with a valid extension (WhatsApp audio is usually audio/ogg; codecs=opus)
  const blob = new Blob([new Uint8Array(buffer)], { type: "audio/ogg" });
  formData.append("file", blob, "audio.ogg");
  formData.append("model", "whisper-1");
  formData.append("language", "es"); // Guide transcription to Spanish

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Error en Whisper transcription: ${res.statusText} - ${errorText}`);
  }

  const data = await res.json();
  return data.text || "";
}
